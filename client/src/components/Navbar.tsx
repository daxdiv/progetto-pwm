import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed text-white flex justify-between items-center gap-2 p-2 w-full bg-black border-b border-b-gray-700">
      <Link
        to="/"
        className="font-normal md:font-bold lg:font-bold sm:text-lg md:text-xl lg:text-2xl text-emerald-600"
      >
        SNM
      </Link>
      <ul className="text-xs md:text-lg lg:text-xl flex gap-4">
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
