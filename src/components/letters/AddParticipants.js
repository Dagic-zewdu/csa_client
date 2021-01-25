import { faInfo, faObjectGroup, faPlus, faTrash, faUser, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext, useEffect, useState } from 'react'
import { convertToEuropean } from '../../controllers/Date'
import { LettersClass } from '../../controllers/Letters'
import { Donothing, randomId, saveProcess } from '../../controllers/saveProcess'
import { LetterContext, StoreContext } from '../contexts/contexts'
import { DotLoading } from '../layout/Loading'

const AddParticipants=()=> {
    const {emp_id,setValues,values,id:_id}=useContext(LetterContext)
    const {approval_manager,f_director}=values    
    const managers=[...approval_manager,...f_director]
    const {employees,users,socket,letters}=useContext(StoreContext)
    const {state:Employees}=employees
    const {state:Users}=users
    const user=new LettersClass(letters.state,Users,Employees)
    const letter=user.find_letter(_id)
    const rid=randomId()+socket?socket.id:'' 
    const [state,setState]=useState({i:0,...saveProcess('default')})
  
    useEffect(()=>{
//if the user is not on approval manager list add to partcipants list *
managers.find(m=> m.emp_id === emp_id)?Donothing():
setValues(s=>({...s,participants:[...s.participants,{emp_id}]}))

   },[]) 
  
/** search 
 * @param {*} index-string value to search from  
 */
const handleSearch=index=>setValues({...values,
    employees:index!==''?user.searchEmployee(index):[]}) 
 /**add the employee id participants array list
  * @param {*} emp_id-string of employee id 
  */ 
 const addParticipant=emp_id=>values.participants.find(p=> p.emp_id === emp_id)?
  Donothing():setValues(s=>({...s,participants:[...s.participants,{emp_id}]}))   
 /**removes the employee from participants array
  * @param {*} emp_id-string of employee id 
  */
  const removeParticpant=emp_id=>setValues(s=>({...s,
     participants:s.participants.filter(p=> p.emp_id !== emp_id)
  }))
  /**complete all process and send to the server */ 
  const saveLetter=()=>{
 
    try{
    const {type,title,objective,initial_place,
      destination_place,idate,imonth,iyear,rdate,rmonth,ryear,
      participants,description,project_name,program}=values
 
   let initial_date=type==='allowance'?convertToEuropean(idate,imonth,iyear):''
  let return_date=type==='allowance'?convertToEuropean(rdate,rmonth,ryear):''
   
    if(values.usage==='create') {
    /**telling user is saving process */
  setState(s=>({...s,...saveProcess('initial','saving please wait...')}))  
   /**sending to the server using socket connection */
   socket.emit('create_letter',{
     creater:user.getEmp_id(),
     type,title,description,objective,initial_place,
     project_name,program,destination_place,initial_date,
     return_date,participants,
     approval_manager:managers,rid
   })
  
   /**retrieving the response */ 
socket.on('create_letter',data=>{
   if ( data.rid === rid){
    createMessage(data)
  } 
  else{
setState(s=>({...s,...saveProcess('error','Saving error please try again letter')}))  
  } 
})
 
}
/**edit process */ 
 else if(values.usage==='edit'){
   var i=0
/**telling user is saving process */
setState(s=>({...s,...saveProcess('initial','updating please wait...')}))  
/**sending to the server using socket connection */
socket.emit('update_letter',{
  _id,...letter,
  type,title,description,objective,initial_place,
  project_name,program,destination_place,initial_date,
  return_date,participants,
  approval_manager:managers,rid
})

socket.on('update_letter',(data,i=0)=>{
  if(data._id === _id) {
   socket.emit('delete_letter_message',{_id})
   console.log(data)
   socket.on('delete_letter_message',data=>data._id === _id?
  createMessage({_doc:{title,_id}}):Donothing())
  }
  else{
    setState(s=>({...s,...saveProcess('error','updating error please try again letter')}))  
  }
})
}
  }
  catch(err){
console.log(err)
  }
  }

  const createMessage=data=>{
/**after saving create message that says about the letter */
socket.on('letters',l=>{
  let Letter=new LettersClass(l,Users,Employees)
  Letter.first_manager(data._doc._id).map(m=>{
    socket.emit('submit',{
      message:data._doc.title,
      letter_id:data._doc._id,
      sender:user.getEmp_id(),
      reciever:m.emp_id
    })
  })
 
 /*if their is no approval manager give it to particiapants */
  Letter.first_manager(data._doc._id).length?Donothing():
  Letter.participants(data._doc._id).map(p=>
   socket.emit('submit',{
    message:data._doc.title,
    letter_id:data._doc._id,
    sender:user.getEmp_id(),
    reciever:p.emp_id
   })
  )
  /**saved sucessfully*/
  setState(s=>({...s,
    ...values.usage==='create'?saveProcess('success','saving letter success'):
    saveProcess('success','updating letter success'),
    i:1   
  }))  
})
  }
   return (
       <div className="container">
           <div className="row">
               <div className="col-lg-12">
                   <h4 className="text-center my-3">
            Add participants           
                   </h4>
<p className="text-small font-weight-bold font-italic text-center">
   <FontAwesomeIcon icon={faInfo} className='text-info mx-2' />
    what are participants ?- are employees which don't need to approve 
    ,simply they are the employees that are include in the letter             
                  </p>     
               </div>
               <div className="col-lg-4"></div>
              <div className="col-lg-6">
              <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" 
  placeholder="Search employee name,department,userole"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    </div> 
                  </div>
                  <div className="col-lg-2"></div>
                  <div className="col-lg-12 mt-2">
                <MDBTable>
                    <MDBTableHead>
                    <tr>
                   <th>
            # Employee id           
                       </th>   
                    <th>
               <FontAwesomeIcon icon={faUser} className='mx-2'/>
               Employee name        
                        </th>
                     <th>
               <FontAwesomeIcon icon={faObjectGroup}  className='mx-2'/>
               Department         
                         </th> 
                      <th>
              <FontAwesomeIcon icon={faUserAlt} className='mx-2'/>
              User role            
                          </th> 
                      <th>
                <FontAwesomeIcon icon={faPlus} className='mx-2' />
                Select          
                          </th>             
                        </tr>    
                    </MDBTableHead>
        <MDBTableBody>
            {
         values.employees.length?
         values.employees.map(e=>{
           return(
            <tr key={e._id}>
           <td className='text-center font-weight-bold'>
            {e.emp_id}
           </td>
           <td>
            {user.Name(e.emp_id)}
           </td>
           <td>
             {e.department}
           </td>
           <td>
             {e.type}
           </td>
           <td>
             <button className="btn btn-info" 
     onClick={()=>addParticipant(e.emp_id)}>
               <FontAwesomeIcon icon={faPlus} className='mx-2'/>
               Add
             </button>
           </td>
           </tr>
           )
         })
         :
         <tr>
<td colSpan={5} className='text-center text-danger font-weight-bold'>No Employees found</td>
           </tr>     
            }
        </MDBTableBody>
                    </MDBTable>      
                  </div>
                    
                  <div className="col-lg-12 my-2">
       <MDBTable>
         <MDBTableHead>
         <tr>
                   <th>
            # Employee id           
                       </th>   
                    <th>
               <FontAwesomeIcon icon={faUser} className='mx-2'/>
               Employee name        
                        </th>
                     <th>
               <FontAwesomeIcon icon={faObjectGroup}  className='mx-2'/>
               Department         
                         </th> 
                      <th>
              <FontAwesomeIcon icon={faUserAlt} className='mx-2'/>
              User role            
                          </th>
       <th>
                 <FontAwesomeIcon icon={faTrash} className='mx-2' />
                 Remove         
                          </th>              
                        </tr>
         </MDBTableHead>
         <MDBTableBody>
          {
         !values.participants.length?
         <tr>
           <td colSpan={5} className='text-center font-weight-bold'>
        No particpants added
           </td>
         </tr>:
         values.participants.map(e=>{
            return(
              <tr key={e.emp_id}>
            <td className='text-center font-weight-bold'>
                {e.emp_id}
                </td>
            <td>{user.Name(e.emp_id)}</td>
            <td>{user.Department(e.emp_id)}</td>
            <td>{user.UserRole(e.emp_id)}</td>
            
 <td className='text-center' onClick={()=>removeParticpant(e.emp_id)}>
  <FontAwesomeIcon icon={faTrash} className='fa-1x' />
            </td>
              </tr>
            )
          })  
          }
        
         </MDBTableBody>
         </MDBTable>        
               </div>     
            <div className="col-lg-12 my-2">
            <div className="text-center">
  <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
 {
   state.loading?<DotLoading/>:<p></p>
  }
 </div>          
                </div>
          <div className="col-lg-6 my-2"></div>
          <div className="col-lg-6 my-2">
    <button disabled={state.disable} className="btn float-right btn-info" 
    onClick={()=>saveLetter()}>
           save
           </button>   
            </div>         
           </div>
       </div>

    )
}

export default AddParticipants
