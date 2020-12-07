import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import axios from 'axios'
import { host } from '../../config/config'
import { decryptToken } from '../../auth/tokenEncryption'

  const UserAccess=(props)=> {
    const [state,setState]=useState({
      progress:'',
      done:false,
      loading:false,
      disable:false
    })
    
  console.log(props)
    const userControl=async ()=>{
      //deleting process
   setState({...state,loading:true,disable:true,progress:'processing..'})   
   //getting _id and access 
    const {_id,access:acess}=props.user
    //change access
    const access=acess==='activated'?'deactivated':'activated'
    //encrypting request
    try{
       //getting token from localStorage
       let {token:Token,user_type:usertype}=localStorage
       //decrypting token
       const token=decryptToken(Token)
    const encrypt=encryptObject({_id,access,token,usertype})
    //sending to the server
    const req=await axios.put(host+'/accessUser',{data:encrypt})
    //decrypting response
    const res=decrptObject(req.data)
    if(res.error)
      {
  setState({
    ...state,loading:false,disable:false,progress:'user access control failed try again later',
          done:false        
      })
      }
      else if(!res.error&&res.activation){
  setState({
    ...state,loading:false,disable:false,done:true,
    progress:access+' success'        
      })     
      } 
  }
  catch(err){
setState({...state,disable:false,done:false,
  progress:'login failed server is not active try again later or contact system admin to activate the server'
})
  }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    
                        {state.done?
                            <h5 className="text-center text-success">
    <FontAwesomeIcon icon={faCheck} /> {state.progress}
    </h5>:
    <h5 className="text-danger text-info">
        {state.progress}
        </h5> 
                        }
                   <div className="text-center">
    { state.loading?<DotLoading/>:<p></p>   }  
                   </div>
                </div>
            </div>
        <div className="row float-right">
       {
           //if deactivated or activated populate with new data else close with out populating
           state.done?
        <button className="btn btn-info float-right mx-2"
         onClick={()=>props.fetch()} disabled={state.disable}>
        <FontAwesomeIcon icon={faWindowClose} className='mx-2 fx-2'/>
        Close
        </button>:
        <button className="btn btn-info float-right"
         onClick={props.close} disabled={state.disable}>
        <FontAwesomeIcon icon={faWindowClose} className='mx-2 fx-2'/>
        Cancel
        </button>
       }     
        
       {
           !state.done?
        <button className="btn btn-primary float-right mx-2"
         onClick={()=>userControl()} disabled={state.disable}>
        <FontAwesomeIcon icon={faCheck} className='mx-2 fx-2'/>
        Yes
        </button>:
        <p></p> 
       } 
        
        </div>
        </div>
    )
}

export default UserAccess
