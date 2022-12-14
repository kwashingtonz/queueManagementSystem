import React,{useEffect,useState} from 'react'
import { Col, Container,Row,Badge,Card,Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import NotifyCard from './NotifyCard';
import axios,{BASE_URL} from '../api/axios';


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
   
  useEffect(()=> {
  
    if(auth){
        if(auth.userType!="normalUser"){
            navigate("/counter")
        }
    }
  },[])

    useEffect(() => {

      setUsername(auth?.username)

      const fetchNotification = async (page) => {
        try {
         
         const response = await authAxios.get('nuser/getNotifications');

         if(!response.data[0].length==0)
         {  
          setNotifications(response.data[0]);
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

  

   
    
    const rendernotifylist = notifications.map((notification) =>(
      <NotifyCard
      notification={notification}
      key={notification.id}
    
      />
    )) 

  
    const logout = async () => {
        try {
          localStorage.removeItem(auth?.username)
          sessionStorage.clear()
          setAuth()
        } 
       catch (error) {
              console.log(error);         
       }
      }

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
                    <h3>No Notifications</h3>
                   
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
