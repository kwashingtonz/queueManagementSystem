import React from "react";
import {Badge,Button,Row,Col,Card,Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Notifycard = (props) => {

    const { id, type } = props.notification;
    return (
     <Card id="id"  border="primary" style={{ width: '45rem' }} key={id}>
    
    <Card.Title>
        <Badge pill bg="primary">
        message
        </Badge>
    </Card.Title>
  <Card.Body>
     <h6 id='issuename'>{type}</h6>
   

    
    
  </Card.Body>
     </Card>
    );
  };
  
  export default Notifycard;
  