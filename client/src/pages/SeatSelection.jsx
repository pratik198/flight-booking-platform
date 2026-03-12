import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function SeatSelection(){

  const { flightId } = useParams();

  const [seats,setSeats] = useState([]);

  useEffect(()=>{

    api.get(`/seats/${flightId}`)
      .then(res=>setSeats(res.data));

  },[flightId]);

  const holdSeat = async(seatId)=>{

    await api.post("/seats/hold",{seatId},{
      headers:{
        Authorization:localStorage.getItem("token")
      }
    });

    alert("Seat held");

  };

  return(

    <div className="max-w-4xl mx-auto mt-10">

      <h2 className="text-xl font-bold mb-4">Select Seat</h2>

      <div className="grid grid-cols-6 gap-2">

        {seats.map(seat=>{

          let color="bg-green-400";

          if(seat.status==="held") color="bg-yellow-400";
          if(seat.status==="booked") color="bg-red-500";

          return(

            <button
              key={seat._id}
              onClick={()=>holdSeat(seat._id)}
              className={`${color} p-2`}
            >
              {seat.seatNumber}
            </button>

          );

        })}

      </div>

    </div>

  );

}