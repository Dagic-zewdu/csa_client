import { faCheck, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React,{useContext, useState} from 'react'
import { saveProcess } from '../../controllers/saveProcess'
import { decrptObject, encryptObject } from '../auth/encrypt'
import { host } from '../config/config'
import { StoreContext } from '../contexts/contexts'
import { DotLoading } from '../layout/Loading'
import { userInfo } from '../users/userInfo'

const DeleteLetter=({_id,close})=> {
    const [state,setState]=useState({
        deleted:false,
        ...saveProcess('default')
    })
    const {socket}=useContext(StoreContext)
 const Delete=async ()=>{
  try{
setState({...state,...saveProcess('initial','Deleting...')})
    const req=await axios.put(host+'/letters',
    {data:encryptObject({_id,...userInfo()})}) 
  const res=decrptObject(req.data)
  if(res.deleted){
   const del=await axios.put(host+'/delMessages',
   {data:encryptObject({_id,...userInfo()})})
   const rdel=decrptObject(del.data)
if(rdel.deleted){
    setState(s=>({...s,
        ...saveProcess('success','Deleted successfully'),
        deleted:true
    }))
    
}
else{
    setState(s=>({...s,...saveProcess('error','unable to delete messages of the letter please contact admin')}))
}
      
   
  }
  else{
    setState(s=>({...s,...saveProcess('error','unable to delete letter please try again letter')}))   
  } 
  }
  catch(err){
    setState(s=>({...s,...saveProcess('error','unable to letter internal server error')}))
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
           //if deleted populate with new data else close with out populating
           state.deleted?
        <button className="btn btn-info float-right mx-2"
         disabled={state.disable}>
        <FontAwesomeIcon icon={faWindowClose} className='mx-2 fx-2'/>
        Close
        </button>:
        <button className="btn btn-info float-right"
         onClick={()=>close()} disabled={state.disable}>
        <FontAwesomeIcon icon={faWindowClose} className='mx-2 fx-2'/>
        Cancel
        </button>
       }     
        
       {
           !state.deleted?
        <button className="btn btn-primary float-right mx-2" onClick={()=>Delete()}
             disabled={state.disable}>
        <FontAwesomeIcon icon={faCheck} className='mx-2 fx-2'/>
        Yes
        </button>:
        <p></p> 
       } 
        
        </div>
        </div>
    )
}

export default DeleteLetter
