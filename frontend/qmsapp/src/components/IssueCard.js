import React from "react";
import {Badge,Button,Row,Col,Card,Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Issuecard = (props) => {

    const { id, queue_num, name } = props.issue;
    return (
     <Card id="id"  border="primary" style={{ width: '40rem' }}
     key={id}>
    
    <Card.Title>
        <Badge pill bg="primary">
        {queue_num}
        </Badge>
    </Card.Title>
  <Card.Body>
     <h6 id='issuename'>{name}</h6>
   
   {/* <Link to ={{
      pathname:'/countercall',
      state:{
         issueid:3
      }
   }}> */}

      <Link
          to={{ pathname: `/countercall/${id}`,
            }}
        >
      <Button id='viewbtn'  variant="outline-primary"
      onClick={() => props.clickHander(id,queue_num,name)}
      >Call</Button>

      </Link>
   {/* </Link> */}
   
    
  </Card.Body>
     </Card>
    );
  };
  
  export default Issuecard;
  