import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async () => {
    try{
      const res = await api.post("/auth/login",{email,password});
      localStorage.setItem("token",res.data.token);
      alert("Login successful");
    }catch(err){
      alert("Login failed");
    }
  };

  return(
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        className="border w-full p-2 mb-2"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border w-full p-2 mb-2"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-blue-600 text-white w-full p-2"
      >
        Login
      </button>
    </div>
  );
}