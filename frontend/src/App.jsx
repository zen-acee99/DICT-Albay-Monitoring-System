import Dashboard from "./components/Pages/Dashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdministratorModule from "./components/Pages/Administrator"

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden font-customFont1 bg-[#050816] text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/administrator" element={<AdministratorModule />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App