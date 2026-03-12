import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-blue-900 text-white p-4 flex justify-between">

      <Link to="/" className="text-xl font-bold">
        ✈ FlightBook
      </Link>

      <div className="flex gap-6">
        <Link to="/">Search</Link>
        <Link to="/login">Login</Link>
      </div>

    </div>
  );
}