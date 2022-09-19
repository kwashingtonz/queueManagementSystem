import { useEffect,useRef,useState } from 'react'

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import  Login  from './components/Login'
import RequireAuth from './components/RequireAuth';
import IssueInput from './components/IssueInput';
import Notifications from './components/Notifications';
import QueueDisplay from './components/QueueDisplay';

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);
  


   /*  useEffect(() => {
    Socket=(io("http://localhost:8000"))
    Object.freeze(Socket)
    //console.log(Socket.socketio)
  }, []); */


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} /> 

      <Route element={<RequireAuth/>}>
    
          <Route path="/issueinput" element={<IssueInput/>}/>
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/queuedisplay" element={<QueueDisplay/>}/>

      </Route>

      
    </Routes>
  </BrowserRouter>
  );
}

export default App



