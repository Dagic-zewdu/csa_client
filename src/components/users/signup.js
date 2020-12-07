import React,{useState, useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faUser, faLock, faCheck } from '@fortawesome/free-solid-svg-icons'
import EmployeeFetcher from '../fetchers/employeeFetchers'
import { StoreContext } from '../contexts/contexts'
import {  DotLoading } from '../layout/Loading'
import {Link} from 'react-router-dom'
import { encryptObject,decrptObject } from '../auth/encrypt'
import axios from 'axios'
import { host } from '../config/config'
import { encryptToken } from '../auth/tokenEncryption'
import { withRouter } from 'react-router'
   const Signup=(props)=> {
       const [state,setState]=useState({
           employee_id:'',
           username:'',
           password:'',
           cpsw:'', //confirm password
          process:'',
          success:'',
          error:'',
          loading:false,
          disabled:'' 
       })
       const {employees}=useContext(StoreContext)
       const {state:Employees,loading,error}=employees
      const handleSubmit=async (e)=>{
      e.preventDefault();
      //checking id
     let {employee_id:id}=state
      let find=Employees.filter(E=>{
        return E.emp_id===id  
     })
       if(find.length===0){
setState({
    ...state,error:'sorry your id is not registered please contact system admin you can not access the system at the moment',
    success:'',process:''
})
       }
    else if(state.cpsw!==state.password){
        setState({
    ...state,error:'password confirmation error confirm your password carefully',
    success:'',process:''
        })
    }
    else{
        //sign up in process
         setState({...state,loading:true,disabled:true,
        process:'creating account...',error:'',success:''})   
     let {username,password,employee_id:emp_id}=state
     const {type:user_type}=find[0]  
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
    }
    setTimeout(()=>{
        user_type==='system_admin'?props.history.push('/admin'):
        props.history.push('/')
    },1000)
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
                <EmployeeFetcher/>    
                </div>
                <div className="col-lg-4">
                <div className="signup-form ">	
    <form className='main-card mb-3 card' onSubmit={e=>handleSubmit(e)}>
		<h2>Create Account</h2>
		<p className="lead">
            welcome to allowance system  create your account by puting
            your employee id and you can use what ever user name as you desired
            </p>
        <div className="form-group">
			<div className="input-group input-container">
				<span className="input-group-addon">
                    <FontAwesomeIcon icon={faBarcode}
                     className="fa fa-barcode"/>
                    </span>
    <input type="text" className="input-field form-control" 
        placeholder="Employee id" required={true}
        onChange={e=>setState({...state,employee_id:e.target.value,success:'',
     error:'',process:''})}
        />
            </div>
        </div>
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
 {
     loading?
     <div className="text-center text-info">
         data is loading <DotLoading/> please wait 
     </div>:
     error?
     <p className="text-center text-danger">
         sorry the server is not active please contact the system admin 
          or try again later by refreshing this page
     </p>:

     <div className="form-group">
            <button type="submit" disabled={state.disabled} 
            className="btn btn-primary btn-block btn-lg">
            Sign Up</button>
        </div>
 }    
		<p className="small text-center">If your id is not found please
            contact system admin because you are not registered on the system
             <br/><Link to='/contact'>contact admin</Link></p>
 <div className="text-center">Already have an account?
     <Link to='/login'>
      Login here
      </Link>
      </div>
</form>
</div>
                </div>
            </div>
        </div>
    )
}

export default withRouter( Signup)
