import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header/Header";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import EventMapPage from "./pages/MapView/MapPage";
import EventDetailPage from "./pages/EventDetail/EventDetail";
import EventPage from "./pages/MyEvents/EventPage";
import ProfilePage from "./pages/Profile/ProfilePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
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

        <Route path="/map" element={<EventMapPage />} />

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
    </BrowserRouter>
  );
}

export default App;