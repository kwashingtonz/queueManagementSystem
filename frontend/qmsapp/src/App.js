import { BrowserRouter,Routes,Route,} from "react-router-dom";

import  Login  from './components/Login'
import RequireAuth from './components/RequireAuth';
import IssueInput from './components/IssueInput';
import Notifications from './components/Notifications';
import QueueDisplay from './components/QueueDisplay';
import Counter from './components/Counter';
import CounterCall from './components/CounterCall';

function App() {

  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} /> 

      <Route element={<RequireAuth/>}>
    
          <Route path="/issueinput" element={<IssueInput/>}/>
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/queuedisplay" element={<QueueDisplay/>}/>

          <Route path="/counter" element={<Counter />} />
          <Route path="/countercall/:id" element={<CounterCall/>}/>

      </Route>

      
    </Routes>
  </BrowserRouter>
  );
}

export default App



