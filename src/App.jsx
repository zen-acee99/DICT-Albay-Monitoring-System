import Dashboard from "./components/Pages/Dashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="w-screen h-screen font-customFont1 bg-[#050816] text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
