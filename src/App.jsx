import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header/Header";
import HomePage from "./pages/Home/HomePage";
import EventMapPage from "./pages/MapView/MapPage";
import LoginPage from "./pages/Login/LoginPage";
import EventDetailPage from "./pages/EventDetail/EventDetail";
import RegisterPage from "./pages/Register/RegisterPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import EventPage from "./pages/MyEvents/EventPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Header 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
      />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/map"
          element={<EventMapPage/>}
          // element={isLoggedIn ? <EventMapPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/events/:id"
          element={isLoggedIn ? <EventDetailPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/my-events"
          element={isLoggedIn ? <EventPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;