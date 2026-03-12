export default function SeatMap({seats,onSelect}){

  return(

    <div className="grid grid-cols-6 gap-2">

      {seats.map(seat=>{

        let color="bg-green-400";

        if(seat.status==="held") color="bg-yellow-400";
        if(seat.status==="booked") color="bg-red-500";

        return(

          <button
            key={seat._id}
            onClick={()=>onSelect(seat)}
            className={`${color} p-2`}
          >
            {seat.seatNumber}
          </button>

        );

      })}

    </div>

  );

}