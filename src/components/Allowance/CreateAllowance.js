import React, { useContext, useState } from 'react'
import { StoreContext } from '../contexts/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faProjectDiagram,  faBookmark, faBarcode, faDraftingCompass, faTruck, faTruckMoving, faSave, faMapMarked, faSuitcase, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../layout/Loading'
import { UsersClass } from '../../controllers/Users'
import { encryptObject,decrptObject } from '../auth/encrypt'
import axios from 'axios'
import { host } from '../config/config'
import { userInfo } from '../users/userInfo'
import { useRef } from 'react'
import {checkDate, convertToEuropean, getDate} from '../../controllers/Date'
import { saveProcess } from '../../controllers/saveProcess'
const CreateAllowance=()=> {
       const [state,setState]=useState({
         project_name:'',
         letter_id:'',
         program:'',
         objective:'',
         initial_place:'',
         destination_place:'',
         save_options:'approve',
         initial_date:Date.now(),
         destination_date:'',
         approval_manager:{
            emp_id:'',
            type :'', // Manager type (director || sector_leader || senior_officer )   
             },
           process:'',
           error:'',
           disable:false,
           loading:false,
           success:'',
           iday:'',rday:'', //initial date and arrival date
           imonth:'',rmonth:'', //initial month and arrival month
           iyear:'',ryear:''   //initial year and return year
       })
       const  {employees,users}=useContext(StoreContext)
       const {state:Employees,loading:empLoading,error:empError}=employees
       const {state:Users}=users
       const User=new UsersClass(Users,Employees)
       const id=User.getEmp_id(localStorage.id)
       const empDepartment=User.Department(id)
       const empManagers=User.avaliableManager(empDepartment)
       const Dateinput=useRef(null)
     
       
       /**Handle Submit */
       const handleSubmit=async (e)=>{
         e.preventDefault() 
         try{
            const initial_date=convertToEuropean(state.iday,state.imonth,state.iyear)
            const destination_date=convertToEuropean(state.rday,state.rmonth,state.ryear)
         const GetDate=await getDate() //gets date from the server
          
if(!checkDate(initial_date,destination_date)){
             Dateinput.current.focus()
            setState({...state,disable:false,process:'',
            loading:false,error:'Date validation error return date must be forward or equal to initial date',
             success:''
            })
         }
         else{
            try{
                /**disabling the button when saving */
           setState({...state,disable:true,process:'saving...',
           loading:true,error:'',success:''
           })
            const {
               project_name,letter_id,program,objective,initial_place,
               destination_place,save_options,approval_manager:ap
                 }=state
    /**director if approval by himself goto directly to finacne */
        let user_role=User.UserRole(id)   
        
        /**checking approval manager role and emp_id if true=> save */
const approval_manager=user_role==='director'||user_role==='f_director'
    ||user_role==='sector_leader'||user_role==='senior_officer' ?
          state.approval_manager.emp_id===id?
             {
                seen:true,
                approved:"Approved",
                emp_id:id,
                type:user_role,
                seen_date:Date.now(),
                comment:""
             }:ap:ap
const encrypt=encryptObject({
    project_name,letter_id,program,objective,destination_date,
    initial_date,initial_place,
    destination_place,save_options,approval_manager,
    department:empDepartment,creater:id,...userInfo(),        
            }) 
            //requesting
        const req=await axios.post(host+'/allowances',{data:encrypt})
        const res =decrptObject(req.data)
         if(res.error){
           setState({...state,disable:false,process:'',
           loading:false,error:res.message,success:''
           })
         }
         else if(!res.error&&res.created){
           setState({...state,disable:false,process:'',
           loading:false,error:'',success:res.message
           })
         }
           } 
           catch(err){
               console.log(err)
               setState({...state,disable:false,process:'',
           loading:false,error:'can not save server is not active',success:''
           })
           }
         }
        }
        catch(err){
            setState({...state,...saveProcess('error','Date validation please check the date you input')})
                }      
     }

    return (
        <form onSubmit={e=>handleSubmit(e)} >
        <div className="container">
            <div className="row">
                <div className="col-lg-6">
       
 {/**letter id */}
 <p className="font-weight-bold text-center">
    Letter id,name or code
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBarcode} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Letter id,name or code"
  onChange={e=>{
     setState({...state,letter_id:e.target.value,process:'',
     error:'',success:''
     })}}
     required={true}/>

 </div>
 {/** program*/}
 <p className="font-weight-bold text-center">
     Program
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBookmark} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="program name" onChange={e=>{
     setState({...state,program:e.target.value,process:'',
           error:'',success:''
       })}}
     required={true}/>

 </div> 
 <p className="font-weight-bold text-center">
     Project name and code
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faProjectDiagram} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder=" Project name and code" onChange={e=>{
     setState({...state,project_name:e.target.value,process:'',
     error:'',success:''
     })}}
     required={true}/>

 </div> 
 <p className="font-weight-bold text-center">
     Allowance Objective
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faDraftingCompass} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder=" Allowance Objective" onChange={e=>{
     setState({...state,objective:e.target.value,process:'',
     error:'',success:''
     })}}
     required={true}/>

 </div>   
     
 <p className="font-weight-bold text-center">
     Initial place
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faTruck} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder=" Initial Place" onChange={e=>{
     setState({...state,initial_place:e.target.value,process:'',
     error:'',success:''
     })}}
     required={true}/>

 </div> 
                </div>
                <div className="col-lg-6">
     
 <p className="font-weight-bold text-center">
     Destination place
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faMapMarked} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Destination Place" onChange={e=>{
     setState({...state,destination_place:e.target.value,process:'',
     error:'',success:''
     })}}
     required={true}/>

 </div> 
 <p className="font-weight-bold text-center">
     Initial Date
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30}   onChange={e=>{
     setState({...state,
     iday:parseInt(e.target.value),process:'',error:'',success:''
     })}} required={true}/>
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,imonth:parseInt(e.target.value)
        ,process:'',error:'',success:''})} required={true}>
        <option value="">Enter month</option>
      <option value='01'>መስከረም</option>
      <option value='02'>ጥቅምት</option>
      <option value='03'>ህዳር</option>
      <option value='04'>ታህሳስ</option>
      <option value='05'>ጥር</option>
      <option value='06'>የካቲት</option>
      <option value='07'>መጋቢት</option>
      <option value='08'>ሚያዝያ</option>
      <option value='09'>ግንቦት</option>
      <option value='10'>ሰኔ</option>
      <option value='11'>ሐምሌ</option>
      <option value='12'>ነሐሴ</option>
      <option value='13'>ጳጉሜ</option>
      </select> 
      <input className="input-field form-control my-auto" type="number"
 placeholder="YYYY"  min={2013} onChange={e=>{
     setState({...state,iyear:parseInt(e.target.value),process:'',
     error:'',success:''
     })}} required={true}/>
     <p className="my-auto font-weight-bold">
         E.C
         </p>    
 </div> 
 <p className="font-weight-bold text-center">
     Return Date
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30}   onChange={e=>{
     setState({...state,rday:parseInt(e.target.value)
     ,process:'',error:'',success:''
     })}} required={true} ref={Dateinput}/>
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,rmonth:parseInt(e.target.value)
        ,process:'',error:'',success:''})} required={true}>
      <option value="">Enter month</option>
      <option value='01'>መስከረም</option>
      <option value='02'>ጥቅምት</option>
      <option value='03'>ህዳር</option>
      <option value='04'>ታህሳስ</option>
      <option value='05'>ጥር</option>
      <option value='06'>የካቲት</option>
      <option value='07'>መጋቢት</option>
      <option value='08'>ሚያዝያ</option>
      <option value='09'>ግንቦት</option>
      <option value='10'>ሰኔ</option>
      <option value='11'>ሐምሌ</option>
      <option value='12'>ነሐሴ</option>
      <option value='13'>ጳጉሜ</option>
      </select> 
      <input className="input-field form-control my-auto" type="number"
 placeholder="YYYY"  min={2013} onChange={e=>{
     setState({...state,ryear:parseInt(e.target.value),process:'',
     error:'',success:''
     })}} required={true}/>
     <p className="my-auto font-weight-bold">
         E.C
         </p>
 </div> 
 <div className="text-center mt-2">
   <p className="font-weight-bold text-center">
           Save options
       </p>
 </div>
 
 <div className="input-container">
 <FontAwesomeIcon icon={faSave} className=' fa-2x mx-2 my-auto '/>
