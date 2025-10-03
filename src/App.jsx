import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PostsPage from "./pages/posts/PostsPage";
import Login from "./pages/login/LoginPage";
import Register from "./pages/register/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";

export default function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <BrowserRouter>
      {token ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/entries" element={<PostsPage />} />
            <Route path="/settings" element={<ProfilePage />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
