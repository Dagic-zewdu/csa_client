import React,{ useState, useContext } from 'react'
import { faObjectGroup, faPhone, faBuilding } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { host } from '../../config/config'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import { StoreContext } from '../../contexts/contexts'
import { departmentChecker } from '../../../controllers/checker'
import { decryptToken } from '../../auth/tokenEncryption'

 const CreateDepartment=()=> {
     const [state,setState]=useState({
         name:'',
         office_number:'',
         phone:'',
         process:'',
         error:'',
         success:'',
         disable:false
     })
     const {department}=useContext(StoreContext)
     const {state:Department}=department
     const handleSubmit = async (e)=>{
        /**know the user the register is in process
         * disabling the save button 
         */
        e.preventDefault()
        let {name,office_number,phone}=state
 setState({...state,process:'saving...',error:'',success:'',disable:true})
   //checking if the department is registered before
  let departmentFound=departmentChecker(Department,state.name)
   //if department exist show error
   if(departmentFound){
    setState({...state,disable:false,process:'',
    error:'you have registered department with the same name',success:''})
   }
   else{
        //getting token from localStorage
        let {token:Token,user_type:usertype}=localStorage
        //decrypting token
        const token=decryptToken(Token)
        /**encrypting requset for security */
 const encrypt=encryptObject({name,office_number,phone,token,usertype})
        //sending to the server
        try{
        const req=await axios.post(host+'/department',{data:encrypt})
        const res=decrptObject(req.data) 
        //show error if error occured during registration
        if(res.error){
         setState({...state,disable:false,process:'',error:'saving department failed try again',success:''})
        }
        //if the department is registered before show
        else if(!res.error&&!res.created){
       setState({...state,disable:false,process:'',error:res.message,success:''})
        }
        else{
     setState({...state,disable:false,process:'',error:'',
          success:'saved successfully'})
        }
    }
        //catch error if server is not active
        catch(err){
            setState({...state,disable:false,process:'',
            error:'saving failed server is not active try again later or contact system admin to activate the server',
            success:''})
        }   
   }
    }
    return (
       <div className="col-lg-12">
       <form onSubmit={e=>handleSubmit(e)} >
       <div className="main-card mb-3 card">
       <div className="col-lg-12">
                   <h5 className="text-center font-weight-bold">
                       Register new Department
                       </h5>
               </div>
               <div className="col-lg-12">
                   {/* input department name */}
               <p className="font-weight-bold text-center">Name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faObjectGroup} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Name" onChange={e=>{
     setState({...state,name:e.target.value,process:'',error:'',success:''})}}
     required={true}/>

 </div>  
           {/* input department office_number */}
           <p className="font-weight-bold text-center">office description</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBuilding} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="office number" onChange={e=>{
     setState({...state,office_number:e.target.value,process:'',error:'',success:''})}}
     />

 </div>  
 <p className="font-weight-bold text-center">phone number</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faPhone} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
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
 onClick={e=>setState({...state,office_number:'',phone:'',error:'',process:'',success:''})}
 >
     Reset
     </button>          
               </div>
           </div>
           </form>
           </div>
    )
}

export default CreateDepartment
