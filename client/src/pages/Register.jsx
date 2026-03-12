import { useState } from "react";
import api from "../api/axios";

export default function Register(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const register = async()=>{

    await api.post("/auth/register",{name,email,password});

    alert("Registered successfully");

  };

  return(

    <div className="max-w-md mx-auto mt-20">

      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input
        className="border w-full p-2 mb-2"
        placeholder="Name"
        onChange={e=>setName(e.target.value)}
      />

      <input
        className="border w-full p-2 mb-2"
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border w-full p-2 mb-2"
        placeholder="Password"
        onChange={e=>setPassword(e.target.value)}
      />

      <button
        onClick={register}
        className="bg-blue-600 text-white w-full p-2"
      >
        Register
      </button>

    </div>

  );

}