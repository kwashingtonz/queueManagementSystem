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


      

      // Socket.on("getNotification", (data) => {
      //   console.log(data)
      //   //toast.success(data.type)
      //   setNotifications((prev) => [...prev,data]);

      //   console.log(notifications)
      //   localStorage.setItem('notifications',JSON.stringify(notifications))

      //  toast.success(notifications, {
      //   position: "top-left",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   })

       
      // })
      fetchNotification();
    }, [])

    
 
      const nw =  JSON.parse(localStorage.getItem('notifications'))
  

   
    
    const rendernotifylist = notifications.map((notification) =>(
      <NotifyCard
      notification={notification}
      key={notification.id}
    
      />
    )) 

    
    //console.log(notifications)
    const logout = async () => {
        try {

          //localStorage.clear();
          setAuth();
        } 
       catch (error) {
              console.log(error);         
       }
      }
      //console.log(notifications)
      
      // const displayNotification = ({ type,id }) => {
      
      //   return (
      //     <Card id="id"  border="primary" style={{ width: '45rem' }} key={id}>
        
      //   <Card.Title>
      //       <Badge pill bg="primary">
      //       message:
      //       </Badge>
      //   </Card.Title>
      // <Card.Body>
      // <p id='issuename'>{type}</p>
      // </Card.Body>
      //    </Card>
      //   );
      // };


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
