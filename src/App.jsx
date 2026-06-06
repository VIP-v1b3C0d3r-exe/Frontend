import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

import Header from "./components/Header/Header";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import EventMapPage from "./pages/MapView/MapPage";
import EventDetailPage from "./pages/EventDetail/EventDetail";
import EventPage from "./pages/MyEvents/EventPage";
import ProfilePage from "./pages/Profile/ProfilePage";

import { getToken } from "./utils/token";
import { getToken, getRoleFromToken } from "./utils/token";
import AdminPage from "./pages/Admin/AdminPage";

function AppContent() {
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("guest");

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());
  const [role, setRole] = useState("admin"); // временно для теста
  // const [role, setRole] = useState(() => localStorage.getItem("role") ?? null);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("guest");

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      // временно закомментировано — role захардкожена как "admin"
      // const savedRole = localStorage.getItem("role");
      // setRole(savedRole);
    }
  }, []);

  const hideHeaderRoutes = ["/login", "/register", "/forgot-password"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && (
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          profileImage={profileImage}
          username={username}
          role={role}
          setRole={setRole}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
        />

        <Route
          path="/register"
          element={
            <RegisterPage
              setProfileImage={setProfileImage}
              setUsername={setUsername}
            />
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/map"
          element={
            isLoggedIn ? <EventMapPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/events/:id"
          element={
            isLoggedIn ? <EventDetailPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/my-events"
          element={
            isLoggedIn ? <EventPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin"
          element={isLoggedIn ? <AdminPage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;