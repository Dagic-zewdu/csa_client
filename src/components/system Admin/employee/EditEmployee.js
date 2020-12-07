import React,{ useState , useContext }  from 'react'
import axios from 'axios'
import '../../../css/Input.css'
import {DotLoading} from '../../layout/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faUserAlt, faLevelUpAlt, faDollarSign, faWindowRestore, faSave, faMale, faUserCheck, faObjectGroup, faEdit } from '@fortawesome/free-solid-svg-icons'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import { host } from '../../config/config'
import { useEffect } from 'react'
import { StoreContext } from '../../contexts/contexts'
import { fetchEmployees, addEmployees, loadingEmployees } from '../../../store/Actions/employeeAction'
import { decryptToken } from '../../auth/tokenEncryption'
const EditEmployee =(props)=> {
    const [state,setState]=useState({
         emp_id:'',
        first_name:'',
        last_name:'',
        middle_name:'',
         sex:'M',
         position:'',
         department:'',
         official:false,
         salary:'',
         type:'',
          check:{
              female:false,
              male:true,
          },
          process:'',
          error:'',
          success:'',
          loading:false,
          disabled : false
    })
  const {employee}=props
  const {employees}=useContext(StoreContext)
  const {state:Employees}=employees
  useEffect(()=>{
      setState({
          ...state,
       ...employee,
          check:{
              female:employee.sex==='F'?true:false,
              male:employee.sex==='M'?true:false,
          },
        })
  },[])
  const {department}=useContext(StoreContext)
  const {state:departments,loading,error}=department
     //list department
 const listDepartment=loading?
     <option value=""><DotLoading/></option>:
     error?
     <option value="" className='text-danger'>
         Department loading failed server is not active try again later or contact system admin to activate the server
         </option>:
         departments.map(d=>{
             return(
       <option value={d.name} key={d._id}>{d.name}</option>          
             )             
         })
    
  const handleSubmit=async (e)=>{
       e.preventDefault()
    //getting value form state by destructuring
const {emp_id:id,type,position,official,department}=state   
    if(position===''&&official){
           setState({...state,error:'Enter position of manager',process:'',success:''})
       }
       else if(type===''){
        setState({...state,error:'Enter user type based on system role',process:'',success:''})
       }
       else if(department===''){
 setState({...state,error:'Enter Department',process:'',success:''})
       }
        
     else{
         //check if the employee is created with the same id before 
        if(employee.emp_id!==id)
        {
        const isCreated=Employees.filter(e=>{
               return e.emp_id===id 
           })
           //show error if the user is created before
     isCreated.length>0?
setState({...state,error:'Employee is registered with the same id before employee id must be unique',process:'',success:''})           
:Success()          
             
        }
        else{
            Success()
        }     
    }
    }
    const Success=async ()=>{
//getting value form state by destructuring
const {emp_id:id,middle_name,salary,type,position,official,first_name,last_name,sex,
    department}=state
   //Know the user is updating process
   setState({...state,loading:true,disabled:true,process:'uploading',error:'',success:''})
   //getting token from localStorage
   let {token:Token,user_type:usertype}=localStorage
   //decrypting token
   const token=decryptToken(Token)
   let saveUser=encryptObject({
    emp_id:id,salary,middle_name,type,position,official,
    first_name,last_name,sex,department,_id:employee._id,token,usertype
})
   //requesting encrpted data to server
   const Save=await axios.put(host+'/employee',{data:saveUser})
   
   //decrypting response
   let res=decrptObject(Save.data)
   //if error occured with registration show message to user
   if(res.error){
       setState({...state,error:res.message.message,disabled:false,loading:false,process:'',success:''})
   }
  
   //if no error occured show success
else if(res.updated&&!res.error){
   setState({...state,error:'',success:'update successfull',
       process:'',error:'',disabled:false,loading:false  
})

}
    }
    return (
       <div className="col-lg-12">
       <form onSubmit={e=>handleSubmit(e)}>
       <div className="main-card mb-3 card">
           <div className="row">
               <div className="col-lg-12">
                   <h5 className="text-center font-weight-bold">
                       Edit Employee
                       </h5>
               </div>
               <div className="col-lg-6">
    <div className="card-body">
        {/**Id input is required  */}
        <p className="font-weight-bold text-center">id</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBarcode} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" value={state.emp_id}
 placeholder="Employee id" onChange={e=>{
     setState({...state,emp_id:e.target.value,process:'',
     error:'',success:''})}}
     required={true}/>

 </div>
 <p className="font-weight-bold text-center">First name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faUserAlt} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" value={state.first_name}
 placeholder="First name"
  onChange={e=>setState({...state,first_name:e.target.value,
  process:'',error:'',success:''})}
     required={true}/>

 </div>
 <p className="font-weight-bold text-center">Middle name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faUserAlt} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Middle name" value={state.middle_name}
  onChange={e=>setState({...state,middle_name:e.target.value,process:'',error:'',success:''})}
     required={true}/>

 </div>
 {/**Edit last name */}
 <p className="font-weight-bold text-center">Last name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faUserAlt} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" value={state.last_name}
 placeholder="Last name" onChange={e=>setState({...state,last_name:e.target.value
 ,process:'',error:'',success:'' })}
     required={true}/>

 </div>
 {/**Edit sex */}
 <p className="font-weight-bold text-center">Sex</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faMale} 
    className='text-info fa-2x mx-2 my-auto '/>
    <input type="radio" name="gender" value="male" 
    checked={state.check.male} className='my-auto mx-3' 
    onChange={e=>setState({...state,sex:'M',check:{male:true,female:false}})}
     />Male
  <input type="radio" name="gender" value="female"
  className='my-auto mx-3' checked={state.check.female} 
  onChange={e=>setState({...state,sex:'F',check:{male:false,female:true}})}
  /> Female
