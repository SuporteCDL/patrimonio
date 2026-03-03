import { useAuth } from "@/context/AuthContext"
import { FiCheckSquare, FiXSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Logout() {
  const { logout } = useAuth()

  return (
    <div className='w-full h-screen overflow-y-auto bg-white'>
      <div className="pl-3">
        <h1 className="font-bold text-sm text-center">TEM CERTEZA QUE DESEJA SAIR?</h1>

        <div className="flex flex-row justify-center items-center mt-6 gap-4 w-full">
          <button onClick={logout} className="flex flex-row justify-center items-center gap-4 p-2 rounded text-white w-40 bg-green-600 hover:bg-green-500" type="button">
            <FiCheckSquare size={20} />
            Sim
          </button>

          <Link to="/home" className="flex flex-row justify-center items-center gap-4 p-2 rounded text-white w-40 bg-red-600 hover:bg-red-500" type="button">
            <FiXSquare size={20} />
            Não
          </Link>
        </div>

      </div>
    </div>
  )
}