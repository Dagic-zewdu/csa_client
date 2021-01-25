import React, { useContext,useEffect } from 'react'
import { Donothing } from '../../controllers/saveProcess'
import { webSocket } from '../../socket'
import { addConn } from '../../store/Actions/connectionAction'
import { addLetters } from '../../store/Actions/letterActions'
import { addMessages } from '../../store/Actions/messageActions'
import { StoreContext } from '../contexts/contexts'

const MessageFetchers=()=> {
const {socket,dispatchMessages,dispatchConnections,dispatchLetters,
       setTyping,setLTyping,setSocket}=useContext(StoreContext)
setSocket(webSocket)    
useEffect(() => {
      try{
socket?socket.emit('onConnect',{emp_id:localStorage.emp_id}):Donothing()             
socket?socket.emit('users',''):Donothing() 
socket?socket.on('users',data=>dispatchConnections(addConn(data))):Donothing()
socket?socket.emit('chat',''):Donothing()
socket?socket.on('chat',data=>dispatchMessages(addMessages(data))):Donothing() 
socket?socket.on('typing',data=>setTyping(data.emp_id)):Donothing() //chat typing
socket?socket.on('typing_letter',data=>setLTyping(data.emp_id)):Donothing() //letter typing     
socket?socket.emit('letters',''):Donothing()
socket?socket.on('letters',data=>dispatchLetters(addLetters(data))):Donothing()    
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