</div>

 

 </div>
               </div>
               <div className="col-lg-6">
               <p className="font-weight-bold text-center">salary</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faDollarSign} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type='number' required={true}
min='0'
 placeholder="salary"  value={state.salary}  
     onChange={e=>setState({...state,salary:e.target.value,process:'',error:'',success:''})}
     />
</div>
   <p className="font-weight-bold text-center">
       official ( if official fill postion of manager)

   </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faUserCheck} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className='font-weight-bold my-auto'>is employee offical?</p>
<input className="my-auto" type="checkbox" 
onClick={e=>setState(s=>({...state,official:!s.official,position:'',process:'',error:'',success:''}))} 
checked={state.official} />

 </div>
 {
     state.official?
 <div className="input-container">
<select className="input-field form-control my-auto" id='position' value={state.position}
onChange={e=>setState({...state,position:e.target.value,process:'',error:'',success:''})}>
    <option value={state.position}>{state.position}</option>
    <option value="superintendent">superintendent ( በላይ ሀላፊ )</option>
    <option value="commissioner">commissioner ( ከፍተኛ ሀላፊ )</option>
    <option value="spr_member_1">spr member 1 (ክልል ም/ቤት አባል 1)</option>
    <option value="spr_member_2">spr member 2 (ክልል ም/ቤት አባል 2)</option>
    <option value="medium_manager">Medium level manager ( መካከለኛ ሀላፊ )</option>
<option value="others">others</option>
</select>
</div>:
 <p></p>
 }
 <p className="font-weight-bold text-center">Department</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faObjectGroup} 
    className='text-info fa-2x mx-2 my-auto '/>
    <select className="input-field form-control my-auto" value={state.department}
onChange={e=>setState({...state,department:e.target.value,process:'',error:'',success:''})}>
   <option value={state.department}>{state.department}</option>
   {listDepartment}
</select>
</div>
<p className="font-weight-bold text-center">User type</p>
<div className="input-container">
<select className="input-field form-control my-auto" value={state.type}
onChange={e=>setState({...state,type:e.target.value,process:'',error:'',success:''})}>
   <option value={state.type}>{state.type}</option>
    <option value="employee">Employee</option>
    <option value="team_leader">Team leader ( ቡድን ሀላፊ )</option>
    <option value="director">Director</option>
    <option value="sector_leader">sector leader (ዘርፍ ሀላፊ)</option>
    <option value="senior_officer">commissioner</option>
    <option value="system_admin">System admin</option>
    <option value="f_employee">Finance Employee</option>
    <option value="f_team_leader">Finance Team leader</option>
    <option value="f_director">Finance Director</option>
    <option value="f_sector_leader">Finance Sector leader</option>
</select>
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
      disabled={state.disabled}
      onClick={()=>setState({ 
          ...state,...employee,check:{
              female:employee.sex==='F'?true:false,
              male:employee.sex==='M'?true:false,
          },type:employee.type
          })}>
         <FontAwesomeIcon icon={faWindowRestore}/>
         Reset
     </button>
 <button className="btn btn-primary" type='submit'
  disabled={state.disabled} >
     <FontAwesomeIcon icon={faEdit} />
     update
     </button>
     
 </div>
 
                   </div>
               </div>
           </div>
    </div>
           </form>
           </div>
           
    )
}

export default EditEmployee
