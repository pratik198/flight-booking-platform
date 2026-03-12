import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import FlightCard from "../components/FlightCard";

export default function FlightResults(){

  const [flights,setFlights] = useState([]);

  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const origin = params.get("origin");
  const destination = params.get("destination");

  useEffect(()=>{

    api.get(`/flights/search?origin=${origin}&destination=${destination}`)
      .then(res=>setFlights(res.data.flights));

  },[]);

  return(

    <div className="max-w-5xl mx-auto mt-10">

      {flights.map(f=>(
        <FlightCard key={f._id} flight={f}/>
      ))}

    </div>

  );

}