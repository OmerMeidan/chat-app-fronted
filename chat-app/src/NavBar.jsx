import React, { useState , useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import {useNavigate} from 'react-router-dom' 
import axios from 'axios'
function NavBar() {
    const navigate = useNavigate()
    const [open,setOpen] = useState(false)
    const [roomArr,setRoomArr]=useState([])
    
    useEffect (()=>{
        const getRooms = async  ()=>{
            const response = await axios.get('http://localhost:2001/getAllRooms')
            setRoomArr(response.data)
        }
        getRooms()

    },[])
    return (
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={()=>setOpen(!open)}
          >
           <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Omer's chat
          </Typography>
          <Button color="inherit">Log Out</Button> {/*  make this button to logout anfd handle the locale storage JWT  */}
        </Toolbar>
      </AppBar>
      <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
        <Box  sx={{width:'fit-content',display:'flex',alignItems:'center'}}>
       <IconButton >
        <ChatBubbleIcon/> <Typography sx={{marginLeft:'1vw'}}>Our Rooms</Typography>
       </IconButton>
       <ul> {roomArr.map((a,i)=><li onClick={()=>navigate("/Chat",{state:{room:a.room}})} key={i}>{a.room}</li>)}</ul>
        </Box>
      </Drawer>
    </Box>
    );
}

export default NavBar;