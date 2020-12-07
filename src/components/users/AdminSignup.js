import React,{useState, useContext, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUser, faLock, faCheck } from '@fortawesome/free-solid-svg-icons'
import { StoreContext } from '../contexts/contexts'
import {  DotLoading } from '../layout/Loading'
import { encryptObject,decrptObject } from '../auth/encrypt'
import axios from 'axios'
import { host } from '../config/config'
import { withRouter } from 'react-router'
import CompanyFetcher from '../fetchers/CompanyFetcher'
import ConfigFetch from '../fetchers/configFetcher'
import UsersFetcher from '../fetchers/UsersFetcher'
import { encryptToken } from '../auth/tokenEncryption'
   const AdminSignup=(props)=> {
    const [state,setState]=useState({
        employee_id:'super_admin',
        username:'',
        password:'',
        cpsw:'', //confirm password
       process:'',
       success:'',
       error:'',
       loading:false,
       disabled:'' 
    })
    //getting data from the store by destructuring
    const {users,company,config}=useContext(StoreContext)
    const {state:Users,loading,}=users
    const {state:Company,loading:loadingCompany}=company
    const {state:Config,loading:loadingConfig}=config
   //checking usertype
   let find=Users.filter(E=>{
    return E.user_type==='system_admin'  
       })
       useEffect(()=>{
      //if configured push to Admin sign up
      if(!loading&&!loadingConfig&&!loadingCompany){
        var x
/**checking whether company info is set if set push to create system config
 * if system config is set push to '/adminSignUp'
 * if all are set push to '/login'
 *  */   
Company.length?
Config.length?
find.length?
props.history.push('/login'):x=3             //if system admin is set push to login
:
props.history.push('/createConfiguration'): //if configuration info is not set push to company 
props.history.push('/createCompany')  //if company info is not set push to company     
        }

       })
    const handleSubmit=async (e)=>{
   e.preventDefault();
    if(state.cpsw!==state.password){
     setState({
    ...state,success:'',process:'',
    error:'password confirmation error confirm your password carefully',
        })
 }
 else{
     //sign up in process
      setState({...state,loading:true,disabled:true,
     process:'creating account...',error:'',success:''})   
  let {username,password,employee_id:emp_id}=state
  const user_type='system_admin'  
  const encrypt=encryptObject({username,password,emp_id,user_type})
  try{
const req=await axios.post(host+'/signup',{data:encrypt})
const res=decrptObject(req.data)
 if(res.error){
     setState({...state,loading:false,disabled:false,
         process:'',error:'can not create account try again later',
         success:''}) 
 }
 else if(!res.error&&!res.signed){
     setState({...state,loading:false,disabled:false,
         process:'',error:res.message,
         success:''}) 
 }
 else if(!res.error&&res.signed){
     //storing the reponse token and info to localStorage
 let {Token:token,id}=res
     //encrpting token and storing to localStorage
     const Token=encryptToken(token)
 localStorage.removeItem('id')
 localStorage.removeItem('token')
 localStorage.removeItem('auth')
 localStorage.removeItem('user_type') 
 localStorage.setItem('id',id)
 localStorage.setItem('token',Token)
 localStorage.setItem('auth',true)
 localStorage.setItem('user_type',user_type) 
 setState({...state,loading:false,disabled:false,
         process:'',error:'',success:res.message})
    setTimeout(()=>{
  props.history.push('/admin')},
   1000)//after displaying success push to create admin panel
                      
 }
 
  }
  catch(err){
     setState({...state,disable:false,process:'',loading:false,
     error:'saving failed server is not active try again later or contact system admin to activate the server',
     success:''})
  } 
 }
   }
 return (
     <div className="container">
         <div className="row">
             <div className="col-lg-4">
                 {/**fetching some data */}
             <UsersFetcher/>
             <CompanyFetcher/>
             <ConfigFetch/>    
             </div>
             <div className="col-lg-4">
             <div className="signup-form ">	
 <form className='main-card mb-3 card' onSubmit={e=>handleSubmit(e)}>
     <h2>Create Admin Account</h2>
     <p className="lead">
         welcome to allowance system  create Admin account this is useful
         for  system configuration
         
         </p>
     <div className="form-group">
         <div className="input-group">
             <span className="input-group-addon">
             <FontAwesomeIcon icon={faUser} className="fa fa-user"/>    
                 </span>
             <input type="text" className="form-control" 
              placeholder="username"
 onChange={e=>setState({...state,username:e.target.value,
      success:'',error:'',process:''
 })}             
               required={true}/>
         </div>
     </div>
     <div className="form-group">
         <div className="input-group">
             <span className="input-group-addon">
     <FontAwesomeIcon icon={faLock} className="fa fa-lock" />            
                 </span>
             <input type="password" className="form-control" name="password"
              placeholder="Password" required={true}
onChange={e=>setState({...state,password:e.target.value,success:'',
  error:'',process:''   
})}              
              />
         </div>
     </div>
     <div className="form-group">
         <div className="input-group">
             <span className="input-group-addon">
         <FontAwesomeIcon icon={faLock} className="fa fa-lock" />
         <FontAwesomeIcon icon={faCheck} className='fa fa-check' />      
             </span>
             <input type="password" className="form-control" 
              placeholder="Confirm Password" required={true}
onChange={e=>setState({...state,cpsw:e.target.value,success:'',
  error:'',process:''   
      })}            
              />
         </div>
     </div>
     <div className="text-center">
                <p className="text-danger text-center font-weight-bold">{state.error}</p>
<p className="text-success text-center font-weight-bold">{state.success}</p>
<p className="text-info text-center font-weight-bold">{state.process}</p>
{
  state.loading?<DotLoading/>:<p></p>
}
</div>    
<div className="form-group">
         <button type="submit" disabled={state.disabled} 
         className="btn btn-primary btn-block btn-lg">
         Sign Up
         </button>
     </div>
   
</form>
</div>
             </div>
         </div>
     </div>
 )
}

export default withRouter( AdminSignup)
