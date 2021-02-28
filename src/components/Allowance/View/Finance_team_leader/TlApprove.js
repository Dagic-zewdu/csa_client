import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faWindowClose, faComment } from '@fortawesome/free-solid-svg-icons'
import { userInfo } from '../../users/userInfo'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import axios from 'axios'
import { host } from '../../config/config'
import { DotLoading } from '../../layout/Loading'
import { AllowanceClass } from '../../../controllers/Allowance'
import { StoreContext } from '../../contexts/contexts'

  const TlApprove=(props)=> {
      const {allowance}=props
      const { allowances,employees,users}=useContext(StoreContext)
    const {state:Allowances}=allowances
    const {state:Employees}=employees
     const {state:Users}=users 
     const Allowance=new AllowanceClass(Allowances,Employees,Users)
      const [state,setState]=useState({
      approved:'',
      check:{
          Approved:false,
          comment:false
      },
      comment:'',
      process:'',error:'',disable:false,loading:false,success:''
      })
      const handleSubmit=async (e)=>{
          e.preventDefault()
 if(state.approved===''){
  setState({...state,error:'please make your decision to save',success:'',
  process:''
})
 }
 else{
    setState({...state,process:'taking action please wait...',
    error:'',success:'',disable:true,loading:false
})
  try{
    const data=encryptObject({
        ...userInfo(),_id:allowance._id,
        f_approve_tm:{
          ...allowance.f_approve_tm,
          approved:state.approved,
          approved_date:state.approved==='Approved'?Date.now():'',
          comment:state.approved==='commented'?state.comment:''
        },
        f_pending_emp:{
          ...allowance.f_pending_emp,
          redone:false
        }
      })
      const req=await axios.put(host+'/allowances',{data})
      const res=decrptObject(req.data)
      if(res.error){
        setState({...state,error:'can not take action please try again later',
          success:'',process:'',disable:false,loading:false})
      }
      else if(!res.error&&res.updated){
        setState({...state,error:'',success:'Action made success',process:'',disable:false,loading:false})
      }
          }
          catch(err){
            console.log(err)
            setState({...state,error:'can not save server is not responding',
            success:'',process:'',disable:false,loading:false})
         
          }
 }
      }
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
    <div className="card">
   <form onSubmit={e=>handleSubmit(e)}>
   <div className="input-container">
 <FontAwesomeIcon icon={faCheck} 
    className='text-info fa-2x mx-2 my-auto '/>
    <input type="checkbox" name="approval" value="male" 
    checked={state.check.Approved} className='my-auto mx-3' 
    onChange={e=>setState(s=>({...state,
    approved:s.approved==='Approved'?'':'Approved',
    check:{Approved:!s.check.Approved,comment:false,
       }}))}
     />Approve 
</div>
<div className="input-container">
 <FontAwesomeIcon icon={faWindowClose} 
    className='text-danger fa-2x mx-2 my-auto '/>
    <input type="checkbox" name="approval" value="male" 
    checked={state.check.comment} className='my-auto mx-3' 
    onChange={e=>setState(s=>({...state,
    approved:s.approved==='commented'?'':'commented',
    check:{Approved:false,comment:!s.check.comment,
       }}))}
     />
     Do it again
</div>
{
    state.check.comment&&state.approved==='commented'?
    <p className="font-weight-bold text-center">
    please write a comment
        </p>:
    <p></p>
  
}
{
     state.check.comment&&state.approved==='commented'?
 <div className="input-container">
 <FontAwesomeIcon icon={faComment} 
    className='text-warning fa-2x mx-2 my-auto '/>
    <textarea className="input-field form-control my-auto" type="text"
 placeholder="write comment" required={true} onChange={e=>{
     setState({...state,comment:e.target.value})}}
       cols="20" rows="5"></textarea>
</div>:
 <p></p>  
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
       state.check.Approved||state.check.comment?
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

export default TlApprove