<select  className="input-field form-control my-auto"
   onChange={e=>e.target.value==='draft'?
   setState({...state,save_options:e.target.value,
    approval_manager:{emp_id:'',type:''}}):
   setState({...state,save_options:e.target.value})}
   >
    <option value="approve">Save and start approving</option>
    <option value="draft">Save as draft</option>
</select>

 </div>
 <p className="font-weight-bold text-center">
        Approve to manager
      </p>
           <div className="input-container">
 <FontAwesomeIcon icon={faSuitcase} 
    className=' fa-2x mx-2 my-auto '/>
<select  className="input-field form-control my-auto" 
   onChange={e=>setState({...state,approval_manager:{
       emp_id:e.target.value,type:User.UserRole(e.target.value)
       }})}
    required={true} 
    >
    <option value="">Enter Approving Manager</option>
    {
        empLoading?
        <option value=""><DotLoading/></option>:
        empError?
        <option value="">Server is not active</option>:
        empManagers.length?
        empManagers.map(e=>{
          return(
              <option value={e.emp_id} key={e._id}>
                  {User.Name(e.emp_id)} ({User.UserRole(e.emp_id)})
                  </option>
          )  
        }):
        <option value="" className='text-danger font-weight-bold'>
            No available Manager registered
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
 {
     state.save_options==='draft'?
     <button type='submit' className="btn btn-large btn-outline-primary ml-4 my-auto"
  disabled={state.disable}>
     Save as Draft
 </button>:
    state.save_options==='approve'?
 <button type='submit' className="btn btn-large btn-outline-primary ml-4 mx-2 my-auto"
  disabled={state.disable}>
     Save and start approving
 </button>:
 <p></p>
 }
   
 <button className="btn btn-danger btn-large mx-2 my-auto" type='reset' disabled={state.disable}
 onClick={e=>setState({...state,error:'',process:'',success:''})}
 >
     Reset
     </button>
                </div>
            </div>
        </div>
        </form>
    )
}

export default CreateAllowance
