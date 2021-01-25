import React, { useContext, useState, useRef } from 'react'
import { StoreContext } from '../contexts/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faProjectDiagram,  faBookmark, faBarcode, faDraftingCompass, faTruck, faTruckMoving, faSave, faMapMarked, faSuitcase, faPencilAlt, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../layout/Loading'
import { UsersClass } from '../../controllers/Users'
import { encryptObject,decrptObject } from '../auth/encrypt'
import axios from 'axios'
import { host } from '../config/config'
import { useEffect } from 'react'
import { userInfo } from '../users/userInfo'
import { AllowanceClass } from '../../controllers/Allowance'
import { DateFormat, checkDate, toEthiopianDate, convertToEuropean } from '../../controllers/Date'
import { fetchData_Allowance } from '../fetchers/Functions/FecthAllowance'
import { saveProcess } from '../../controllers/saveProcess'

   const EditAllowance=(props)=> {
       const [state,setState]=useState({
         project_name:'',
         letter_id:'',
         program:'',
         objective:'',
         initial_place:'',
         destination_place:'',
         save_options:'approve',
         approval_manager:{
            emp_id:'',
            type :'', // Manager type (director || sector_leader || senior_officer )   
             },
           process:'',
           error:'',
           disable:false,
           loading:false,
           success:'' ,
           idate:'',imonth:'',iyear:'', //intial date date,month,year
           rdate:'',rmonth:'',ryear:''  //return date,month,year  
       })
       /**convert the date to ethiopian */
const {date:idate,month:imonth,year:iyear}=toEthiopianDate(props.allowance.initial_date) 
const {date:rdate,month:rmonth,year:ryear}=toEthiopianDate(props.allowance.destination_date)
       useEffect(()=>{
   setState({
       ...state,...props.allowance,
       idate,imonth,iyear,
       rdate,rmonth,ryear
          })
       },[props.allowance])
       const  {employees,users,dispatchAllowances,allowances}=useContext(StoreContext)
       const {state:Employees,loading:empLoading,error:empError}=employees
       const {state:Users}=users
       const User=new UsersClass(Users,Employees)
       const id=User.getEmp_id(localStorage.id)
       const empDepartment=User.Department(id)
       const empManagers=User.avaliableManager(empDepartment)
       /**Allowance class */
     const Allowance=new AllowanceClass(allowances.state,Employees,Users)  
    /**Handle Submit */
    const Dateinput=useRef(null)
   
       const handleSubmit=async (e)=>{
         e.preventDefault()
    try{
/**convert the date to gregorian */
const initial_date=convertToEuropean(state.idate,state.imonth,state.iyear)
const destination_date=convertToEuropean(state.rdate,state.rmonth,state.ryear)
    
        /**check the duration is valid */
       if(!checkDate(initial_date,destination_date)){
        Dateinput.current.focus()
        setState({...state,disable:false,process:'',
        loading:false,error:'Date validation error destination date must be forward from arrival date',
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
            destination_place,save_options,approval_manager
              }=state
        
     const encrypt=encryptObject({
        project_name,letter_id,program,objective,initial_place,
        destination_place,save_options,approval_manager,
        _id:props.allowance._id,department:empDepartment,
        creater:id,...userInfo(),initial_date,destination_date   
              }) 
         //requesting
     const req=await axios.put(host+'/allowances',{data:encrypt})
     const res =decrptObject(req.data)
      if(res.error){
        setState({...state,disable:false,process:'',
        loading:false,error:'can not save changes try again later',success:''
        })
      }
      else if(!res.error&&res.updated){
          fetchData_Allowance(dispatchAllowances)
        setState({...state,disable:false,process:'',
        loading:false,error:'',success:'edit Successfull'
        })
      }
        } 
        catch(err){
            console.log(err)
            setState({...state,disable:false,process:'',
        loading:false,error:'can not save server is not active',success:''
        })
        }}
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
     })}} value={state.letter_id}
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
     setState({...state,program:e.target.value,process:'',error:'',success:''})}}
     required={true} value={state.program}/>

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
     })}}  value={state.project_name}
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
     })}} value={state.objective}
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
     })}}  value={state.initial_place}
     required={true}/>

 </div> 
 
 </div> 
 <div className="col-lg-6">
 {/**Date */}
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
     })}}  value={state.destination_place}
     required={true}/>

 </div>
 <p className="font-weight-bold text-center">
     Initial Date
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30} value={state.idate}  onChange={e=>{
     setState({...state,
     idate:parseInt(e.target.value),process:'',error:'',success:''
     })}} required={true} />
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,imonth:parseInt(e.target.value)
        ,process:'',error:'',success:''})} value={state.imonth} required={true}>
        <option value="">mm</option>
      <option value={1}>መስከረም</option>
      <option value={2}>ጥቅምት</option>
      <option value={3}>ህዳር</option>
      <option value={4}>ታህሳስ</option>
      <option value={5}>ጥር</option>
      <option value={6}>የካቲት</option>
      <option value={7}>መጋቢት</option>
      <option value={8}>ሚያዝያ</option>
      <option value={9}>ግንቦት</option>
      <option value={10}>ሰኔ</option>
      <option value={11}>ሐምሌ</option>
      <option value={12}>ነሐሴ</option>
      <option value={13}>ጳጉሜ</option>
      </select> 
      <input className="input-field form-control my-auto" type="number"
 placeholder="YYYY"  min={2013} onChange={e=>{
     setState({...state,iyear:parseInt(e.target.value),process:'',
     error:'',success:''
     })}} required={true} value={state.iyear}/>
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
 placeholder="dd" min={1} max={30} value={state.rdate}  
      onChange={e=>{
     setState({
...state,rdate:parseInt(e.target.value),...saveProcess('default')})}} 
     required={true} ref={Dateinput}/>
  <select  className="input-field form-control my-auto" value={state.rmonth}
      onChange={e=>setState({...state,rmonth:parseInt(e.target.value)
        ,process:'',error:'',success:''})} required={true}>
        <option value="">mm</option>
      <option value={1}>መስከረም</option>
      <option value={2}>ጥቅምት</option>
      <option value={3}>ህዳር</option>
      <option value={4}>ታህሳስ</option>
      <option value={5}>ጥር</option>
      <option value={6}>የካቲት</option>
      <option value={7}>መጋቢት</option>
      <option value={8}>ሚያዝያ</option>
      <option value={9}>ግንቦት</option>
      <option value={10}>ሰኔ</option>
      <option value={11}>ሐምሌ</option>
      <option value={12}>ነሐሴ</option>
      <option value={13}>ጳጉሜ</option>
      </select> 
      <input className="input-field form-control my-auto" type="number"
 placeholder="YYYY"  min={2013} onChange={e=>{
     setState({...state,ryear:parseInt(e.target.value),process:'',
     error:'',success:''
     })}} required={true} value={state.ryear}/>
     <p className="my-auto font-weight-bold">
         E.C
         </p>
 </div> 

 {/**save options */}
 {
     Allowance.progress(props.allowance._id)===0?
     <div className="">
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
   setState({...state,save_options:e.target.value})} value={state.save_options}
   >
    <option value="approve">Save and start approving</option>
    <option value="draft">Save as draft</option>
