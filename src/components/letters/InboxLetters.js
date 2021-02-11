import { faCalendar, faChartLine, faCheck, faCog, faEdit, faUserAlt, faUserAltSlash, faUserCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext, useEffect,useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { localTime, TellDay } from '../../controllers/Date'
import { Message } from '../../controllers/Message'
import { StoreContext } from '../contexts/contexts'
import ModalLetter from '../layout/ModalLetter'

const InboxLetters=()=> {
    const [state,setState]=useState({
        newLetters:[],
        seenLetters:[],
        found:false
    })
    const {socket,messages,connections,
          letters,users,employees}=useContext(StoreContext)
          const message=new Message(messages.state,
            connections.state,letters.state,
             users.state,employees.state)
       const Letters=message.InboxLetters() 
      
       useEffect(()=>{
   setState(s=>({...s,newLetters:message.newInboxLetters(),
      seenLetters:message.seenInboxLetters()})) 
    },[messages.state,letters.state])      
 
    const handleSearch=index=>setState({
        ...state,
      newLetters:index===''?message.newInboxLetters():message.SearchLetters(index).newLetters,
      seenLetters:index===''?message.seenInboxLetters():message.SearchLetters(index).seenLetters,
      found:index===''?false:true
    })
 return (
    <div className="container">
<div className="row">
<div className="col-lg-3 my-auto">
  </div>
<div className="col-lg-5 my-auto">
<div className="search-wrapper active">
           <div className="input-holder">
<input type="text" className="search-input" 
placeholder="Type deduction id, allowance id"
onChange={e=>handleSearch(e.target.value)}
/>
<button className="search-icon">
                   <span></span>
                   </button>
           </div>
</div> 

</div>
<div className="col-lg-4 my-auto">
<div className="card mb-3 widget-content bg-grow-early">
   <div className="widget-content-wrapper text-white">
       <div className="widget-content-left">
           <div className="widget-heading">Letters</div>
           <div className="widget-subheading">Totall Recieved</div>
       </div>
       <div className="widget-content-right">
           <div className="widget-numbers text-white"><span>
               {Letters.length}
               </span></div>
       </div>
   </div>
</div> 
   
   </div>  
   {/** */}
   <div className="container mt-3 main-card mb-3 card min-height">
<div className="row">
<div className="col-lg-12">

{
    state.found?
    <h5 className='text-center'>
Letters found -{state.newLetters.length+state.seenLetters.length}
   </h5>
:
<p></p>   
}
<MDBTable hover bordered striped>
<MDBTableHead>
             <tr>
             <th>
  # Letter id                                
                 </th>   
                 <th>                            
   Title                                
                 </th>

                 <th>
     Type
   </th>
 
   <th>
<FontAwesomeIcon icon={faCalendar} className='mx-2' />                        
   created
   </th>  

<th>
<FontAwesomeIcon icon={faChartLine}   className='mx-2' />
Decision made/Recieved
</th>       
   <th>
<FontAwesomeIcon icon={faCog} className='mx-2' />                        
   Options
   </th>  
    </tr>
         </MDBTableHead>
       <MDBTableBody>
 {
   Letters.length?
   state.newLetters.map(l=>{
     return(
      <tr key={l._id}>
      <td className='text-center text-info'>{l.id}</td>
      <td className='text-center text-info'>{l.title}</td>
      <td className='text-center text-info'>{l.type}</td>
      <td className="text-center text-info">
         <p className="font-italic text-info">
         {TellDay(l.created_date)} <br/>
       {localTime(l.created_date)}
         </p>
          </td>
<td>
    {
        message.manager_info(l._id)?
        message.manager_info(l._id).status==='Approved'?
        <p className="text-center text-success font-iatalic text-info">
       <FontAwesomeIcon icon={faCheck} className='mx-2 fa-2x'/>     
            Approved <ReactTimeAgo
            date={message.manager_info(l._id).approved_date} /> <br/>
at {localTime(message.manager_info(l._id).approved_date)}
            </p>:
            message.manager_info(l._id).status==='unApproved'?
        <p className="text-center text-danger font-iatalic text-info">
       <FontAwesomeIcon icon={faWindowClose} className='mx-2 fa-2x'/>     
        DisApproved <ReactTimeAgo 
            date={message.manager_info(l._id).approved_date} /> <br/>
at {localTime(message.manager_info(l._id).approved_date)} <br/>
  comment-{message.manager_info(l._id)?
    message.manager_info(l._id).comment:''
  }
            </p> :
            message.manager_info(l._id).status==='waiting'?
        <p className="text-center font-iatalic text-info">
       <FontAwesomeIcon icon={faEdit} className='mx-2 fa-2x'/>     
        Approval letter waiting for your decision
            </p>:
            <p></p>:
            <p></p>       
    }
    {
        message.particpant_info(l._id)?
     message.particpant_info(l._id).seen?
     <p className="text-center font-italic text-info">
       <FontAwesomeIcon icon={faUserCheck} className='mx-2 fa-2x text-success' />
         participation letter seen
     </p>:
     <p className="text-center font-italic text-info">
       <FontAwesomeIcon icon={faUserAlt} className='mx-2 fa-2x' />
         waiting to review
     </p>:
     <p></p>
    }
    </td>                    
       <td>
<ModalLetter type='view_letter' l_id={l._id}/>
           </td>   
  </tr>    
     )
   }):
   <tr></tr>
 }
      {
        Letters.length?
state.seenLetters.map(l=>{
return(
  <tr key={l._id}>
      <td className='text-center'>{l.id}</td>
      <td className='text-center'>{l.title}</td>
      <td className='text-center'>{l.type}</td>
      <td className="text-center">
         <p className="font-italic">
         {TellDay(l.created_date)} <br/>
       {localTime(l.created_date)}
         </p>
          </td>
<td>
    {
        message.manager_info(l._id)?
        message.manager_info(l._id).status==='Approved'?
        <p className="text-center text-success font-iatalic">
       <FontAwesomeIcon icon={faCheck} className='mx-2 fa-2x'/>     
            Approved <ReactTimeAgo
            date={message.manager_info(l._id).approved_date} /> <br/>
at {localTime(message.manager_info(l._id).approved_date)}
            </p>:
            message.manager_info(l._id).status==='unApproved'?
        <p className="text-center text-danger font-iatalic">
       <FontAwesomeIcon icon={faWindowClose} className='mx-2 fa-2x'/>     
        DisApproved <ReactTimeAgo 
            date={message.manager_info(l._id).approved_date} /> <br/>
at {localTime(message.manager_info(l._id).approved_date)} <br/>
  comment-{message.manager_info(l._id)?
    message.manager_info(l._id).comment:''
  }
            </p> :
            message.manager_info(l._id).status==='waiting'?
        <p className="text-center font-iatalic">
       <FontAwesomeIcon icon={faEdit} className='mx-2 fa-2x'/>     
        Approval letter waiting for your decision
            </p>:
            <p></p>:
            <p></p>       
    }
    {
        message.particpant_info(l._id)?
     message.particpant_info(l._id).seen?
     <p className="text-center font-italic">
       <FontAwesomeIcon icon={faUserCheck} className='mx-2 fa-2x text-success' />
         participation letter seen
     </p>:
     <p className="text-center font-italic">
       <FontAwesomeIcon icon={faUserAltSlash} className='mx-2 fa-2x' />
         waiting to review
     </p>:
     <p></p>
    }
    </td>                    
       <td>
<ModalLetter type='view_letter' l_id={l._id}/>
<ModalLetter type='progress' l_id={l._id}/>
{
    message.isApprovable(l._id)?
    <ModalLetter type='approve' l_id={l._id}/>:
    <p></p>
}
           </td>   
  </tr>
)
}):
 <tr>
   <td colSpan={6}>
     <p className="text-center text-danger font-weight-bold my-2">
     No Letters ar recieved
     </p> 
     </td>
 </tr>
      }  
         </MDBTableBody>
     </MDBTable>
   
</div>         
</div>
</div>

   {/** */}          
</div>
</div>

)
}

export default InboxLetters
