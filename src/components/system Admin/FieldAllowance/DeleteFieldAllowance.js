import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import axios from 'axios'
import { host } from '../../config/config'
import { decryptToken } from '../../auth/tokenEncryption'

  const DeleteFieldAllowance=(props)=> {
    const [state,setState]=useState({
        progress:'',
        disable:false,
        loading:false,
        deleted:false,
    })
    const Delete=async ()=>{
        /**
         * telling the user the employee is being deleted process
         * Disabling the delete button is useful not add task when deleting
        */
        setState({...state,progress:'Deleting',disable:true,loading:true}) 
   let {_id}=(props.employee)
   //encrypting request
   try{
       //getting token from localStorage
       let {token:Token,user_type:usertype}=localStorage
       //decrypting token
       const token=decryptToken(Token)
       /**encrypting requset for security */
   let req=encryptObject({_id,usertype,token})
   //sending Del request to the server
   const del=await axios.put(host+'/delFieldAllowance',{data:req})
   //decrpting response
   const res=decrptObject(del.data)
   //if error occured while deleting show error
 if(res.error){
       //desplaying error
    setState({...state,progress:'unable to delete try again',disable:false,loading:false})
   }
   //if deleted successfully show success
   else if(res.deleted&&!res.error){
       //displaying success
       setState({...state,progress:'Delteted sucessfully',disable:false,
    loading:false,deleted:true,cancel:'close'
    })
   }}
   catch(err){
   console.log(err)
   setState({...state,progress:'unable to delete server is not active',disable:false,loading:false})
       
   }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    
                        {state.deleted?
                            <h5 className="text-center text-success">
    <FontAwesomeIcon icon={faCheck} /> Deleted
    </h5>:
    <h5 className="text-center text-info">
        {state.progress}
        </h5> 
                        }
                   <p className="text-center">
    { state.loading?<DotLoading/>:<p></p>   }  
                   </p>
                </div>
            </div>
        <div className="row float-right">
       {
           //if deleted poulate with new data else close with out populating
           state.deleted?
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
           !state.deleted?
        <button className="btn btn-primary float-right mx-2" onClick={()=>Delete()} disabled={state.disable}>
        <FontAwesomeIcon icon={faCheck} className='mx-2 fx-2'/>
        Yes
        </button>:
        <p></p> 
       } 
        
        </div>
        </div>
    )
}

export default DeleteFieldAllowance
