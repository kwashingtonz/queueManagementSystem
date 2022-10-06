import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import {Form,Button,Row,Col,Card} from 'react-bootstrap';
import useAuth from "../hooks/useAuth";
import axios ,{BASE_URL}from '../api/axios';
import QueueDisplay from './QueueDisplay';
import { useNavigate} from 'react-router-dom';
import Socket from './Socket';

export default function IssueInput() {
 
  const { auth,setAuth } = useAuth();
  const [username,setUsername] = useState('')
  const [name,setName]=useState('')
  const [telephone,setTelephone]=useState('')
  const [email,setEmail]=useState('')
  const [issue,setIssue]=useState('')
  const [sendissue,SetSendissue]=useState(false)
  const [counter,setCounter]=useState('')
  const [queuenum,setQueuenum]=useState('')
  const navigate = useNavigate();
  
  
  const Token=auth?.accessToken

  const authAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization :`Bearer ${Token}`
    }
  })

  
  useEffect(() => {

    const fetchuser = async () => {
       try {
        const res = await authAxios.get(`nuser/havingIssue`)
       
        if(res.data.havingIssue==0)
        {
          SetSendissue(false)
        }
        else{
          SetSendissue(true)
          setCounter(res.data.issue.counter)
          setQueuenum(res.data.issue.queueNo)
          console.log(queuenum)
        }
        
       setUsername(auth?.username)
       
       } catch (error) {
              console.log(error)     
       }
    }  



    
    fetchuser();
  },[])

  Socket.off("refreshDis").on("refreshDis", (data) => {
    const refresh = data.ref
    if(refresh==1)
    {
      window.location.reload()
    }
})
 

  const logout = async () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem(auth?.username);
      setAuth();
    } 
   catch (error) {
          console.log(error);         
   }
  }


  useEffect(()=>{

    const data =JSON.parse(localStorage.getItem(auth?.username))
         
    setAuth(data)
  },[])
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      console.log(name,telephone,issue,email)

      const res = await authAxios.post('nuser/createIssue',
          JSON.stringify({ name:name,telephone:telephone,email:email,issue:issue }),
          {
            headers: { 'Content-Type': 'application/json' }        
        }
          
          );
         
          setEmail('')
          setIssue('')
          setName('')
          setTelephone('')
          
          setCounter(res.data.counter)
          setQueuenum(res.data.queueNo)

          SetSendissue(true)

          Socket.emit("refreshIssues", {
            ref:1
          });

      

  } catch (error) {
    console.log(error);
  }

  }
 
  return (
      <div>
        <>{sendissue ? (
               <QueueDisplay counter={counter} queuenum={queuenum}/>
            ) : (
                <section>
    <Row>
   
   <Col>
  
   <Card.Body id="profilename"  border="primary" style={{ width: '13rem' }}>
   <h6>{username}</h6>
   <Button id='logoutbtn' variant="outline-danger"
      onClick={() => logout()}
    >Logout</Button>
   </Card.Body>
   </Col>
 </Row>
         <Row>
         <Col md={{ span: 8, offset: 2 }}>
         <form onSubmit={handleSubmit}>
           
           <Form.Group role="form" className="" controlId="formName">
             <Form.Label>Name</Form.Label>
             <Form.Control type="text" placeholder="Enter Name"
               onChange={(e) => setName(e.target.value)}
               value={name}
               required
             
             />
             

            <Form.Group className="mx-auto" controlId="formTelephone">
           <Form.Label>Telephone</Form.Label>
           <Form.Control type="text" placeholder="Telephone" 
              onChange={(e) => setTelephone(e.target.value)}
              value={telephone}
              required           
           />
           </Form.Group>

           <Form.Group className="mx-auto" controlId="formEmail">
           <Form.Label>Email</Form.Label>
           <Form.Control type="text" placeholder="Email" 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
           
           />
           </Form.Group>
           
           <Form.Group className="mx-auto" controlId="formIssue">
           <Form.Label>Issue</Form.Label>
           <Form.Control type="text" placeholder="Issue"
               onChange={(e) => setIssue(e.target.value)}
               value={issue}
               required
           
           />
           </Form.Group>
            <Button id='submitbtn' variant="primary" type="submit">
             Submit
          </Button>
          </Form.Group>
        </form>
             </Col>
         </Row>
        
       
       </section>
       )}
       </>
        </div>
   
  )
}
