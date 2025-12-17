import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ListBook from "./pages/ListBook";
import RequireAuth from "./auth/RequireAuth";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-amber-50 text-slate-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/list"
          element={
            <RequireAuth>
              <ListBook />
            </RequireAuth>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/shelf" element={<div className="mx-auto max-w-6xl px-4 py-10">My shelf (coming soon)</div>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
