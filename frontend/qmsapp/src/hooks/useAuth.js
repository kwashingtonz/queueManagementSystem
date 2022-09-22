import { useContext ,useDebugValue} from "react";
import AuthContext from "../context/AuthProvider";


const useAuth = () => {
    const { auth } = useContext(AuthContext) //setAuth
    
    useDebugValue(auth, auth => auth?.username ? "Logged In" : "Logged Out") //auth?.user
    return useContext(AuthContext);
}

export default useAuth