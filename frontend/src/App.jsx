// import Dashboard from "./components/Pages/Dashboard"
// import { BrowserRouter, Routes, Route } from "react-router-dom"
// import AdministratorModule from "./components/Pages/Administrator"
// import Settings from "./components/Pages/Settings"
// import Albay from "./components/Pages/Albay"
// import Catanduanes from "./components/Pages/Catanduanes"
// import Masbate from "./components/Pages/Masbate"
// import Sorsogon from "./components/Pages/Sorsogon"
// import CamNorte from "./components/Pages/CamNorte"
// import CamSur from "./components/Pages/CamSur"
// import SettingsEGOV from "./components/Settings/SettingsEGOV"
// import SettingsUser from "./components/Settings/SettingsUser"
// import SettingseLGU from "./components/Settings/SettingseLGU"
// import SettingsWIFI from "./components/Settings/SettingsWIFI"
// import SettingsPNPKI from "./components/Settings/SettingsPNPKI"
// import SettingsILCDB from "./components/Settings/SettingsILCDB"
// import SettingsCybersecurity from "./components/Settings/SettingsCybersecurity"
// import Calendar from "./components/Pages/albayCalendar"
// import Login from "./components/Pages/Login"
// import ProtectedRoute from "./components/Pages/ProtectedRoute"

// function App() {
//   return (
//     <div className="min-h-screen w-full overflow-x-hidden font-customFont1 bg-[#050816] text-white">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>} 
//           />
//           {/* <Route path="/administrator" element={<AdministratorModule />} /> */}
//           {/* <Route path="/settings" element={<Settings />} /> */}
//           <Route path="/albay" element={
//             <ProtectedRoute>
//               <Albay />
//             </ProtectedRoute>} />
//           <Route path="/catanduanes" element={
//             <ProtectedRoute>
//               <Catanduanes />
//             </ProtectedRoute>} />
//           <Route path="/masbate" element={
//             <ProtectedRoute>
//               <Masbate />
//             </ProtectedRoute>} />
//           <Route path="/sorsogon" element={
//             <ProtectedRoute>
//               <Sorsogon />
//             </ProtectedRoute>} />
//           <Route path="/camnorte" element={
//             <ProtectedRoute>
//               <CamNorte />
//             </ProtectedRoute>} />
//           <Route path="/camsur" element={
//             <ProtectedRoute>
//               <CamSur />
//             </ProtectedRoute>} />

//           <Route path="/calendar" element={
//             <ProtectedRoute>
//               <Calendar />
//             </ProtectedRoute>} />
//           {/* firebase auth LOGIN*/}
//           <Route path="/login" element={<Login />} /> 

//           {/* settings part */}
//           <Route path="/settings/egov" element={
//             <ProtectedRoute>
//               <SettingsEGOV />
//             </ProtectedRoute>} />
//           <Route path="/settings/user" element={
//             <ProtectedRoute
//              allowedEmails={[
//               "ace.malto@dict.gov.ph"
//             ]}>
//               <SettingsUser />
//             </ProtectedRoute>} />
//           <Route path="/settings/elgu" element={
//             <ProtectedRoute>
//               <SettingseLGU />
//             </ProtectedRoute>} />
//           <Route path="/settings/wifi" element={
//             <ProtectedRoute>
//               <SettingsWIFI />
//             </ProtectedRoute>} />
//           <Route path="/settings/pnpki" element={
//             <ProtectedRoute>
//               <SettingsPNPKI />
//             </ProtectedRoute>} />
//           <Route path="/settings/ilcdb" element={
//             <ProtectedRoute>
//               <SettingsILCDB />
//             </ProtectedRoute>} />
//           <Route path="/settings/cybersecurity" element={
//             <ProtectedRoute>
//               <SettingsCybersecurity />
//             </ProtectedRoute>} />
//           {/* settings part end  */}
//         </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }

// export default App

//#region With Firebase Authentication


// import Dashboard from "./components/Pages/Dashboard"
// import { BrowserRouter, Routes, Route } from "react-router-dom"
// import AdministratorModule from "./components/Pages/Administrator"
// import Settings from "./components/Pages/Settings"
// import Albay from "./components/Pages/Albay"
// import Catanduanes from "./components/Pages/Catanduanes"
// import Masbate from "./components/Pages/Masbate"
// import Sorsogon from "./components/Pages/Sorsogon"
// import CamNorte from "./components/Pages/CamNorte"
// import CamSur from "./components/Pages/CamSur"
// import SettingsEGOV from "./components/Settings/SettingsEGOV"
// import SettingsUser from "./components/Settings/SettingsUser"
// import SettingseLGU from "./components/Settings/SettingseLGU"
// import SettingsWIFI from "./components/Settings/SettingsWIFI"
// import SettingsPNPKI from "./components/Settings/SettingsPNPKI"
// import SettingsILCDB from "./components/Settings/SettingsILCDB"
// import SettingsCybersecurity from "./components/Settings/SettingsCybersecurity"
// import Calendar from "./components/Pages/albayCalendar"
// import Login from "./components/Pages/Login"
// import ProtectedRoute from "./components/Pages/ProtectedRoute"
// import Dtr from './components/Pages/Dtr'


