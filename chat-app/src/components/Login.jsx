import React from 'react';
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import img from '../images/img.png'
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
function Login() {
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const navigate=useNavigate()
    const handleLogIn = async ()=>{
        const obj = {
            email:Email,
            password:Password
        }
        try{
            const response = await axios.post("http://localhost:2001/Login",obj)
            console.log(response.data);
            localStorage.setItem('token',JSON.stringify(response.data))
           if(!localStorage.getItem('token')){
                alert("can't log you in !")
           }
            if(response.data){
                navigate('/Chat',{state:{email:Email}})
            }
            else{
              
            }
        }
        catch(err){
            alert("not a user")
            console.log(err);
        }
    }
    return (
        <div style={{width:'100vw',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',justifyContent:'space-around',backgroundImage:`url(${img})`}}>
            <Typography variant='h2' sx={{color:'white',fontFamily:'cursive'}}>Login</Typography>
            <Card style={{width:'30%',height:'60%',display:'flex',display:'flex',flexDirection:'column',justifyContent:'space-evenly',alignItems:'center',backgroundColor:'rgba(255,255,255,.5)'}}>
            <input onChange={(e)=>setEmail(e.target.value)} type="text" />
            <input onChange={(e)=>setPassword(e.target.value)} type="text" />
            <button onClick={handleLogIn}>log in</button>
            </Card>
        </div>
    );
}

export default Login;