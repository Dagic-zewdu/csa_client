import React, { useContext,useEffect } from 'react'
import { Donothing } from '../../controllers/saveProcess'
import { webSocket } from '../../socket'
import { addConn } from '../../store/Actions/connectionAction'
import { addMessages } from '../../store/Actions/messageActions'
import { StoreContext } from '../contexts/contexts'

const MessageFetchers=()=> {
const {socket,dispatchMessages,dispatchConnections,setTyping,setSocket}=useContext(StoreContext)
setSocket(webSocket)    
useEffect(() => {
      try{
socket?socket.emit('onConnect',{emp_id:localStorage.emp_id}):Donothing()             
socket?socket.emit('users',''):Donothing() 
socket?socket.on('users',data=>dispatchConnections(addConn(data))):Donothing()
socket?socket.emit('chat',''):Donothing()
socket?socket.on('chat',data=>dispatchMessages(addMessages(data))):Donothing() 
socket?socket.on('typing',data=>setTyping(data.emp_id)):Donothing()
   } 
      catch(err){
dispatchConnections({type:'Error'})
dispatchMessages({type:'Error'})
      }
    },[socket])
    return (
        <div>
            
        </div>
    )
}

export default MessageFetchers
