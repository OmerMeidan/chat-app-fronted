import React from 'react';
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import axios from 'axios'
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom'
const socket = io('http://localhost:2000')
function Chat() {
    const location = useLocation()
    const [chat, setChat] = useState([])
    const [side, setSide] = useState('flex-start')
    const [textSide,setTextSide]=useState('')
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [roomArr, setRoomArr] = useState([])
    const [name,setName]=useState('')
    useEffect(() => {
        const getRooms = async () => {
            const response = await axios.get('http://localhost:2001/getAllRooms')
            setRoomArr(response.data)
            const SenderId = await axios.post('http://localhost:2001/GetName', { email: location.state.email })
            setName(SenderId.data)
        }
        getRooms()

    }, [])
    useEffect(()=>{
        if(!JSON.parse(localStorage.getItem('token'))){
            navigate("/")
        }
    },[])
    useEffect(() => {

        socket.on("connect", () => {
            console.log("connected");
        })
        socket.on("recived-msg", (msg, name) => {
            setChat((perv) => [...perv, [msg, name]])
        })
        return () => {
            socket.off("connect")
            socket.off("recived-msg")
        }
    }, [])

    const [room, setRoom] = useState('')

    const [Message, setMessage] = useState('')

    const handleClick = async () => {
        if (room !== '') {
            setSide('flex-end')
            const SenderId = await axios.post('http://localhost:2001/GetName', { email: location.state.email })
            setName(SenderId.data)
            socket.emit("sent-message", room, Message, SenderId.data)
            const res1 = await axios.post('http://localhost:2001/GetMsg', { room: room })
            res1.data.messages.push([Message, SenderId.data])
            const res = await axios.post('http://localhost:2001/UpdateChat', { room: room, messages: res1.data.messages })
            console.log(res.data);
            setChat((perv) => [...perv, [Message, SenderId.data]])
            console.log(chat);
        }
        else {
            return alert("choose a room")
        }
    }
    const logOut = ()=>{
        localStorage.clear()
        navigate("/")
    }
    const handleJoin = async (room) => {
        setRoom(room)
        /////
        const res = await axios.post('http://localhost:2001/CreateNewChat', { room: room })
        console.log(res.data);
        /////
        socket.emit("join-room", room, (roomName) => {
            AddMessage("joined room " + roomName)
        })
        const res3 = await axios.post('http://localhost:2001/GetMsg', { room: room })
        setChat(res3.data.messages)
        localStorage.setItem('chat',JSON.stringify(chat))
    }

    const AddMessage = (message) => {

    }
    console.log(name)
    return (
        <Box className='container'>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setOpen(!open)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Omer's chat
                        </Typography>
                        <Button onClick={()=>logOut()} color="inherit">Log Out</Button> {/*  make this button to logout anfd handle the locale storage JWT  */}
                    </Toolbar>
                </AppBar>
                <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
                    <Box sx={{ width: 'fit-content', display: 'flex', alignItems: 'center',flexDirection:'column',gap:'2vw' }}>
                        <IconButton >
                            <ChatBubbleIcon /> <Typography sx={{ marginLeft: '1vw' }}>Our Rooms</Typography>
                        </IconButton>
                        <Box sx={{width:'95%',height:'100%',display:'flex',flexDirection:'column',gap:'0.1vw',alignItems:'center'}}> {roomArr.map((a, i) => <Box sx={{width:'100%',height:'15%',border:'solid 2px black',textAlign:'center',cursor:'pointer'}} onClick={() => handleJoin(a.room)} key={i}>{a.room}</Box>)}</Box>
                        <Typography>hi</Typography>
                    </Box>
                </Drawer>
            </Box>

            <Box>
                
            </Box>
            <Box style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'wheat',display:'flex',flexDirection:'column'}}>
                
                <Typography variant='h5' sx={{fontFamily:'cursive'}}>hello {`${name}`} , your'e online on room {`${room}`} </Typography>
                <br />
                <Box style={{ width:'60vw',height:'70vh',display:'flex',flexDirection: 'column',gap:'2vw',border:'2px white solid',justifyContent:'start',overflow:'auto'}}>
                    {chat.map((a, i) =>
                        <Box sx={{width:"100%",height:'fit-content',textAlign:name===a[1]?'right':'left'}} key={i}>
                            
                            <span style={{width:'100%',height:'fit-content',borderBottomLeftRadius:'0px',textAlign:name===a[1]?'right':'left',margin:'1vw'}} >{a[1]}: </span>
                            <br/>
                            <span style={{width:'100%',height:'fit-content',backgroundColor:'white',borderRadius:'5px',borderBottomRightRadius:'0px',margin:'1vw',textAlign:name===a[1]?'right':'left'}}>{a[0]}</span>
                           
                        </Box>

                    )}
                </Box>

                <Box sx={{display:'flex',alignItems:'center'}}>
                <TextField sx={{width: '40vw'}} onChange={(e) => setMessage(e.target.value)} id="outlined-password-input" type="text" variant='filled' autoComplete="current-password" />
                    <IconButton onClick={() => handleClick()}><SendIcon /></IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default Chat;