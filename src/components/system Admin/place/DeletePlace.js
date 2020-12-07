import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import axios from 'axios'
import { host } from '../../config/config'
import { decrptObject, encryptObject } from '../../auth/encrypt'
import { decryptToken } from '../../auth/tokenEncryption'
 const DeletePlace=(props)=> {
    const [state,setState]=useState({
        progress:'',
        disable:false,
        loading:false,
        deleted:false,
    })
    const Delete=async ()=>{
        /**
         * telling the user the places is being deleted process
         * Disabling the delete button is useful not add task when deleting
        */
        setState({...state,progress:'Deleting',disable:true,loading:true}) 
   let {_id}=props.places
    //getting token from localStorage
    let {token:Token,user_type:usertype}=localStorage
    //decrypting token
    const token=decryptToken(Token)
   //encrypting request
   let req=encryptObject({_id,token,usertype})
   //sending Del request to the server
   const del=await   axios.put(host+'/delPlace',{data:req})
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

export default DeletePlace
