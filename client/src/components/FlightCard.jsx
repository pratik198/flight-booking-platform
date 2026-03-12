import { useNavigate } from "react-router-dom";

export default function FlightCard({flight}){

  const navigate = useNavigate();

  return(

    <div className="border p-4 mb-4 flex justify-between items-center rounded">

      <div>

        <h3 className="font-bold">{flight.airline}</h3>

        <p>{flight.origin} → {flight.destination}</p>

        <p>{new Date(flight.departureTime).toLocaleTimeString()}</p>

      </div>

      <div>

        <p className="text-xl font-bold">₹{flight.price}</p>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          onClick={()=>navigate(`/seats/${flight._id}`)}
        >
          Select Seat
        </button>

      </div>

    </div>

  );

}