// function App() {
//   return (
//     <div className="min-h-screen w-full overflow-x-hidden font-customFont1 bg-[#050816] text-white">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>} 
//           />
//           {/* <Route path="/administrator" element={<AdministratorModule />} /> */}
//           {/* <Route path="/settings" element={<Settings />} /> */}
//           <Route path="/albay" element={
//             <ProtectedRoute
//              allowedEmails={[
//               "ace.malto@dict.gov.ph",
//               "renejane.buena@dict.gov.ph",
//               "princess.borlagdan@dict.gov.ph",
//               "noel.dollentas@dict.gov.ph",
//               "john.penaflor@dict.gov.ph",
//              ]}>
//               <Albay />
//             </ProtectedRoute>} />
//             <Route path="/DailyTimeRecord" element={
//               <ProtectedRoute>
//                 <Dtr />
//               </ProtectedRoute>} 
//             />
//             <Route path="/catanduanes" element={
//             <ProtectedRoute>
//               <Catanduanes />
//             </ProtectedRoute>} />
//           <Route path="/masbate" element={
//             <ProtectedRoute>
//               <Masbate />
//             </ProtectedRoute>} />
//           <Route path="/sorsogon" element={
//             <ProtectedRoute>
//               <Sorsogon />
//             </ProtectedRoute>} />
//           <Route path="/camnorte" element={
//             <ProtectedRoute>
//               <CamNorte />
//             </ProtectedRoute>} />
//           <Route path="/camsur" element={
//             <ProtectedRoute>
//               <CamSur />
//             </ProtectedRoute>} />

//           <Route path="/calendar" element={
//             <ProtectedRoute>
//               <Calendar />
//             </ProtectedRoute>} />
//           {/* firebase auth LOGIN*/}
//           <Route path="/login" element={<Login />} /> 

//           {/* settings part */}
//           <Route path="/settings/egov" element={
//             <ProtectedRoute
//              allowedEmails={[
//               "ace.malto@dict.gov.ph",
//               "renejane.buena@dict.gov.ph",
//               "princess.borlagdan@dict.gov.ph"
//             ]}>
//               <SettingsEGOV />
//             </ProtectedRoute>} />
//           <Route path="/settings/user" element={
//             <ProtectedRoute
//              allowedEmails={[
//               "ace.malto@dict.gov.ph"
//             ]}>
//               <SettingsUser />
//             </ProtectedRoute>} />
//           <Route path="/settings/elgu" element={
//             <ProtectedRoute
//              allowedEmails={[
//               "ace.malto@dict.gov.ph",
//               "renejane.buena@dict.gov.ph",
//               "princess.borlagdan@dict.gov.ph",
//               "kelvin.cantero@dict.gov.ph"
//             ]}>
//               <SettingseLGU />
//             </ProtectedRoute>} />
//           <Route path="/settings/wifi" element={
//             <ProtectedRoute>
//               <SettingsWIFI />
//             </ProtectedRoute>} />
//           <Route path="/settings/pnpki" element={
//             <ProtectedRoute
//              allowedEmails={[
//               "ace.malto@dict.gov.ph",
//               "renejane.buena@dict.gov.ph",
//               "princess.borlagdan@dict.gov.ph",
//               "john.penaflor@dict.gov.ph"
//             ]}>
//               <SettingsPNPKI />
//             </ProtectedRoute>} />
//           <Route path="/settings/ilcdb" element={
//             <ProtectedRoute
//              allowedEmails={[
//               "renejane.buena@dict.gov.ph",
//               "princess.borlagdan@dict.gov.ph",
//               "noel.dollentas@dict.gov.ph",
//               "john.penaflor@dict.gov.ph",
//             ]}>
//               <SettingsILCDB />
//             </ProtectedRoute>} />
//           <Route path="/settings/cybersecurity" element={
//             <ProtectedRoute
//              allowedEmails={[
//               "ace.malto@dict.gov.ph",
//               "renejane.buena@dict.gov.ph",
//               "princess.borlagdan@dict.gov.ph",
//               "john.penaflor@dict.gov.ph"
//             ]}>
//               <SettingsCybersecurity />
//             </ProtectedRoute>} />
//           {/* settings part end  */}
//         </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }

// export default App


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
import Calendar from "./components/Pages/albayCalendar"
import Login from "./components/Pages/Login"
import Dtr from "./components/Pages/Dtr"

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden font-customFont1 bg-[#050816] text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* <Route path="/administrator" element={<AdministratorModule />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}

          <Route path="/albay" element={<Albay />} />
          <Route path="/DailyTimeRecord" element={<Dtr />} />
          <Route path="/catanduanes" element={<Catanduanes />} />
          <Route path="/masbate" element={<Masbate />} />
          <Route path="/sorsogon" element={<Sorsogon />} />
          <Route path="/camnorte" element={<CamNorte />} />
          <Route path="/camsur" element={<CamSur />} />

          <Route path="/calendar" element={<Calendar />} />

          {/* firebase auth LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* settings */}
          <Route path="/settings/egov" element={<SettingsEGOV />} />
          <Route path="/settings/user" element={<SettingsUser />} />
          <Route path="/settings/elgu" element={<SettingseLGU />} />
          <Route path="/settings/wifi" element={<SettingsWIFI />} />
          <Route path="/settings/pnpki" element={<SettingsPNPKI />} />
          <Route path="/settings/ilcdb" element={<SettingsILCDB />} />
          <Route
            path="/settings/cybersecurity"
            element={<SettingsCybersecurity />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App