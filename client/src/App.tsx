import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ListBook from "./pages/ListBook";
import Books from "./pages/Books";
import MyBooks from "./pages/MyBooks";
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

        <Route path="/books" element={<Books />} />
        <Route
          path="/shelf"
          element={
            <RequireAuth>
              <MyBooks />
            </RequireAuth>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
