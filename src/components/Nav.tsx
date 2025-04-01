import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import useAuthStore,{updateTokenFromStore} from "../store/authStore";

const NavComponents = () => {
const isLogin = localStorage.getItem('isLogin') || "false";
const {setIsAuthenticated} = useAuth()

 const navigate = useNavigate();
    function Logout(){
        localStorage.clear();
        setIsAuthenticated("false");
        navigate('/')  
    }
    const accessToken = updateTokenFromStore();
    useEffect(() => {
        document.body.classList.add(isLogin==='false' ? "bg-gradient-custom" : "bg-gray-200");
        return () => {
          document.body.classList.remove("bg-gradient-custom", "bg-gray-200");
        };
      }, [isLogin]);

    return (
        <>
        <div className=" bg-lime-200 p-2 ">
        <ul className="flex gap-4 flex-between">
            <li>
                <Link to="/">Home -- {accessToken} </Link>
            </li>
            {isLogin==='true' && 
            <>
            <li>
                <Link to="/dashboard">Dashboard</Link>
            </li>

            <li>
                <Link to="/users">Users</Link>
            </li>
          
            <li className="ml-auto">
                <button className="cursor-pointer btn-primary" type="button" onClick={() => Logout()}>Logout</button>
            </li>
            </>
            }
        </ul>
        </div>
        </>
    )
}

export default NavComponents;