import React,{useEffect,useState} from 'react'
import { Col, Container,Row,Badge,Card,Button,Modal} from 'react-bootstrap'
import { FaBell } from "react-icons/fa";
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import axios ,{BASE_URL}from '../api/axios';
import Socket from './Socket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Queuedisplay(props) {
    const { auth } = useAuth();
    const { setAuth } = useAuth();
    const [currentNum,setCurrent]=useState('')
    const [nextNum,setNext]=useState('')
    const [counter,setCounter]=useState('')
    const [queue_num,setQueuenum]=useState('')
    const [username,setUsername]=useState('')
    const [show,setShow]=useState(false)
    const navigate = useNavigate()


  const Token=auth?.accessToken

  const authAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization :`Bearer ${Token}`
    }
  })

  const handleClose = () =>{
    setShow(false)
  }

  useEffect(()=> {
  
    if(auth){
        if(auth.userType!="normalUser"){
            navigate("/counter")
        }
    }
  },[])

    useEffect(() =>{
      setUsername(auth?.username)
     
     if(auth?.counter==undefined ||auth?.queue_num==undefined)
     {
        setCounter(props.counter)
        setQueuenum(props.queuenum)
     }
     else{
        if(props.counter==undefined || props.queuenum==undefined){
          setCounter(auth?.counter)
          setQueuenum(auth?.queue_num)
        }else{
          setCounter(props.counter)
          setQueuenum(props.queuenum)
        }
        
     }
      
      Socket.off("getNotification").on("getNotification", (data) => {
    
          console.log(data)

          toast(data.type, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            })
        

       
      })


      Socket.off("refreshUser").on("refreshUser", (data) => {
        const refresh = data.ref
        if(refresh==1)
        {
          window.location.reload()
        }
    })

        
       
        const id=props.counter||auth?.counter
         

        if(id==1){

          Socket.on('getqueuenum1',(m)=>{
             setNext(m.counter_nextNum)
             setCurrent(m.counter_currentNum)             
           })
           
            


        }
      if(id==2){

          Socket.on('getqueuenum2',(m)=>{
             setNext(m.counter_nextNum)
             setCurrent(m.counter_currentNum)
             
           })
           

        }
       if(id==3){

          Socket.on('getqueuenum3',(m)=>{
             setNext(m.counter_nextNum)
             setCurrent(m.counter_currentNum)
           
           })
           

        }
       
         
      },[])

      const logout = async () => {
        try {
          
          localStorage.removeItem(auth?.username)
          sessionStorage.clear()
          setAuth();
        } 
       catch (error) {
              console.log(error)     
       }
      }


      const cancel = async () =>{
        try {
          
          const res = await authAxios.delete(`nuser/cancelIssue`)
         
          if(res.data.message==="deleted")
          {
            Socket.emit("refreshIssues", {
              ref:1
            });
            window.location.reload()
          }
         
         } catch (error) {
                console.log(error)     
         }
      }


  return (
    <div>
      <>{queue_num === nextNum ? (
        <section>
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
    <Link to="/notifications">
    <Button id='submitbtn' variant="primary" type="submit">
      
  <FaBell /> 
  </Button></Link>
       </Col> </Row>
            <Row>
                <Col md={{ span: 4, offset: 3 }}>
                <Card id="id"  md={{ span: 6, offset: 3 }} border="primary" style={{ width: '32rem', height: '26rem' }}>
    
    <Card.Title >
    <div class=" d-flex align-items-center justify-content-center">
        <Badge pill bg="info" >
        <h4>Counter 0{counter}</h4>
        </Badge>
        </div>
    </Card.Title>
  <Card.Body>
            
        <div class=" d-flex align-items-center justify-content-center">
         <h1 id='currentnum'>You're Next</h1>
         </div>  
   
  </Card.Body>
     </Card>
                </Col>
            </Row>
        </Container>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
        </section>

      ):queue_num === currentNum ?(
        <section>
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
    <Link to="/notifications">
    <Button id='submitbtn' variant="primary" type="submit">
      
  <FaBell /> 
  </Button></Link>
       </Col> </Row>
            <Row>
                <Col md={{ span: 4, offset: 2 }}>
                <Card id="id"  md={{ span: 6, offset: 3 }} border="primary" style={{ width: '42rem', height: '32rem' }}>
    
    <Card.Title >
    <div class=" d-flex align-items-center justify-content-center">
        <Badge pill bg="info" >
        <h4>Counter 0{counter}</h4>
        </Badge>
        </div>
    </Card.Title>
  <Card.Body>
            
        <div class=" d-flex align-items-center justify-content-center">
         <h1 id='currentnum'>Proceed to the counter</h1>
         </div>  
   
  </Card.Body>
     </Card>
                </Col>
            </Row>
        </Container>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
        </section> 

      ):(
      <section>
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
    <Link to="/notifications">
    <Button id='submitbtn' variant="primary" type="submit">
      
  <FaBell /> 
  </Button></Link>
       </Col> </Row>
            <Row>
                <Col md={{ span: 4, offset: 4 }}>
                <Card id="id"  md={{ span: 6, offset: 3 }} border="primary" style={{ width: '26rem', height: '26rem' }}>
    
    <Card.Title >
    <div class=" d-flex align-items-center justify-content-center">
        <Badge pill bg="info" >
        <h4>Counter 0{counter}</h4>
        </Badge>
        </div>
    </Card.Title>
  <Card.Body>
  <div class=" d-flex align-items-center justify-content-center">
        <div id='yourtext'>Your Number</div>
        <div id='yournum'>0{queue_num}</div></div>
        <div class=" d-flex align-items-center justify-content-center">
        <div id='currenttxt'>Current Number</div>
        </div>
        <div class=" d-flex align-items-center justify-content-center">
         <h1 id='currentnum'>0{currentNum}</h1>
         </div>
         <div class=" d-flex align-items-center justify-content-center">
         <h1 id='nexttxt'>Next Number</h1>
         <h1 id='nextnum'>0{nextNum}</h1>
         </div>

     
    
   
   
    
  </Card.Body>
     </Card>
                </Col>
            </Row>
            <Row>
<Col>
  
    <Card.Body id="profilename"  border="primary" style={{ width: '6rem' }}>
    
    <Button id='cancelbtn' variant="danger"
      onClick={() => setShow(true)} 
    >Cancel</Button>
    </Card.Body>
       </Col> 
       </Row>
        </Container>
          <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to cancel the issue?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={cancel}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal> 
      <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          /> 
        </section>
      )}
      </>
    </div>

  )
}
