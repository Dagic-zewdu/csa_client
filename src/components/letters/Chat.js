import { faCheck, faCheckDouble, faCircle, faEnvelope, faPaperPlane, faPlus, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { createRef, useContext, useEffect, useRef, useState } from 'react'
import { withRouter } from 'react-router'
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo'
import { Message } from '../../controllers/Message'
import { Donothing } from '../../controllers/saveProcess'
import { StoreContext } from '../contexts/contexts'
import DataLoading from '../layout/DataLoading'
import ErrorLoading from '../layout/ErrorLoading'
import ModalLetter from '../layout/ModalLetter'
import {Link} from 'react-router-dom'
import { localTime, simpleDate } from '../../controllers/Date'
import { DotLoading } from '../layout/Loading'
const Chat=({match})=> {
      const emp_id=match.params.id?match.params.id:''
    const {socket,users,employees}=useContext(StoreContext)
    const {loading:empLoading,error:empError}=employees
    const {loading:userLoading,error:userError}=users
    const [state,setState]=useState({
      message:'',
      users:[],
      messages:[],
      typing:false,
      isVisible:true
   })
   const box=useRef(null)
   const Messages=new Message(state.messages,state.users,[],employees.state,users.state)  //importing message class
    useEffect(()=>{
      
      socket?socket.emit('users',''):Donothing() 
      socket? socket.on('users',data=>setState(s=>({...s,users:data}))):Donothing()
      socket?socket.emit('chat',''):Donothing()
      socket?socket.on('chat',data=>{setState(s=>({...s,messages:data})); Scroll()}):Donothing()
     socket?socket.on('typing',data=>{setState(s=>({...s,
      typing:(data.emp_id === emp_id)? true : false
    }))
  Scroll()
  }):Donothing()
      box.current&&emp_id?box.current.focus():Donothing()
 
  },[socket,box,emp_id])
  /** */
useEffect(()=>{
 Messages.newMessages(emp_id).map(m=>{ socket.emit('update',
           {...m,seen:true})})

  },[state.messages,emp_id])
/**scroll */
    useEffect(()=>{
    try{
    var scroll=document.getElementById(Messages.last_message(emp_id)?Messages.last_message(emp_id)._id:'dsdc')
    scroll.scrollIntoView({behavior:'auto'})  
     }
    catch(err){
      console.log(err)
    }
  },[state.messages,emp_id])
  
  /**scroll */
const Scroll=()=>{
  try{
  document.getElementById('type').scrollIntoView({behavior:'auto'})
}
catch(err){
 console.log(err)
  }
}

  /**handling changes */
const typingFocus=()=>socket.emit('typing',{emp_id:Messages.getEmp_id()})
 
const stopTyping=()=>socket.emit('typing',{emp_id:''})

   /**handling submit */
   const handleSubmit=e=>{
    e.preventDefault()   
    socket.emit('submit',{
      sender:Messages.getEmp_id(),
      reciever:emp_id,
      message:state.message
    })
    setState({...state,message:'',typing:false})
  }
   
   return (
      empLoading||userLoading?
      <DataLoading/>:
      empError||userError?
      <ErrorLoading/>:
       <div className="container">
<div className="messaging my-2 card">
      <div className="inbox_msg ">
        <div className="inbox_people">
          <div className="headind_srch">
            <div className="recent_heading">
              <h4 className='font-weight-bold'>
                Recent Messages
                </h4>
            </div>
            <div className="srch_bar">
              <div className="stylish-input-group">
                <input type="text" className="search-bar"  placeholder="Search" />
                <span className="input-group-addon">
                <button type="button"> 
       <FontAwesomeIcon icon={faSearch} />
        </button>
                </span> 
                </div>
            </div>
          </div>
          <div className="inbox_chat">
   {
     Messages.contactedUsers().length?
    Messages.contactedUsers().map(m=>{
      return (
        <Link to={'/message/'+m} key={m}>
        <div className="chat_list active_chat" key={m}>
              <div className="chat_people">
                <div className="chat_img">
                <p data-letters={Messages.firstLetters(m)}></p>  
  </div>
                <div className="chat_ib">
                  <h5>{Messages.messageName(m)} <span className="chat_date">
                    {simpleDate(Messages.last_message(m).created_date)}
                    </span></h5>
                  <p>{
                    (Messages.last_message(m).message).length>100?
                    (Messages.last_message(m).message).slice(0,95)+'  ...':
                    Messages.last_message(m).message
                    }</p>
                </div>
         {
        Messages.newMessages(m).length?
        <div className="float-right rounded-circle">
            <p className="text-small">
        <FontAwesomeIcon icon={faPlusCircle} className='text-success' />
       { Messages.newMessages(m).length}
              </p>    
                </div>:
                <p></p>   
         }       
              
              </div>
            </div>
            </Link>
      )
    }):
    <p></p>
   }

          </div>
        </div>
        {
          !emp_id?
          <p></p>:
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
         <div className="row bg-light">
           <div className="col-lg-2 float-right mt-2">
     <p data-letters={Messages.firstLetters(emp_id)} className='ml-5' > </p> 
           </div>
       <div className="col-lg-6 mt-2 my-auto float-left">
       <h4 className=''>
             {Messages.messageName(emp_id)}        
             </h4>
             {
    Messages.isOnline(emp_id)?
    <p className='float-left'>
   <FontAwesomeIcon icon={faCircle} className='text-success ml-5'/>
   online   
      </p>:
     Messages.lastSeen(emp_id)?
     <p className='float-left'>
      last seen at {' '}
     <ReactTimeAgo date={Messages.lastSeen(emp_id)}/> 
     </p>:
   <p></p>
  }  
         </div>
        <div className="col-lg-4 float-right font-italic mt-2">
         Department- {Messages.Department(emp_id)} <br/>
         position-{Messages.UserRole(emp_id)}
          </div> 
         </div>      
           
            </div>
          </div>
        </div>
        }
        {
     !emp_id? 
     <p></p>:    
        <div className="mesgs">
          <div className="msg_history">
       {
         Messages.chatRoom(emp_id).reverse().length?
         Messages.chatRoom(emp_id).reverse().map(m=>{
         return(  
         m.sender === Messages.getEmp_id() ?
        (
          <div className="outgoing_msg" key={m._id} id={m._id}>
              <div className="sent_msg">
                <p>{m.message}</p>
                <span className="time_date">
                   {localTime(m.created_date)} | {simpleDate(m.created_date)} 
              | 
              {
                m.seen?
                <FontAwesomeIcon icon={faCheckDouble} className='text-info'/>
                :<FontAwesomeIcon icon={faCheck} className='text-info' />
              }
                  
                  </span> </div>
            </div>
        ):
         m.reciever === Messages.getEmp_id()? 
        (
          <div className="incoming_msg" key={m._id} id={m._id}>
              <div className="incoming_msg_img"> 
     <p data-letters={
 m.sender!== Messages.getEmp_id()?Messages.firstLetters(m.sender):
 m.reciever!==Messages.getEmp_id()?Messages.firstLetters(m.reciever):''
       }></p>
     </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p>{m.message}</p>
                  <span className="time_date"> {localTime(m.created_date)}   |   
                  {simpleDate(m.created_date)}
                    </span></div>
              </div>
            </div>
            
        ):
        <p key={m._id}></p>
          ) })
       :<p className="text-center mt-2 font-itlaic font-weight-bold">
         No messages yet...
       </p>
       }     
  
            </div>
            <div className="incoming_msg mb-2" id="type">
              <div className="incoming_msg_img"> 
     </div>
     {
       state.typing?
       <div className="received_msg">
                <div className="received_withd_msg">
                  <p>{Messages.messageName(emp_id)+ ' '} is typing ...</p>
                 </div>
              </div>:
              <p></p>
     }
              </div>   
          <form onSubmit={e=>handleSubmit(e)}>        
          <div className="input-container">
<input  className="input-field form-control my-auto" id='message' type="text" 
placeholder="type message"  
onKeyUp={()=>stopTyping()}
  onChange={e=>{setState({...state,message:e.target.value}); typingFocus()}}
 ref={box} value={state.message}
   />

<ModalLetter type='create_letter' />
     </div>
     </form>
 
        </div>
        }
      </div>
     
    </div></div>
    )
}

export default withRouter(Chat)
