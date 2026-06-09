import Dashboard from "./components/Pages/Dashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdministratorModule from "./components/Pages/Administrator"
import Settings from "./components/Pages/Settings"
import Albay from "./components/Pages/Albay"
import Catanduanes from "./components/Pages/Catanduanes"
import Masbate from "./components/Pages/Masbate"
import Sorsogon from "./components/Pages/Sorsogon"
import CamNorte from "./components/Pages/CamNorte"
import CamSur from "./components/Pages/CamSur"
import SettingsEGOV from "./components/Settings/SettingsEGOV"
import SettingsUser from "./components/Settings/SettingsUser"
import SettingseLGU from "./components/Settings/SettingseLGU"
import SettingsWIFI from "./components/Settings/SettingsWIFI"
import SettingsPNPKI from "./components/Settings/SettingsPNPKI"
import SettingsILCDB from "./components/Settings/SettingsILCDB"
import SettingsCybersecurity from "./components/Settings/SettingsCybersecurity"

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden font-customFont1 bg-[#050816] text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/administrator" element={<AdministratorModule />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/albay" element={<Albay />} />
          <Route path="/catanduanes" element={<Catanduanes />} />
          <Route path="/masbate" element={<Masbate />} />
          <Route path="/sorsogon" element={<Sorsogon />} />
          <Route path="/camnorte" element={<CamNorte />} />
          <Route path="/camsur" element={<CamSur />} />

          {/* settings part */}
          <Route path="/settings/egov" element={<SettingsEGOV />} />
          <Route path="/settings/user" element={<SettingsUser />} />
          <Route path="/settings/elgu" element={<SettingseLGU />} />
          <Route path="/settings/wifi" element={<SettingsWIFI />} />
          <Route path="/settings/pnpki" element={<SettingsPNPKI />} />
          <Route path="/settings/ilcdb" element={<SettingsILCDB />} />
          <Route path="/settings/cybersecurity" element={<SettingsCybersecurity />} />
          {/* settings part end  */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App