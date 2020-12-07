import React, { useEffect, useState, useContext } from 'react'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import { userInfo } from '../../users/userInfo'
import axios from 'axios'
import { host } from '../../config/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faComment, faWindowClose, faForward } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { StoreContext } from '../../contexts/contexts'
import { getDate } from '../../../controllers/Date'
import { saveProcess } from '../../../controllers/saveProcess'
import { UsersClass } from '../../../controllers/Users'
import { DeductionClass } from '../../../controllers/Deductions'

  const Forward_to_Employee=(props)=> {
     
    const [state,setState]=useState({
        approved:'',
        comment:'',
        check:{Approved:false,unApproved:false,comment:false},
        f_employee:'',
        ...saveProcess('default')
    })
    const { allowances,dispatchDeductions,deductions,employees,users }=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,error:empError}=employees
    const {state:Users,loading:userLoading,error:userError}=users
    const {state:Deductions,loading:deductionsLoading,error:deductionError}=deductions
    const Deduction=new DeductionClass(Deductions,Allowances,Employees,Users)
     const employee=new UsersClass(Users,Employees)
    const emp_id=Deduction.getEmp_id()
    /**seen */
    const {deduction}=props
   const Donothing=()=>{}
     const handleSubmit=async (e)=>{
       e.preventDefault()
       const GetDate=await getDate()
       try{
       setState({...state,error:'', process:'Forwarding please wait...',
                 loading:true,success:'',disable:true})    
        let data=encryptObject({
            ...userInfo(),...deduction,_id:deduction._id,
            f_tl_pending:{
                ...deduction.f_tl_pending,
                emp_id,
                approve:state.approved,
                comment:state.comment,
                approved_date:GetDate
                 },
            f_employee:{
                   ...deduction.f_employee,
                    emp_id:state.f_employee,
                    accepted_date:GetDate
                }
        
          })
          //make request
          const req=await axios.put(host+'/deductions',{data})
       const res=decrptObject(req.data) 
       console.log(res)
    res.error?
        setState({...state,error:'unable to take action try again later',
        process:'',loading:false,success:'',disable:false}):  
!res.error&&res.updated?setState({...state,error:'',success:'Action made successfully',
process:'',loading:false,disable:false})
   :   Donothing()      
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
     checked={state.check.Approved} className='my-auto mx-3' onChange={e=>setState(s=>({...state,
     approved:s.approved==='Approved'?'':'Approved',
     check:{Approved:!s.check.Approved,unApproved:false,comment:false,
        }}))}/>
        Approve 
 </div>
 <div className="input-container">
  <FontAwesomeIcon icon={faComment} 
     className='text-warning fa-2x mx-2 my-auto '/>
     <input type="checkbox" name="approval" value="male"  checked={state.check.comment} 
     className='my-auto mx-3' onChange={e=>setState(s=>({...state,
     approved:s.approved==='commented'?'':'commented',
     check:{Approved:false,unApproved:false,comment:!s.check.comment,
        }}))}/>
        Comment
 </div> 
 <div className="input-container">
  <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-2x mx-2 my-auto '/>
     <input type="checkbox" name="approval" value="male" 
     checked={state.check.unApproved} className='my-auto mx-3' 
     onChange={e=>setState(s=>({...state,
     approved:s.approved==='unApproved'?'':'unApproved',
     check:{Approved:false,unApproved:!s.check.unApproved,comment:false,
        }}))}/>
        un Approve
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
    

{/** */}
{
    state.check.Approved&&state.approved==='Approved'?
    <div>
    <p className="font-weight-bold text-center">
    please Select Employee to do the calculation
        </p>
  <div className="input-container">
 <FontAwesomeIcon icon={faForward} 
    className='text-warning fa-2x mx-2 my-auto '/>
    <select className="input-field form-control my-auto"
    onChange={e=>setState({
       ...state,f_employee:e.target.value  
       })}
    required={true} >
        <option value="">Select Employee</option>
        {
            employee.F_Employee().length?
            employee.F_Employee().map(f=>{
            return(
          <option value={f.emp_id} key={f._id}>
              {employee.Name(f.emp_id)}     
              </option>      
            )    
            })
     :<option value="" className='text-danger'>
         No finance employee availiable
     </option>
        }
        
    </select>
</div>     

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
   <button type="submit" className="float-right btn btn-info" disabled={state.disable}>
            Done
       </button>
       
</form>   
                      </div>  
                </div>
            </div>
        </div>
    )
}

export default Forward_to_Employee
