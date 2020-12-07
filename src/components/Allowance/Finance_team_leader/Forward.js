import React, { useEffect, useState, useContext } from 'react'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import { userInfo } from '../../users/userInfo'
import axios from 'axios'
import { host } from '../../config/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faComment, faWindowClose, faForward } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { StoreContext } from '../../contexts/contexts'
import { EmployeeClass } from '../../../controllers/Employees'
import { AllowanceClass } from '../../../controllers/Allowance'
import { getDate } from '../../../controllers/Date'

  const ForwardToEmployee=(props)=> {
    const [state,setState]=useState({
      f_employee:'',
      process:'',error:'',disable:false,loading:false,success:''
    })  
    const {employees,allowances,users}=useContext(StoreContext)
    const employee=new EmployeeClass(employees.state)
    const Allowance=new AllowanceClass(allowances.state,employees.state,users.state)
    const emp_id=Allowance.getEmp_id()
    /**seen */
    const {allowance}=props
    const {seen}=allowance.f_pending_tl
    useEffect(()=>{
    if(!seen){
      const saveSeen=async ()=>{
        const GetDate=await getDate() //get date from the server 
    const req=await axios.put(host+'/allowances',{data:
      encryptObject({
        ...userInfo(),_id:allowance._id,
        f_pending_tl:{
          ...allowance.f_pending_tl,
          seen:true,
          seen_date:GetDate
            }     
      })
    })
       }
       saveSeen()
    }   
     },[])
     const handleSubmit=async (e)=>{
       e.preventDefault()
       const GetDate=await getDate()
       try{
       setState({...state,error:'',
       process:'Forwarding please wait...',
       loading:true,success:'',disable:true})    
        let data=encryptObject({
            ...userInfo(),_id:allowance._id,
            f_pending_tl:{
              ...allowance.f_pending_tl,
              forwarded:true
                },
            f_pending_emp:{
                   ...allowance.f_pending_emp,
                    emp_id:state.f_employee,
                    accepted_date:GetDate
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

   <div className="text-center">
  <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
       {
   state.loading?<DotLoading/>:<p></p>
      }
 </div>
   <button type="submit" className="float-right btn btn-info"
        disabled={state.disable}>
            Assign
       </button>
       
</form>   
                      </div>  
                </div>
            </div>
        </div>
    )
}

export default ForwardToEmployee
