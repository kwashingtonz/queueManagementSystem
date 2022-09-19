import { useContext ,useDebugValue,useEffect} from "react";
import AuthContext from "../context/AuthProvider";


const useAuth = () => {
    const { auth,setAuth} = useContext(AuthContext)

    /* useEffect(()=>{

     const data =JSON.parse(localStorage.getItem('user'))
         
      setAuth(data)
    console.log(data)
      },[]) */
    
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth