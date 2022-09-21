import React,{useEffect,useState} from 'react'
import { Col, Container,Row,Badge,Card,Button} from 'react-bootstrap'
import { Link,useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {io} from 'socket.io-client'
import Socket from './Socket';
import NotifyCard from './NotifyCard';
import { ToastContainer, toast } from 'react-toastify';
import axios,{BASE_URL} from '../api/axios';
import 'react-toastify/dist/ReactToastify.css';


export default function Notifications() {

    const { auth,setAuth } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [username,setUsername]=useState('')
    const [nullvalue,setNull]=useState(false)

    const Token=auth?.accessToken

  const authAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization :`Bearer ${Token}`
    }
  })
   
    useEffect(() => {

      setUsername(auth?.username)

      const fetchNotification = async (page) => {
        try {
         
         const response = await authAxios.get('nuser/getNotifications');
         if(!response.data.length==0)
         {  
          setNotifications(response.data);
        }
         else{
           setNull(true)
         }
        } catch (error) {
               console.log(error);         
        }
      }


      

     
      fetchNotification();
    }, [])

    
 
      const nw =  JSON.parse(localStorage.getItem('notifications'))
  

   
    
    const rendernotifylist = notifications.map((notification) =>(
      <NotifyCard
      notification={notification}
      key={notification.id}
    
      />
    )) 

  
    const logout = async () => {
        try {

          localStorage.clear();
          setAuth();
        } 
       catch (error) {
              console.log(error);         
       }
      }

      // const notify = () => {
        
      //   toast("Wow so easy!");
      // }
  return (
    <Container>
    <Row>
      <Col></Col>
    <Col>
      
        <Card.Body id="profilename"  border="primary" style={{ width: '13rem' }}>
        <Badge pill bg="primary"><h6>{username}</h6></Badge>
        <Button id='logoutbtn' variant="outline-danger"
          onClick={() => logout()}
        >Logout</Button>
        </Card.Body>
        
        <Button id='submitbtn' variant="primary" type="submit" 
        onClick={() => navigate(-1)}>
          
     Go back
      </Button>
           </Col> </Row>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                    <div className='issues'>
    <>
            {nullvalue ? (
                <section>
                    <h3>No issues to display</h3>
                   
                </section>
            ) : (  
              <section>
              {rendernotifylist}
              </section> )}
    </>
    </div>
                   
                    </Col>
                </Row>
            </Container>
  )
}
