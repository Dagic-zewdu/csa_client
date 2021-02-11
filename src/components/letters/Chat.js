import { faCheck, faCheckDouble, faCircle, faCommentDots,  faEnvelopeOpen, faEye, faPaperPlane, faPlus, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { withRouter } from 'react-router'
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo'
import { Message } from '../../controllers/Message'
import { Donothing } from '../../controllers/saveProcess'
import {StoreContext } from '../contexts/contexts'
import DataLoading from '../layout/DataLoading'
import ErrorLoading from '../layout/ErrorLoading'
import ModalLetter from '../layout/ModalLetter'
import {Link} from 'react-router-dom'
import { localTime, simpleDate } from '../../controllers/Date'

const Chat=({match})=> {
      const emp_id=match.params.id?match.params.id:''
    const {socket,users,employees,messages,letters,
           connections,typing,Ltyping}=useContext(StoreContext)
    const {loading:empLoading,error:empError}=employees
    const {loading:userLoading,error:userError}=users
    const [state,setState]=useState({
      message:'',
      contacted:[]
   })
   const box=useRef(null)
   const Messages=new Message(messages.state,connections.state,letters.state,users.state,employees.state)  //importing message class
  
  /** */
  useEffect(()=>{
 Messages.newMessages(emp_id).map(m=>{ socket.emit('update',{...m,seen:true})})
 setState(s=>({...s,contacted:Messages.contactedUsers()}))
   Scroller()
   box.current&&emp_id?box.current.focus():Donothing()  
},[messages.state,emp_id,box])

/**scroll */
const Scroller=()=>{
  try{
    var scroll=document.getElementById(Messages.last_message(emp_id)?
    Messages.last_message(emp_id)._id:'dsdc')
    scroll.scrollIntoView({behavior:'auto'})  
     }
    catch(err){
      console.log(err)
    }
}
  

  /**emiiting message is typing*/
const typingFocus=()=>socket.emit('typing',{emp_id:Messages.getEmp_id()})
 /**creating letter emit message that user is creating letter */
const typing_letter=()=>socket.emit('typing_letter',{emp_id:Messages.getEmp_id()}) 

/**stop typing */
const stopTyping=()=>setTimeout(()=>socket.emit('typing',{emp_id:''}),1800) //for chat
const stop_typing=()=>socket.emit('typing_letter',{emp_id:''}) //for creating letter

/**emmitter */

/**handling submit */
   const handleSubmit=e=>{
    e.preventDefault()   
   state.message!==''? socket.emit('submit',{
      sender:Messages.getEmp_id(),
      reciever:emp_id,
      message:state.message
    }):Donothing()
    setState({...state,message:''})
    Scroller()
  }
  
  const handleSearch=index=>setState({...state,contacted:Messages.searchContacted(index)})
 const emitter=()=>{
   socket.emit('chat','')
   socket.emit('letters','')
   socket.on('chat',data=>{
let Mess=new Message(data,connections.state,letters.state,users.state,employees.state)
  setState(s=>({...s,contacted:Mess.contactedUsers()}))
 })
 }
  return (
      empLoading||userLoading?
      <DataLoading/>:
      empError||userError?
      <ErrorLoading/>:
       <div className="container">
<div className="messaging mt-2 card bg-dark">
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
                <input type="text" className="search-bar"  
                placeholder="Search" onChange={e=>handleSearch(e.target.value)} />
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
     state.contacted.length?
     state.contacted.map(m=>{
      return (
        <Link to={'/message/'+m} key={m}>
        <div className="chat_list active_chat" key={m}>
              <div className="chat_people">
                <div className="chat_img">
                <p data-letters={Messages.firstLetters(m)}></p>  
{
  Messages.isOnline(m)?<FontAwesomeIcon icon={faCircle} className='text-success'/>:
          <FontAwesomeIcon icon={faCircle} className='text-secondary'/>
}
  </div>
                <div className="chat_ib">
                  <h5>{Messages.messageName(m)} <span className="chat_date">
                    {simpleDate(Messages.last_message(m).created_date)}
                    </span></h5>
                  <p>{
                    (Messages.last_message(m).message).length>100?
                    (Messages.last_message(m).message).slice(0,120)+'  ...':
                    Messages.last_message(m).message
                    }</p>
                </div>
         {
        Messages.newMessages(m).length?
        <div className="float-right rounded-circle">
            <h4 className="text-small">
        <FontAwesomeIcon icon={faPlusCircle} className='text-info fa-1x' />
       { Messages.newMessages(m).length}
              </h4>    
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
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mt-5">
                <h2 className="text-white font-weight-bold text-center">
              Please Select chat... <br/>
           <FontAwesomeIcon icon={faEnvelopeOpen} className='text-white fa-3x' />      
                </h2>
              </div>
            </div>
          </div>
          :
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
     <ReactTimeAgo date={Messages.lastSeen(emp_id)}/> {' '}
      {localTime(Messages.lastSeen(emp_id))} 
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
              {
                m.letter_id?
            <div className="card" style={{minHeight:200}}>
              <div className="card-header text-center font-weight-bold">
                  {Messages.title(m.letter_id)}
              </div>
             <div className="card-body font-italic">
          
     { 
       Messages.description_text(m.letter_id).length > 100?
     Messages.description_text(m.letter_id).slice(0,120) + ' ...':
     Messages.description_text(m.letter_id)       
     }
              
               {} {/*letter class*/}
               </div> 
        <div className="card-footer text-muted">
     <ModalLetter type='view_letter' l_id={m.letter_id}/>
          </div>  
              </div>:
              <p>{m.message}</p>
              }  
                <span className="time_date">
   {localTime(m.created_date)} | {simpleDate(m.created_date)} | 
              {m.seen?' seen' :' Delivered'}
              {
    m.seen?
    <FontAwesomeIcon icon={faCheckDouble} className='text-info mx-2'/> 
    :<FontAwesomeIcon icon={faCheck} className='text-info mx-2' />
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
                {
                m.letter_id?
            <div className="card" style={{minHeight:200}}>
              <div className="card-header text-center font-weight-bold">
                  {Messages.title(m.letter_id)}
              </div>
             <div className="card-body font-italic">
          
     { 
       Messages.description_text(m.letter_id).length > 100?
     Messages.description_text(m.letter_id).slice(0,100) + ' ...':
     Messages.description_text(m.letter_id)       
     }
              
               {} {/*letter class*/}
               </div> 
        <div className="card-footer text-muted">
     <ModalLetter type='view_letter' l_id={m.letter_id}/>
    
          </div>  
              </div>:
              <p>{m.message}</p>
              } 
                  <span className="time_date"> {localTime(m.created_date)}   |   
                  {simpleDate(m.created_date)}
                    </span></div>
              </div>
            </div>
            
        ):
        <p key={m._id}></p>
          ) })
       :<h4 className="text-center text-white  mt-2 font-itlaic font-weight-bold ">
      <FontAwesomeIcon icon={faCommentDots} className='text-white fa-2x mx-2' />   
         No messages yet...
       </h4>
       }     
  
            </div>
            <div className="incoming_msg mb-2" id="type">
              <div className="incoming_msg_img"> 
     </div>
     {
       typing===emp_id?
       <div className="received_msg bg-light">
                <div className="received_withd_msg">
                  <p>{Messages.messageName(emp_id)+ ' '} is typing ...</p>
                 </div>
              </div>:
              <p></p>
     }
     {
   Ltyping===emp_id?
   <div className="received_msg bg-light">
                <div className="received_withd_msg">
     <p>{Messages.messageName(emp_id)+ ' '} is creating letter ...</p>
                 </div>
              </div>:
              <p></p>
     }
              </div>   
          <form onSubmit={e=>handleSubmit(e)}>        
          <div className="input-container">
<input  className="input-field form-control my-auto" id='message' type="text" 
placeholder="type message"  autoComplete='off'
onKeyUp={()=>stopTyping()}
  onChange={e=>{setState({...state,message:e.target.value}); typingFocus()}}
 ref={box} value={state.message}
   />

<ModalLetter type='create_letter' typing={typing_letter} stop_typing={stop_typing}/>
     </div>
     </form>
 
        </div>
        }
      </div>
     
    </div></div>
    )
}

export default withRouter(Chat)
