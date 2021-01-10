import React, { useContext, useEffect } from 'react'
import { Donothing } from '../../controllers/saveProcess'
import { addConn } from '../../store/Actions/connectionAction'
import { StoreContext } from '../contexts/contexts'

const ConnectioFetchers=()=> {
const {socket,dispatchConnections}=useContext(StoreContext)
useEffect(()=>{
   try{
socket?socket.emit('users',''):Donothing() 
socket? socket.on('users',data=>dispatchConnections(addConn(data))):Donothing()
   }
   catch(err){
dispatchConnections({type:'Error'})
   }
},[socket])
    return (
        <div>
            
        </div>
    )
}

export default ConnectioFetchers
