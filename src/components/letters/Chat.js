import { faCircle, faEnvelope, faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons'
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

const Chat=({match})=> {
      const emp_id=match.params.id?match.params.id:''
    const {socket,users,employees}=useContext(StoreContext)
    const {loading:empLoading,error:empError}=employees
    const {loading:userLoading,error:userError}=users
    const [state,setState]=useState({
      message:'',
      users:[],
      messages:[]
   })
   const box=useRef(null)
    useEffect(()=>{
      socket?socket.emit('users',''):Donothing() 
      socket? socket.on('users',data=>setState(s=>({...s,users:data}))):Donothing()
      socket?socket.emit('chat',''):Donothing()
      socket?socket.on('chat',data=>setState(s=>({...s,messages:data}))):Donothing()
      box.current&&emp_id?box.current.focus():Donothing()
    },[socket,box])
   const Messages=new Message(state.messages,state.users,[],employees.state,users.state)  //importing message class
  console.log(state.messages)
   /**handling changes */
    const handleChange=e=>{
      setState({...state,message:e.target.value})
   } 
   /**handling submit */
   const handleSubmit=e=>{
    e.preventDefault()   
    socket.emit('submit',{
      sender:Messages.getEmp_id(),
      reciever:emp_id,
      message:state.message
    })
   }
   console.log(Messages.contactedUsers())
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
              <h4>Recent</h4>
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
            <div className="chat_list active_chat">
              <div className="chat_people">
                <div className="chat_img">
                <p data-letters="MN"></p>  
  </div>
                <div className="chat_ib">
                  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div className="chat_list">
              <div className="chat_people">
                <div className="chat_img">
 <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/>
     </div>
                <div className="chat_ib">
                  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div className="chat_list">
              <div className="chat_people">
                <div className="chat_img"> 
<img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
                  </div>
                <div className="chat_ib">
                  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div className="chat_list">
              <div className="chat_people">
                <div className="chat_img"> 
<img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/>
              </div>
                <div className="chat_ib">
                  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div className="chat_list">
              <div className="chat_people">
                <div className="chat_img">
         <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
         </div>
                <div className="chat_ib">
                  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div className="chat_list">
              <div className="chat_people">
                <div className="chat_img"> 
    <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/>
     </div>
                <div className="chat_ib">
                  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div className="chat_list">
              <div className="chat_people">
                <div className="chat_img">
     <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/>
      </div>
                <div className="chat_ib">
                  <h5>Sunil Rajput <span className="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <div className="mesgs">
          <div className="msg_history">
            <div className="incoming_msg">
              <div className="incoming_msg_img"> 
    <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/>
     </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p>Test which is a new approach to have all
                    solutions</p>
                  <span className="time_date"> 11:01 AM    |    June 9</span></div>
              </div>
            </div>
            <div className="outgoing_msg">
              <div className="sent_msg">
                <p>Test which is a new approach to have all
                  solutions</p>
                <span className="time_date"> 11:01 AM    |    June 9</span> </div>
            </div>
            <div className="incoming_msg">
              <div className="incoming_msg_img">
     <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/>
      </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p>Test, which is a new approach to have</p>
                  <span className="time_date"> 11:01 AM    |    Yesterday</span></div>
              </div>
            </div>
            <div className="outgoing_msg">
              <div className="sent_msg">
                <p>Apollo University, Delhi, India Test</p>
                <span className="time_date"> 11:01 AM    |    Today</span> </div>
            </div>
            <div className="incoming_msg">
              <div className="incoming_msg_img">
         <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"/> 
         </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p>We work directly with our designers and suppliers,
                    and sell direct to you, which means quality, exclusive
                    products, at a price anyone can afford.</p>
                  <span className="time_date"> 11:01 AM    |    Today</span></div>
              </div>
            </div>
          </div>
          <form onSubmit={e=>handleSubmit(e)}>        
          <div className="input-container">
<input  className="input-field form-control my-auto" id='message' type="text" 
placeholder="type message"  onChange={e=>handleChange(e)} ref={box} 
   />

<ModalLetter type='create_letter' />
     </div>
     </form>
 
        </div>
      </div>
     
    </div></div>
    )
}

export default withRouter(Chat)
