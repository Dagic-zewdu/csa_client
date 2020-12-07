import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faLock, faCheck } from '@fortawesome/free-solid-svg-icons'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import axios from 'axios'
import { host } from '../../config/config'
import { DotLoading } from '../../layout/Loading'
import { decryptToken } from '../../auth/tokenEncryption'

 const ResetPassword=(props)=> {
     const [state,setState]=useState({
         password:'',
         cpsw:'',
         success:'',
         error:'',
         process:'',
         loading:'',
         disable:''
     })
     
     const handleSubmit=async (e)=>{
         e.preventDefault()
   //if password confirmation error
   if(state.cpsw!==state.password){
    setState({
...state,error:'password confirmation error confirm your password carefully',
success:'',process:''
    })
}     
    else{
      //setting id of the user from the props
      setState({...state,loading:true,disable:true,error:'',success:'',
    process:'reseting password'
    })  
        const {_id}=props.user
        try{
             //getting token from localStorage
          let {token:Token,user_type:usertype}=localStorage
          //decrypting token
          const token=decryptToken(Token)
     //encrypting request
     const encrypt=encryptObject({_id,password:state.password,usertype,token})
     //sending to the server
     const req= await axios.put(host+'/resetPassword',{data:encrypt})
     //decrypting responce
     const res=decrptObject(req.data)
     if(res.error){
  setState({
  ...state,loading:false,disable:false,error:'sorry can not reset password try again later',
     success:'',process:''        
    })       
     }
     else if(!res.error&&!res.reset){
   setState({
   ...state,loading:false,disable:false,error:'sorry can not reset password try again later',
     success:''        
      })
     }
     else if(!res.error&&res.reset){
        setState({
    ...state,loading:false,disable:false,error:'',
        success:'Reset password succsessfull'        
        })
     }
        }
        catch(err){
     console.log(err)
     setState({...state,disable:false,
        error:'login failed server is not active try again later or contact system admin to activate the server',
        success:''
    })
        }
    }
     }
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                <div className="signup-form ">	
    <form className='main-card mb-3 card' onSubmit={e=>handleSubmit(e)}>
		<p className="font-weight-bold text-center">
      if you are reseting the password please Enter new password      
            </p>
     
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
            <button type="submit" disabled={state.disable} 
            className="btn btn-primary btn-block btn-lg">
            Reset
            </button>
        </div>

</form>
</div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
