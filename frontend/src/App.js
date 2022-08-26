import * as React from 'react';
import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { HiLocationMarker } from 'react-icons/hi';
import { AiFillStar } from 'react-icons/ai';
import axios from 'axios';
import { format } from 'timeago.js'
import Register from './components/Register';
import Login from "./components/Login";


function App() {
  
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);

  const [newPlace, setNewPlace] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  }

  const handleAddClick = (e) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;
    setNewPlace({
      lat,
      lng
    });



  };

  const handleLogout = () =>{
    myStorage.removeItem("user");
    setCurrentUsername(null);
  }
  return (
    <div className="App"> 
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        initialViewState={{
          longitude: 72.8777,
          latitude: 19.0760,
          zoom: 10
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
      >
        {pins.map((prod) => (
          <>
            <Marker
              longitude={prod.long}
              latitude={prod.lat}
              style={{ position: "absolute" }}>

              <HiLocationMarker onClick={() => handleMarkerClick(prod._id)} style={{ fontSize: "50px", color: prod.username === currentUsername ? "tomato" : "red", cursor: "pointer" }} />
            </Marker>

            {prod._id === currentPlaceId && (
              <Popup
                key={prod._id}
                latitude={prod.lat}
                longitude={prod.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{prod.title}</h4>
                  <label>Review</label>
                  <p className="desc">{prod.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(prod.rating).fill(<AiFillStar className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{prod.username}</b>
                  </span>
                  <span className="date">{format(prod.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.lng}

            >
              <HiLocationMarker
                style={{
                  fontSize: "50px",
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.lng}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    style={{ border: "1px  solid black", color: "#121212" }}
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    style={{ border: "1px  solid black", color: "#121212" }}
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)} style={{ marginTop: "1rem" }}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}

        {currentUsername ? (
          <button className="button logout" onClick={handleLogout} >
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => {setShowLogin(true);
            setShowRegister(false); }}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => {setShowRegister(true); 
              setShowLogin(false);} }
              
            >
              Register
            </button>
          </div>
        )}

        {showRegister && <Register setShowRegister={setShowRegister} />}

          {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}



      </Map>
    </div>
  );
}

export default App;
