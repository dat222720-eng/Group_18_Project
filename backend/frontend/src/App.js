import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/Profile";
import AdminUsersPage from "./pages/AdminUsersPage";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgot" element={<Forgot/>} />
        <Route path="/reset" element={<Reset/>} />

        <Route path="/profile" element={
          <RequireAuth><ProfilePage/></RequireAuth>
        }/>

        <Route path="/admin/users" element={
          <RequireAuth><AdminUsersPage/></RequireAuth>
        }/>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
