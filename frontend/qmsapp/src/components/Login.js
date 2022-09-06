import React, { Component } from 'react'
import axios from '../api/axios'
import '../styles/custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,Button, Container} from 'react-bootstrap';

class Login extends Component {
  
    constructor(props) {
      super(props)
    
      this.state = {
         username: '',
         password: ''
      }
    }

    submitHandler = e => {
        e.preventDefault()
        console.log(this.state)
       
        axios
        .post('/', this.state)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
    }
  
    render() {

    return (
        <Container id='main-container' className='d-grid h-100'>
            
            <Form id='log-in-form' className='text-center w-100' onSubmit={this.submitHandler}>
                
                <h1 className='mb-3 fs-3'>Login</h1>

                <Form.Group>
             
                        <Form.Control
                                    className="position-relative"
                                    type="text"
                                    size="lg"
                                    placeholder="Username"
                                    id="username"
                                    value={this.state.username}
                                    onChange={e => this.setState({ username: e.target.value })}
                                    required
                        />
                                
                </Form.Group>

                <Form.Group>
                                
                        <Form.Control
                                    className="position-relative mt-1"
                                    type="password"
                                    size="lg"
                                    placeholder="Password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={e => this.setState({ password: e.target.value })}
                                    required
                        />
                                
                </Form.Group>

                <div className='mt-3 d-grid'>

                   <Button variant="primary" size="lg" type="submit">Login</Button>

                </div>
            </Form>
                       
        </Container>
    )
  }
}

export default Login