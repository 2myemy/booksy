import { Route, Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-amber-50 text-slate-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
