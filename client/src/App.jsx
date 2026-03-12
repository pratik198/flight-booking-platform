import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchFlights from "./pages/SearchFlights";
import FlightResults from "./pages/FlightResults";
import SeatSelection from "./pages/SeatSelection";
import Header from "./components/Header";
function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>
      {/* <Route path="/" element={<Header />} /> */}
        
        <Route path="/" element={<SearchFlights />} />

        <Route path="/flights" element={<FlightResults />} />

        <Route path="/seats/:flightId" element={<SeatSelection />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;