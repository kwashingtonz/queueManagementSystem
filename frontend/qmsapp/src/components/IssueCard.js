import React from "react";
import {Badge,Button,Row,Col,Card,Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Issuecard = (props) => {

    const { id, queueNo, name, telephone, user ,isCalled} = props.issue;

    return (
     <Card id="id"  border="primary" style={{ width: '35rem' }}
     key={id}>
    
    <Card.Title>
        <Badge pill bg="primary">
        {queueNo}
        </Badge>
    </Card.Title>
  <Card.Body>
     <h7 id='issuename'>{name}</h7>
     <h6>0{telephone}</h6>
   {/* <Link to ={{
      pathname:'/countercall',
      state:{
         issueid:3
      }
   }}> */}

      <Link
          to={{ pathname: `/CounterCall/${id}`,
            }}
        >
      <>
      
      {isCalled === true ?(
      <section>   
      <Button id='viewbtn'  variant="outline-primary"
      onClick={() => props.clickHander(id,queueNo,user)}
      >Recall</Button>

      <Button id='viewbtn'  variant="outline-primary">View</Button>
      
      </section>
      )
   :(
      <Button id='viewbtn'  variant="outline-primary"
      onClick={() => props.clickHander(id,queueNo,user)}
      >Call</Button>
   )
   }
      </>
      </Link>
   {/* </Link> */}
   
    
  </Card.Body>
     </Card>
    );
  };
  
  export default Issuecard;
  