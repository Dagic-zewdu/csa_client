import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { durationDays, ToEthiopianDateSting } from '../../controllers/Date'
import { Message } from '../../controllers/Message'
import { Donothing} from '../../controllers/saveProcess'
import { StoreContext } from '../contexts/contexts'

const ViewLetters=({l_id:id,setSize})=> {
   
    
const {socket,company,letters,employees,messages,users,connections}=useContext(StoreContext)

const Mess=new Message(messages.state,connections.state,letters.state,users.state,employees.state)
const Letter=Mess.find_letter(id)
const emp_id=Mess.getEmp_id()

useEffect(()=>{
 
    setSize?setSize('xl'):Donothing()
    Mess.manager_info(id)?
     socket.emit('update_letter',{
         ...Letter,
        approval_manager:[
      ... Mess.approval_managers(id).filter(m=> m.emp_id !== emp_id),
      {...Mess.manager_info(id,emp_id),seen:true}  
                        ]
    }):Donothing()
 
     Mess.participants(id).find(m=>m.emp_id === emp_id)?
     socket.emit('update_letter',{
         ...Letter,
         participants:[
     ...Mess.participants(id).filter(m=>m.emp_id !== emp_id),
     {...Mess.particpant_info(id,emp_id),seen:true}
                     ]
    }):Donothing()
},[])
 
return (
       <div className="container">
           <div className="row">
               <div className="col-lg-12 my-2">
   <h3 className="text-center font-weight-bold">
   {company.state[0].name} 
        </h3>
               </div>
            <div className="col-lg-6 my-2">
            <h6 className="text-center font-weight-bold">
{Letter?Letter.creater===Mess.getEmp_id()?'':'to - '+
       Mess.Name(Mess.getEmp_id()):''} 
        </h6>   
        <h6 className="text-center font-weight-bold">
{Letter?Letter.creater===Mess.getEmp_id()?'':'from - '+
       Mess.Department(Mess.getEmp_id()):''} 
        </h6>
                </div>   
          <div className="col-lg-6 my-2">
    <h6 className="text-center font-italic float-right">
        Date -{Letter?ToEthiopianDateSting(Letter.created_date):''}
        </h6>          
              </div>
              {
           Letter?Letter.type==='allowance'?
           <div className="col-lg-6">
         <p className="text-center font-italic">
            Project name -{Letter.project_name}  <br/>
            program-  {Letter.program} <br/>
   objective- {Letter.objective} <br/>
duration days- {parseInt(durationDays(Letter.initial_date,Letter.return_date))+1}
             </p>   
            </div>:
            <p></p>:
            <p></p>
       }
       {
           Letter?Letter.type==='allowance'?
           <div className="col-lg-6">
         <p className="text-center font-italic font-weight-bold">
            Initial date - {ToEthiopianDateSting(Letter.initial_date)} <br/>
            return date-{ToEthiopianDateSting(Letter.return_date)}   <br/>
            Initial place- {Letter.initial_place} <br/>
            Destination place-{Letter.destination_place} <br/> 
             </p>   
            </div>:
            <p></p>:
            <p></p>
       }
          
             <div className="col-lg-12 my-2">
             <h4 className="text-center font-weight-bold">
                 {Letter?Letter.title:''}
                 </h4>    
                 </div>
             <div className="col-lg-12 my-2">
        <Editor  toolbarClassName="toolbarClassName" 
   wrapperClassName="wrapperClassName"
   editorClassName="editorClassName"
   readOnly={true}
   toolbarHidden={true}
   editorState={Mess.editorState(id)}
   />     
                 </div>
     <div className="col-lg-6 y-2">
     {
         Mess.isApproval(id)?
         Mess.approvedManagers().map(l=>{
             return(
<p className="text-center font-weight-bold">
    <FontAwesomeIcon icon={faCheckCircle} className='text-success fa-2x mx-2'/>
    {Mess.Name(l.emp_id)}
</p>
             )
         }):
         <p></p>   
        }
     </div>
          </div>
       </div>
    )
}

export default ViewLetters
