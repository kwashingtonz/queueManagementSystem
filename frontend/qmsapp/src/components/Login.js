import React,{useRef,useState,useEffect} from 'react'
import axios from '../api/axios'
import '../styles/custom.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Form,Button} from 'react-bootstrap'
import useAuth from '../hooks/useAuth'
import { useLocation,useNavigate} from 'react-router-dom'
import Socket from './Socket'
const LOGIN_URL = '/'

export default function Login() {
  
    const { setAuth } = useAuth()
    const navigate = useNavigate()
    const location =useLocation()
    const from = "/issueinput"
    const from2 = "/counter"
  
    const userRef =useRef('')
    const errRef = useRef()
  
    const [username,setUsername] =useState('')
    const [password,setPassword] =useState('')
    const [errMsg,setErrMsg] =useState('')

    useEffect(()=> {
        userRef.current.focus()
      },[])
      
      useEffect(()=>{
        setErrMsg('')
      },[username,password])
    
      const handleSubmit = async (e) => {
        e.preventDefault()
    
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username:username,password:password }),
                {
                    headers: { 'Content-Type': 'application/json' }                  
                }
            );
            console.log(JSON.stringify(response?.data))
     
            const accessToken=(response?.data?.accessToken)
     
            if(response?.data?.roleType == "counterUser"){
                const counterInfo =  response?.data?.counterinfo
      
                localStorage.setItem('user',JSON.stringify({ username,accessToken,counterInfo }))
                console.log(JSON.stringify({ username,accessToken,counterInfo }))

                setAuth({ username,accessToken,counterInfo })
                setUsername('')
                setPassword('')
                navigate(from2,{replace :true})
      
            }

            if(response?.data?.roleType == "normalUser"){
                const   counter=(response?.data?.counter)
                const  queue_num=(response?.data?.queue_num)
                const receiverId =(response?.data?.userID) 
      
                localStorage.setItem('user',JSON.stringify({ username,accessToken,counter,queue_num}))
                console.log(JSON.stringify({ username,accessToken,counter,queue_num}))

                Socket.emit("newUser", receiverId)
                console.log(Socket)
                
                setAuth({username,accessToken,counter,queue_num})
                console.log(accessToken)
      
                navigate(from)
      
            }

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else if (err.response?.status === 501) {
                setErrMsg('No counters available')
            }else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus()
        }
      
    
    }

    return (
        <section>
                  <div Id="main"  className=" col-md-6 offset-md-3 ">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='col-md- offset-md-4 justify content'>Login</h1>
                    <form onSubmit={handleSubmit}>
                    <Form.Group role="form" className="col-md-6 offset-md-2 my-3 " id="formBasicEmail">
                      
                    <Form.Label>Username</Form.Label>
                        <Form.Control  className="form-control"
                            type="text"
                            id="username"
                            ref={userRef}
                           
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                        />
                         </Form.Group>
                  <Form.Group className="col-md-6 offset-md-2 my-3 " id="formBasicPassword">
                        <label htmlFor="password">Password:</label>
                        <Form.Control  className="form-control"
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />

                        <Button className='col-md-6 offset-md-3 mt-3' variant="primary" type="submit">Login</Button>
                        </Form.Group>
                        
                    </form>
                    </div>
                </section>
    )




}  
