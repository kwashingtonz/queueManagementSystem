import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';
import {Badge,Button,Row,Col,Card,Container} from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import { useLocation,useParams } from 'react-router-dom';
import axios,{BASE_URL} from '../api/axios';
import { Link } from 'react-router-dom';



 const Countercall=(props)=> {

  const id=(useParams().id)
  const [issue,setIssue]=useState({})
  const [countname,setCountname]=useState('')
  const [countnum,setCountnum]=useState('')
  const [nulla,setNulla]=useState(false)

  const { auth } = useAuth();
  const { setAuth } = useAuth();
  
  const Token=auth?.accessToken

  const authAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization :`Bearer ${Token}`
    }
  })

  useEffect(() => {

    const fetchIssue = async () => {
       try {
        
        const response = await authAxios.get(`cuser/issue/${id}`);
        if(response.data==null)
        {setNulla(true)}
        else{
          setIssue(response.data)
        } 
     
        setCountname(auth?.username)
        setCountnum(auth?.counterInfo.counterNum)

       } catch (error) {
              console.log(error);         
       }
    }  
    


    
    fetchIssue();
  },[])
  
      
  const issuedone = async (id) => {
    try {
    const res = await authAxios.get(`cuser/issueDone/${id}`);
   console.log(res.data)
  
   } 
   catch (error) {
          console.log(error);         
   }
  }
   
  const callnext = async (id) => {
    try {
    const res1 = await authAxios.put(`cuser/getDoneNextissue/${id}`);
   
    if(res1.data==null)
    {setNulla(true)}
    else{
      setIssue(res1.data);
    } 
    
  
   } 
   catch (error) {
          console.log(error);         
   }
  }
  const logout = async () => {
    try {
      localStorage.clear();
      setAuth();
    } 
   catch (error) {
          console.log(error);         
   }
  }




    return (
        <div>
            <Container>
       
      
       
      <Row>
         <Col> 
         <Badge pill bg="secondary" >
           <h6>Counter:0{countnum}</h6>   
       </Badge>
        </Col>
        <Col>
       
        <Card.Body id="profilename"  border="primary" style={{ width: '13rem' }}>
        <Badge pill bg="primary"><h6>{countname}</h6></Badge>
    <Button id='logoutbtn' variant="outline-danger"
      onClick={() => logout()}
    >Logout</Button>
        </Card.Body>
      {/*   <Button id='closebtn' variant="danger">Close Counter</Button> */}
        </Col>
      </Row>
                <Row>
                <Col md={{ span: 8, offset: 2 }}>
                <>
            {nulla ? (
                <section>
                    <h3>No issues to display</h3>
                   
                </section>
            ) : (  
              <section>
       <Card style={{ width: '40rem' }}>
          <Card.Body>
            <Card.Title>
              <Badge pill bg="primary">
                  {issue.queueNo}
                    </Badge>
                    {issue.name} - 0{issue.telephone}
                    
                    </Card.Title>
               <Card.Subtitle className="mb-2 text-muted">Issue</Card.Subtitle>
            <Card.Text>
            {issue.issue}
            </Card.Text>
          
          </Card.Body>
        </Card>
        </section> )}
        </>
            </Col>
            </Row>    
            
            <Row>
                <Col>
       
        <Button id='Donebtn' variant="warning"
        onClick={() => callnext( issue.id)}
        >Done & Call Next</Button>
        
        <Link to="/counter">
        <Button id='Donebtn' variant="primary"
         onClick={() => issuedone(issue.id)}
        >Done</Button>
        </Link>
        </Col>
    
     </Row>    
        
        
         
        </Container>
        </div>
        
        
      )
}
export default Countercall
