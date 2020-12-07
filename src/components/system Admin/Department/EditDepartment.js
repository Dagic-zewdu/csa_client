import React, { useEffect, useContext } from 'react'
import { useState } from 'react'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectGroup, faBuilding, faPhone } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { host } from '../../config/config'
import { departmentChecker } from '../../../controllers/checker'
import { StoreContext } from '../../contexts/contexts'
import { decryptToken } from '../../auth/tokenEncryption'

 const EditDepartment=(props)=> {
    const [state,setState]=useState({
        name:'',
        office_number:'',
        phone:'',
        process:'',
        error:'',
        success:'',
        checker:false,
        disable:false
    }) 
    useEffect(()=>{
     setState({...state,...props.department})
     },[props.department])
  const {department:dep}=useContext(StoreContext)
    const {state:Departments}=dep
     const handleSubmit=async (e)=>{
   e.preventDefault()
//checking if the department is registered before
//if state checker is on it means department should be checked   
state.checker?
//if state checker is true find department with the same name
   departmentChecker(Departments,state.name)?
   //show error if department is found
   setState({...state,disable:false,process:'',
 error:'you have registered department with the same name',success:''})
    :
    //else continue editing process
    Success()   
    :Success()  
     }
     const Success=async ()=>{
         //know the user is editing is in process
   setState({...state,success:'',
   process:'updating...',error:'',disable:true})
    //getting token from localStorage
    let {token:Token,user_type:usertype}=localStorage
    //decrypting token
    const token=decryptToken(Token)
   //encrypting request
   const data=encryptObject({
       name:state.name,
    office_number:state.office_number,
    phone:state.phone,
    _id:props.department._id,token,usertype
}) 
  //sending to server
  try{
    const req=await axios.put(host+'/department',{data})
    //decrypting request
    const res=decrptObject(req.data) 
    //show error if error occured during registration
    if(res.error){
     setState({...state,disable:false,process:'',error:'updating failed try again',success:''})
    }
    else if(res.updated&&!res.error){
 setState({...state,disable:false,process:'',
 error:'',success:'Edited successfully'})
    }
  }
  catch(err){
    setState({
        ...state,disable:false,process:'',
    error:'Editing failed server is not active try again later or contact system admin to activate the server',
    success:''})
  }
     }
    return (
      <div className="col-lg-12">
       <form onSubmit={e=>handleSubmit(e)} >
       <div className="main-card mb-3 card">
       <div className="col-lg-12">
                   <h5 className="text-center font-weight-bold">
                      Edit Department
                       </h5>
               </div>
               <div className="col-lg-12">
                   {/* input department name */}
               <p className="font-weight-bold text-center">Name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faObjectGroup} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" value={state.name}
 placeholder="Name" onChange={e=>{
     setState({...state,name:e.target.value,process:'',error:'',
     success:'',checker:props.department.name!==e.target.value?true:false})}}
     required={true}/>

 </div>  
           {/* input department office_number */}
           <p className="font-weight-bold text-center">office number</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBuilding} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" value={state.office_number}
 placeholder="office number" onChange={e=>{
     setState({...state,office_number:e.target.value,process:'',error:'',success:''})}}
     />

 </div>  
 <p className="font-weight-bold text-center">phone number</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faPhone} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" value={state.phone}
 placeholder="Department phone number" onChange={e=>{
     setState({...state,phone:e.target.value,process:'',error:'',success:''})}}
     />
 </div>
 <div className="text-center">
  <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
 </div>
 <button type='submit' className="btn btn-large btn-primary float-right mt-2" disabled={state.disable}>
     Save
 </button> 
 <button className="btn btn-info btn-large float-left mt-2" type='reset' disabled={state.disable}
 onClick={e=>setState({...state,office_number:props.department.office_number,
 phone:props.department.phone,name:props.department.name,
 error:'',process:'',success:''})}
 >
     Reset
     </button>          
               </div>
           </div>
           </form>
           </div>
    )
}

export default EditDepartment
