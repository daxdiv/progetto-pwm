import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed text-white flex justify-between items-stretch gap-2 p-2 w-full bg-black border-b border-b-gray-700">
      <Link
        to="/"
        className="text-xl"
      >
        Social Network for Music <span className="text-emerald-600 font-bold">(SNM)</span>
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
        <li>
          <Link
            to="/playlist/new"
            className="text-inherit hover:text-emerald-600"
          >
            Crea playlist
          </Link>
        </li>
        <li>
          <Link
            to="/playlist/browse"
            className="text-inherit hover:text-emerald-600"
          >
            Sfoglia playlist
          </Link>
        </li>
        <li>
          <Link
            to="/sign-up"
            className="text-inherit hover:text-emerald-600"
          >
            Registrati
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
