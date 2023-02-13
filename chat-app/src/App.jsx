import './App.css';
import {connect,io} from 'socket.io-client'
import {useEffect, useState} from 'react'
import {Route,Routes} from 'react-router-dom'
import Login from './components/Login';
import Chat from './components/Chat';
const socket = io('http://localhost:2000')
function App() {
 
  // console.log(messageList);
  return (
    <div className="App">
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/Chat' element={<Chat/>}/>
     </Routes>
    </div>
  );
}

export default App;
