import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="text-white flex justify-between items-stretch gap-2 p-2 w-full bg-black border-b border-b-gray-700">
      <Link
        to="/"
        className="text-xl"
      >
        Social Network for Music <span className="text-emerald-600">(SNM)</span>
      </Link>
      <ul className="flex gap-4">
        <li>
          <Link
            to="/profile"
            className="text-inherit hover:text-emerald-600"
          >
            Profilo
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;