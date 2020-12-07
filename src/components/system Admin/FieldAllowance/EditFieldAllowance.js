import React, { useState, useContext,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faSuitcase, faWindowRestore, faSave, faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import { StoreContext } from '../../contexts/contexts'
import { DotLoading } from '../../layout/Loading'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import axios from 'axios'
import { host } from '../../config/config'
import { employeeChecker } from '../../../controllers/checker'
import { decryptToken } from '../../auth/tokenEncryption'

  const EditFieldAllowance=(props)=> {
      const [state,setState]=useState({
          emp_id:'',
          position:'',
          inside_addis_ababa:0,
          outside_addis_ababa:0,
          process:'',error:'',success:'',disable:'',
          loading:false,check:false  //check refers to emp_id should be checked if any change is occured
      })
      //getting employee information for their emp_id
      const {employees}=useContext(StoreContext)
      const {state:Employees,loading,error}=employees
      const {fieldEmployees}=useContext(StoreContext)
      const {state:FieldEmployees}=fieldEmployees
    useEffect(()=>{
      setState({
          ...state,...props.employee
      })
    },[])
      const handleSubmit=async (e)=>{
        e.preventDefault()
      
    //if employee id is not set show error
        if(state.emp_id===''){
        setState({...state,error:'Enter employee id',success:'',process:''})    
        }
        else{
         //setting unregistered employee for registration registered employees doesn't include on the array 
    state.check?(
    employeeChecker(FieldEmployees,state.emp_id)?
    setState({...state,error:'sorry can not edit...Employee with the same id is registered before',success:'',process:''})    
    :Success())
    :Success()   
    }
      }
      const Success=async ()=>{
        setState({...state,error:'',success:'',process:'registering...',loading:true,disable:true})    
               
        //getting values to send to the server
         const {emp_id,position,inside_addis_ababa,outside_addis_ababa}=state       
              try{
      //getting token from localStorage
      let {token:Token,user_type:usertype}=localStorage
      //decrypting token
      const token=decryptToken(Token)
      /**encrypting requset for security */            
            //encrypting      
        const encrypt=encryptObject({
            token,usertype,emp_id,position,inside_addis_ababa,
            outside_addis_ababa,_id:props.employee._id})
           //sending to the server
          const req= await axios.put(host+'/fieldAllowance',{data:encrypt})
          //decrypting response
          const res=decrptObject(req.data)
          if(res.error){
         setState({...state,error:'can not update employee',disable:false,
          loading:false,success:'',process:''})
          }
          else if(!res.error&&res.updated){
              setState({...state,error:'',disable:false,
              loading:false,success:'update successfull',process:''})
                      
          } 
          }
              catch(err){
      setState({...state,error:'updating failed server is not active try again later or contact system admin to activate the server',
          disable:false,loading:false,success:''
          })
        
              }
      }
    return (
       <div className="container">
           <div className="row">
               <div className="col-lg-12">
        <form onSubmit={e=>handleSubmit(e)}>
        <p className="font-weight-bold text-center">Employee id</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBarcode} 
    className='text-info fa-2x mx-2 my-auto '/>
<select className="input-field form-control my-auto" value={state.emp_id} 
   onChange={e=>setState({
    ...state,emp_id:e.target.value,
    check:e.target.value!==props.employee.emp_id?true:false,
    process:'',error:'',success:''
     })}>
    <option value="">Enter Employee id</option>
    {
        loading?<DotLoading/>:
        error?
        <option value="">Sorry can't get users server is down</option>:
        Employees.map(e=>{
            return(
                <option value={e.emp_id} key={e._id}>{e.emp_id}</option>   
            )
        })
    }
    
    </select>
</div>
<p className="font-weight-bold text-center">job position</p>
  <div className="input-container">
 <FontAwesomeIcon icon={faSuitcase} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" 
 placeholder="job position" onChange={e=>setState({
   ...state,
   position:e.target.value,process:'',error:'',success:'' 
 })}  required={true} value={state.position}
     />

 </div>
 <p className="font-weight-bold text-center">allowance in addis ababa</p>
  <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="allowance in addis ababa" onChange={e=>setState({
   ...state,inside_addis_ababa:e.target.value,process:'',
     error:'',success:'' 
 })}  required={true}  value={state.inside_addis_ababa}
     />

 </div>
 <p className="font-weight-bold text-center">allowance outside addis ababa</p>
  <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="allowance outside addis ababa" onChange={e=>setState({
   ...state,
   outside_addis_ababa:e.target.value,process:'',error:'',success:'' 
 })}  required={true} value={state.outside_addis_ababa}
     />

 </div>     
  
            {/**Buttons and info while saving */}
<div className="text-center">
                   <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
 {
     state.loading?<DotLoading/>:<p></p>
 }
 <div className="input-container">
 <button className="btn btn-info mx-3" type='reset'
      disabled={state.disable}
      onClick={()=>setState({ 
          ...state,...props.employee,success:'',error:'',process:''
          })}>
         <FontAwesomeIcon icon={faWindowRestore}/>
         Reset
     </button>
 <button className="btn btn-primary" type='submit'
  disabled={state.disable} >
     <FontAwesomeIcon icon={faSave} />
     Register
     </button>
     
 </div>
 
                   </div>
                   </form>
               </div>
           </div>
       </div>
    )
}

export default EditFieldAllowance
