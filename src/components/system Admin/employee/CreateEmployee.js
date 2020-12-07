import React,{ useState,useRef }  from 'react'
import axios from 'axios'
import '../../../css/Input.css'
import {DotLoading} from '../../layout/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faUserAlt, faLevelUpAlt, faDollarSign, faWindowRestore, faSave, faMale, faUserCheck, faObjectGroup } from '@fortawesome/free-solid-svg-icons'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import { host } from '../../config/config'
import { StoreContext } from '../../contexts/contexts'
import { useContext } from 'react'
import { decryptToken } from '../../auth/tokenEncryption'
const CreateEmployee =()=> {
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
          collapse : '',
          process:'',
          error:'',
          success:'',
          loading:false,
          disabled : false
    })
    const {department}=useContext(StoreContext)
    const {state:departments,loading,error}=department
     //list department
 const listDepartment=loading?
     <option value=""><DotLoading/></option>:
     error?
     <option value="">
         Department loading failed server is not active try again later or contact system admin to activate the server
         </option>:
         departments.map(d=>{
             return(
       <option value={d.name} key={d._id}>{d.name}</option>          
             )             
         })
      const positionRef=useRef(null)
      const  departmentRef=useRef(null)
      const typeRef=useRef(null)   
    const handleSubmit=async (e)=>{
       e.preventDefault()
       //getting value form state
       let {emp_id:id,middle_name,salary,type,position,official,first_name,last_name,sex,
        department,}=state
       
       if(position===''&&official){
           setState({...state,error:'Enter position of manager',process:'',success:''})
        positionRef.current.focus()
        }
       if(department===''&&!state.official){
        setState({...state,error:'Enter Department',process:'',success:''})
    departmentRef.current.focus()
    }
       else if(type===''){
      typeRef.current.focus()  
           setState({...state,error:'Enter user type based on system role',process:'',success:''})
       }
       else{ 
           
       //Know the user is registering process
       setState({...state,loading:true,disabled:true,process:'Registering',error:'',success:''})
       //getting token from localStorage
       let {token:Token,user_type:usertype}=localStorage
       //decrypting token
       const token=decryptToken(Token)
       let saveUser=encryptObject({
        emp_id:id,salary,middle_name,type,position,official,
        first_name,last_name,sex,department,token,usertype
    })
   //requesting encrpted data to server
       const Save=await axios.post(host+'/createEmployee',{data:saveUser})
       
       //decrypting response
       let res=decrptObject(Save.data)
       console.log(res)
       //if error occured with registration show message to user
       if(res.error){
           setState({...state,error:res.message.message,disabled:false,loading:false,process:'',success:''})
       }
       //user not created with out no error on server show error
       else if(!res.created){
        setState({...state,error:res.message,disabled:false,loading:false,process:'',success:''})
       
       }
       //if no error occured show success
   else if(res.created&&!res.error){
       setState({...state,error:'',success:'Employee has been registered successfully',
           process:'',error:'',disabled:false,loading:false  
    }
     )
   }      
}
    }
    return (
       <div className="col-lg-12">
       <form onSubmit={e=>handleSubmit(e)}>
       <div className="main-card mb-3 card">
           <div className="row">
               <div className="col-lg-12">
                   <h5 className="text-center font-weight-bold">
                       Register new Employee
                       </h5>
               </div>
               <div className="col-lg-6">
    <div className="card-body">
        {/**Id input is required  */}
        <p className="font-weight-bold text-center">id</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBarcode} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Employee id" onChange={e=>{
     setState({...state,emp_id:e.target.value,process:'',error:'',success:''})}}
     required={true}/>

 </div>
 <p className="font-weight-bold text-center">First name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faUserAlt} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
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
 placeholder="Middle name"
  onChange={e=>setState({...state,middle_name:e.target.value,process:'',error:'',success:''})}
     required={true}/>

 </div>
 <p className="font-weight-bold text-center">Last name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faUserAlt} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Last name" onChange={e=>setState({...state,last_name:e.target.value
 ,process:'',error:'',success:'' })}
     required={true}/>

 </div>
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
 placeholder="salary"  
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
<select className="input-field form-control my-auto" id='position' ref={positionRef}
onChange={e=>setState({...state,position:e.target.value,department:'',
       process:'',error:'',success:''})}>
    <option value="">Enter Position</option>
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
 <p className="font-weight-bold text-center">
         Department
         </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faObjectGroup} 
    className='text-info fa-2x mx-2 my-auto '/>
    <select className="input-field form-control my-auto"  ref={departmentRef}
onChange={e=>setState({...state,department:e.target.value,process:'',error:'',success:''})}>
    <option value="">Enter Department</option>
    {listDepartment}
</select>
</div>
 
<p className="font-weight-bold text-center">User type</p>
<div className="input-container">
<select className="input-field form-control my-auto"  ref={typeRef}
onChange={e=>setState({...state,type:e.target.value,process:'',error:'',success:''})}>
    <option value="">Enter user type</option>
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
          ...state,position:'',sex:'M',official:false,type:'',success:'',error:'',process:''
          })}>
         <FontAwesomeIcon icon={faWindowRestore}/>
         Reset
     </button>
 <button className="btn btn-primary" type='submit'
  disabled={state.disabled} >
     <FontAwesomeIcon icon={faSave} />
     Register
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

export default CreateEmployee
