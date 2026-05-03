import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/map" element={<div>Map</div>} />
        <Route path="/events/:id" element={<div>Event Detail</div>} />
        <Route path="/my-events" element={<div>My Events</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;