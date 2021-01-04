import React, { useState } from 'react'
import { faBarcode, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { encryptObject, decrptObject } from '../auth/encrypt'
import axios from 'axios'
import { host } from '../config/config'
import { DotLoading } from '../layout/Loading'
import { Link } from 'react-router-dom'
import { encryptToken } from '../auth/tokenEncryption'
import { withRouter } from 'react-router'

   const Login=(props)=> {
       const [state,setState]=useState({
           emp_id:'',
           password:'',
           success:'',
           process:'',
           error:'',
           loading:false,
           disable:false
       })
  const handleSubmit = async (e)=>{
      e.preventDefault();
      //encrypting request
    try
    {
      setState({...state,loading:true,disable:true,error:'',success:''})  
      const {emp_id,password}=state
      const encrypt=encryptObject({emp_id,password})
      const req=await axios.post(host+'/login',{data:encrypt})
      const res=decrptObject(req.data)
      if(!res.login&&!res.error){
      setState({
        ...state,loading:false,disable:false,error:res.message,success:''        
      })    
      }
      else if(!res.login&&res.error){
        setState({
  ...state,loading:false,disable:false,error:'login failed try again later',
       success:''        
          })     
      }
      else if(!res.error&&res.login){
          if(res.access==='deactivated'){
            setState({
...state,loading:false,disable:false,error:'login failed the account is deactivated by system admin contact system admin for more info',
        success:''        
         })     
          }
          else
       {
          //seting token and id to localstorage
        let {Token:token,id,user_type}=res   
        //encrypting token
      const Token=encryptToken(token)
        localStorage.removeItem('id')
        localStorage.removeItem('token')
        localStorage.removeItem('auth')
        localStorage.removeItem('user_type') 
        localStorage.removeItem('emp_id')
        localStorage.setItem('id',id)
        localStorage.setItem('token',Token)
        localStorage.setItem('auth',true)
        localStorage.setItem('user_type',user_type) 
        localStorage.setItem('emp_id',res.emp_id)  
        setState({
            ...state,loading:false,disable:false,error:'',
                 success:res.message        
       })
  setTimeout(()=>{
      user_type==='system_admin'?props.history.push('/admin'):
      props.history.push('/')
  },1000)      
    }   
      }
    }
    catch(err){
        setState({...state,disable:false,
        error:'login failed server is not active try again later or contact system admin to activate the server',
        success:''})
    } 
    }
    return (
        <div className="container center-box">
            <div className="row">
                <div className="col-lg-4">
                </div>
                <div className="col-lg-4">
                <div className="signup-form ">	
    <form className='main-card mb-3 card' onSubmit={e=>handleSubmit(e)}>
		<h2>Login</h2>
		<p className="lead">
            welcome to allowance system please fill out this form inorder
            to proceed
            </p>
        <div className="form-group">
			<div className="input-group input-container">
				<span className="input-group-addon">
                    <FontAwesomeIcon icon={faBarcode}
                     className="fa fa-barcode"/>
                    </span>
    <input type="text" className="input-field form-control" 
        placeholder="Employee id" required={true}
        onChange={e=>setState({...state,emp_id:e.target.value,
        success:'',error:'',process:''})}
        />
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
		
        <div className="text-center">
 <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 {
     state.loading?<DotLoading/>:<p></p>
 }
 </div>    
 <div className="form-group">
            <button type="submit" disabled={state.disable} 
            className="btn btn-primary btn-block btn-lg">
            Login</button>
        </div>
        <p className="small text-center">
            If you forget your password contact admin to reset your password 
             <br/><Link to='/contact'>contact admin</Link></p>
 <div className="text-center">New to this system?
     <Link to='/signup'>
      create account here
      </Link>
      </div>
</form>
</div>
                </div>
            </div>
        </div>
    )
}

export default withRouter (Login)
