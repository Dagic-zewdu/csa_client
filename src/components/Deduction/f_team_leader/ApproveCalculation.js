import { faCheck, faComment, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useState } from 'react'
import {getDate} from '../../../controllers/Date'
import { saveProcess } from '../../../controllers/saveProcess'
import { decrptObject, encryptObject } from '../../auth/encrypt'
import { host } from '../../config/config'
import { DotLoading } from '../../layout/Loading'
import { userInfo } from '../../users/userInfo'
const ApproveCalculation=(props)=> {
    const {deduction}=props
    const [state,setState]=useState({
        approved:'',
        comment:'',
        check:{Approved:false,unApproved:false,comment:false},
        ...saveProcess('default')
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
    const approved_date=await getDate()
    console.log(approved_date,state.comment)
  const data=encryptObject({
      ...userInfo(),_id:deduction._id,...deduction,
      f_tl_approve:{
          ...deduction.f_tl_approve,
          approve:state.approved,
          approved_date:state.approved==='Approved'?approved_date:'',
          comment:state.comment,
          redone:state.check.comment?true:false
      },
      f_employee:{...deduction.f_employee,redone:false}
    })
    const req=await axios.put(host+'/deductions',{data})
    const res=decrptObject(req.data)
    if(res.error){
      setState({...state,...saveProcess('error','can not take action please try again later')})
    }
    else if(!res.error&&res.updated){
      setState({...state,error:'',success:'Action made success',process:'',disable:false,loading:false})
    }
        }
        catch(err){
          setState({...state,error:'can not save server is not responding',
          success:'',process:'',disable:false,loading:false})
       
        }
}
    }
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
      />Approve 
 </div>
 <div className="input-container">
  <FontAwesomeIcon icon={faComment} 
     className='text-warning fa-2x mx-2 my-auto '/>
     <input type="checkbox" name="approval" value="male" 
     checked={state.check.comment} className='my-auto mx-3' 
     onChange={e=>setState(s=>({...state,
     approved:s.approved==='commented'?'':'commented',
     check:{Approved:false,unApproved:false,comment:!s.check.comment,
        }}))}
      />Do it again
 </div> 
 <div className="input-container">
  <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-2x mx-2 my-auto '/>
     <input type="checkbox" name="approval" value="male" 
     checked={state.check.unApproved} className='my-auto mx-3' 
     onChange={e=>setState(s=>({...state,
     approved:s.approved==='unApproved'?'':'unApproved',
     check:{Approved:false,unApproved:!s.check.unApproved,comment:false,
        }}))}
      />un Approve
 </div>
 {
    ( state.check.comment&&state.approved==='commented')||
   state.check.unApproved&&state.approved==='unApproved'?
     <p className="font-weight-bold text-center">
     please write a comment
         </p>:
     <p></p>
   
 }
 
    {
     ( state.check.comment&&state.approved==='commented')||
   state.check.unApproved&&state.approved==='unApproved'?
  <div className="input-container">
  <FontAwesomeIcon icon={faComment} className='text-warning fa-2x mx-2 my-auto '/>
     <textarea className="input-field form-control my-auto" type="text"
  placeholder="write comment" onChange={e=>{
      setState({...state,comment:e.target.value})}}
      required={true}  cols="20" rows="5"></textarea>
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

export default ApproveCalculation
