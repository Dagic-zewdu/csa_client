import React, { useEffect, useState, useContext } from 'react'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import { userInfo } from '../../users/userInfo'
import axios from 'axios'
import { host } from '../../config/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faComment, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { StoreContext } from '../../contexts/contexts'
import { EmployeeClass } from '../../../controllers/Employees'
import { AllowanceClass } from '../../../controllers/Allowance'
import { getDate } from '../../../controllers/Date'

  const PendingDirector=(props)=> {
    const [state,setState]=useState({
       approved:'',
       comment:'',
       check:{
    Approved:false,
    unApproved:false,
      },
      tm_emp_id:'',
       process:'',error:'',disable:false,loading:false,success:''
    })  
    const {employees,allowances,users}=useContext(StoreContext)
    const employee=new EmployeeClass(employees.state)
    const Allowance=new AllowanceClass(allowances.state,employees.state,users.state)
    const emp_id=Allowance.getEmp_id()
    /**seen */
    const {allowance}=props
    const {seen}=allowance.f_pending_dr
    const encrypt=encryptObject({
      ...userInfo(),_id:allowance._id,
      f_pending_dr:{
        ...allowance.f_pending_dr,
        seen:true
          }     
    })
    useEffect(()=>{
    if(!seen){
      const saveSeen=async ()=>{
    const req=await axios.put(host+'/allowances',{data:encrypt})
       }
       saveSeen()
    }   
     },[])
     const handleSubmit=async (e)=>{
       e.preventDefault()
       const GetDate=await getDate() //get date from the server
       try{
       setState({...state,error:'',
       process:'Taking action please wait',
       loading:true,success:'',disable:true})    
        let data=encryptObject({
            ...userInfo(),_id:allowance._id,
            f_pending_dr:{
              ...allowance.f_pending_dr,
              emp_id,
              comment:state.comment,
              approved:state.approved,
              approved_date:state.approved==='Approved'?GetDate:''
                },
                f_pending_tl:{
                   ...allowance.f_pending_tl,
                    emp_id:state.tm_emp_id,
                    accepted_date:state.approved==='Approved'?GetDate:''
                }
        
          })
          //make request
          const req=await axios.put(host+'/allowances',{data})
       const res=decrptObject(req.data) 
    if(res.error){
        setState({...state,error:'unable to take action try again later',
        process:'',loading:false,success:'',disable:false})  
    }
    else if(!res.error&&res.updated){
        setState({...state,error:'',
        success:'Action made successfully',process:'',
        loading:false,disable:false})
    }        
       }
       catch(err){
           console.log(err)
        setState({...state,error:'error while taking action server is not responding',
        success:'',process:'',loading:false,disable:false})
       }
     }
     
     /** */
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12 text-center">
                  <div className="card">
                      <form onSubmit={e=>handleSubmit(e)}>
 <div className="input-container">
 <FontAwesomeIcon icon={faCheck} 
    className='text-info fa-2x mx-2 my-auto '/>
    <input type="checkbox" name="approval" value="male" 
    checked={state.check.Approved} className='my-auto mx-3' 
    onChange={e=>setState(s=>({...state,
    approved:s.approved==='Approved'?'':'Approved',
    check:{Approved:!s.check.Approved,unApproved:false,comment:false,
       }}))}
     />Accept and start calculation 
</div>
<div className="input-container">
 <FontAwesomeIcon icon={faWindowClose} 
    className='text-danger fa-2x mx-2 my-auto '/>
    <input type="checkbox" name="approval" value="male" 
    checked={state.check.unApproved} className='my-auto mx-3' 
    onChange={e=>setState(s=>({...state,
    approved:s.approved==='unApproved'?'':'unApproved',
    check:{Approved:false,unApproved:!s.check.unApproved,comment:false,
       }}))}
     />
     Reject
</div>
{
    state.check.unApproved&&state.approved==='unApproved'?
    <p className="font-weight-bold text-center">
    please write a comment why you reject this allowance
        </p>:
    <p></p>
  
}

   {
    state.check.unApproved&&state.approved==='unApproved'?
 <div className="input-container">
 <FontAwesomeIcon icon={faComment} 
    className='text-warning fa-2x mx-2 my-auto '/>
    <textarea className="input-field form-control my-auto" type="text"
 placeholder="write comment" onChange={e=>{
     setState({...state,comment:e.target.value})}}
       cols="20" rows="5"></textarea>
</div>:
 <p></p>  
   }
   {
    state.check.Approved&&state.approved==='Approved'?
    <p className="font-weight-bold text-center">
    please Select team leader to forward
        </p>:
        <p></p>
   }
   {
  state.check.Approved&&state.approved==='Approved'?
  employee.F_TeamLeader()?
  <div className="input-container">
 <FontAwesomeIcon icon={faComment} 
    className='text-warning fa-2x mx-2 my-auto '/>
    <select className="input-field form-control my-auto"
    onChange={e=>setState({
       ...state,tm_emp_id:e.target.value  
       })}
    required={true} >
        <option value="">Enter team leader</option>
        {
            employee.F_TeamLeader().length?
            employee.F_TeamLeader().map(f=>{
            return(
          <option value={f.emp_id} key={f._id}>
              {employee.Name(f.emp_id)}     
              </option>      
            )    
            })
     :<option value="" className='text-danger'>
         No finance team leader availiable
     </option>
        }
        
    </select>
    
</div>
:<p></p>
:<p></p>     
   }  
   <div className="text-center">
  <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
       {
   state.loading?<DotLoading/>:<p></p>
      }
 </div>
   {
       state.check.Approved||state.check.comment||state.check.unApproved?
       <button type="submit" className="float-right btn btn-info"
        disabled={state.disable}>
            Done
       </button>
       :
       <p></p>
   }   
</form>   
                      </div>  
                </div>
            </div>
        </div>
    )
}

export default PendingDirector
