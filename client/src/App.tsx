import { Route, Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-amber-50 text-slate-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