</select>

 </div>
 {
     state.save_options==='approve'&& empManagers.length?
     <p className="font-weight-bold text-center">
        Approve to manager
      </p>:
      <p></p>
 }
       {
           state.save_options === 'approve'&& empManagers.length?
           <div className="input-container">
 <FontAwesomeIcon icon={faSuitcase} 
    className=' fa-2x mx-2 my-auto '/>
<select  className="input-field form-control my-auto"
   onChange={e=>setState({...state,approval_manager:{
       emp_id:e.target.value,type:User.UserRole(e.target.value)
       }})}  value={state.approval_manager.emp_id}
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
        <option value=""></option>
    }
    <option value="draft">Save as draft</option>
</select>

 </div>:
 <p></p>
       }
 
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
     state.save_options==='draft'?
     <button type='submit' className="btn btn-large btn-outline-primary ml-4 my-auto"
  disabled={state.disable}>
  <FontAwesomeIcon icon={faPencilAlt} />
     Draft update
 </button>:
    state.save_options==='approve'?
 <button type='submit' className="btn btn-large btn-outline-primary ml-4 mx-2 my-auto"
  disabled={state.disable}>
     <FontAwesomeIcon icon={faPencilAlt} />
     update
 </button>:
 <p></p>
 }
 </div>
            </div>
        </div>
        </form>
    )
}

export default EditAllowance
