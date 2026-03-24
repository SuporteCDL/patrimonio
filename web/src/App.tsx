import { BrowserRouter } from "react-router-dom"
import Menu from "@/components/menu"
import { useAuth } from "@/context/AuthContext"
import { Login } from "./pages/login"

export default function App() {
  const { user }  = useAuth()

  return (
    <BrowserRouter>
      {user === null ? <Login /> : <Menu /> }
      {/* <Menu /> */}
    </BrowserRouter>
  )
}