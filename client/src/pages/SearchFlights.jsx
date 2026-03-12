import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AirportSelect from "../components/AirportSelect";

export default function SearchFlights(){

  const navigate = useNavigate();

  const [routes,setRoutes] = useState([]);

  const [origin,setOrigin] = useState("");
  const [destination,setDestination] = useState("");
  const [date,setDate] = useState("");

  useEffect(()=>{

    api.get("/flights/routes")
      .then(res=>setRoutes(res.data));

  },[]);

  const airports = [
    ...new Set([
      ...routes.map(r=>r.origin),
      ...routes.map(r=>r.destination)
    ])
  ];

  const search=()=>{

    navigate(`/flights?origin=${origin}&destination=${destination}&date=${date}`);

  };

  return(

    <div className="max-w-5xl mx-auto mt-20 bg-white shadow-lg p-6 rounded-lg">

      <h2 className="text-2xl font-bold mb-4">
        Search Flights
      </h2>

      <div className="grid grid-cols-4 gap-4">

        <AirportSelect
          label="From"
          airports={airports}
          value={origin}
          setValue={setOrigin}
        />

        <AirportSelect
          label="To"
          airports={airports}
          value={destination}
          setValue={setDestination}
        />

        <input
          type="date"
          className="border p-3 rounded"
          onChange={e=>setDate(e.target.value)}
        />

        <button
          onClick={search}
          className="bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>

      </div>

    </div>

  );

}