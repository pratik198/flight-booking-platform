import { useState } from "react";

export default function AirportSelect({
  label,
  airports,
  value,
  setValue
}) {

  const [open,setOpen] = useState(false);
  const [query,setQuery] = useState("");

  const filtered = airports.filter(a =>
    a.toLowerCase().includes(query.toLowerCase())
  );

  return (

    <div className="relative">

      <input
        placeholder={label}
        value={value || query}
        onFocus={()=>setOpen(true)}
        onChange={(e)=>setQuery(e.target.value)}
        className="border p-3 w-full rounded"
      />

      {open && (

        <div className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-y-auto shadow rounded">

          {filtered.map((airport)=>(
            <div
              key={airport}
              onClick={()=>{
                setValue(airport);
                setOpen(false);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              ✈ {airport}
            </div>
          ))}

        </div>

      )}

    </div>

  );

}