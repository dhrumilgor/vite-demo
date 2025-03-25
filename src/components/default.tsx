import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DefaultComponent = ()=>{
    const navigate = useNavigate();
    const {isAuthenticated,setIsAuthenticated} = useAuth()
    const login = ()=>{
        localStorage.setItem('isLogin', 'true');
        setIsAuthenticated('true');
        navigate('/dashboard');
    }

    useEffect(()=>{
        if(localStorage.getItem('isLogin') === 'true'){
            navigate('/dashboard');
        }
    },[navigate]) 


    return (
        <>

        <div className="">
           
        <div className="min-h-[500px] flex justify-center mt-10  ">    
            <div className="w-[300px] bg-white shadow-lg rounded-lg p-6 text-center mt-[10px] ">     
        <h1 className="mt-2 text-3xl pb-6 text-bold">Login </h1>
        <div>
            <div className="text-left">
                <label className="">Username</label>
                <input type="text" name="username" placeholder="type your username" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="text-left">
                <label className="">Password</label>
                <input type="password" name="password" placeholder="type your password" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
        </div>
        <div className="mt-3 ">
        <button onClick={login} className="w-full bg-gradient-custom w-100% text-white rounded  text-3xl bg-blue-500 p-2 cursor-pointer">Login </button>
        </div>
        </div>
        </div>
        </div>
      
        </>
    )
}

export default DefaultComponent;