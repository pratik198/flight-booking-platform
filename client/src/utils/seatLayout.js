export function formatSeatLayout(seats){

  const rows={};

  seats.forEach(s=>{

    const row=s.seatNumber.slice(0,-1);

    if(!rows[row]) rows[row]=[];

    rows[row].push(s);

  });

  return rows;

}