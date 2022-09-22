import React from "react";
import {Badge,Card} from 'react-bootstrap';


const Notifycard = (props) => {

    const { id, message } = props.notification;
    
    return (
     <Card id="id"  border="primary" style={{ width: '45rem' }} key={id}>
    
    <Card.Title>
        <Badge pill bg="primary">
        Notification
        </Badge>
    </Card.Title>
  <Card.Body>
     <h7 id='issuename'>{message}</h7>
  </Card.Body>
     </Card>
    );
  };
  
  export default Notifycard;
  