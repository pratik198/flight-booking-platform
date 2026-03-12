import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaPlaneDeparture } from "react-icons/fa";

export default function Header() {

  const [open,setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (

    <header className="bg-blue-900 text-white shadow">

      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* LOGO */}

        <Link to="/" className="flex items-center gap-2 text-xl font-bold">

          <FaPlaneDeparture className="text-2xl"/>
          FlightBook

        </Link>


        {/* NAVIGATION */}

        <nav className="hidden md:flex items-center gap-8">

          <Link to="/" className="hover:text-blue-300">
            Book
          </Link>

          <Link to="/bookings" className="hover:text-blue-300">
            Trips
          </Link>

          <Link to="/checkin" className="hover:text-blue-300">
            Check-in
          </Link>

        </nav>


        {/* SEARCH BAR */}

        <div className="hidden md:flex">

          <input
            placeholder="Search flights..."
            className="px-3 py-1 rounded text-black w-64"
          />

        </div>


        {/* PROFILE */}

        <div className="relative">

          <button
            onClick={()=>setOpen(!open)}
            className="flex items-center gap-2"
          >

            <FaUserCircle size={28}/>

          </button>


          {/* DROPDOWN */}

          {open && (

            <div className="absolute right-0 mt-2 bg-white text-black w-40 rounded shadow">

              {!token && (

                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </>

              )}

              {token && (

                <>
                  <Link
                    to="/bookings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Bookings
                  </Link>

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>

              )}

            </div>

          )}

        </div>

      </div>

    </header>

  );

}