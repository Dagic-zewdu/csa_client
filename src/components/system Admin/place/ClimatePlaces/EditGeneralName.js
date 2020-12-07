import { faMapMarker, faPencilAlt, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { saveProcess } from '../../../../controllers/saveProcess'
import { decrptObject, encryptObject } from '../../../auth/encrypt'
import { host } from '../../../config/config'
import { DotLoading } from '../../../layout/Loading'
import { userInfo } from '../../../users/userInfo'

  const EditGeneralName=(props)=> {
      const {general_name:gname}=props
      const [state,setState]=useState({
           general_name:'',
           ...saveProcess('default') 
      })
      useEffect(()=>{
setState({...state,general_name:gname})
      },[gname])
      const handleSubmit=async (e)=>{
         e.preventDefault()
       try{
setState({...state,...saveProcess('initial','Updating...')})
   const data=encryptObject({...userInfo(),
    gname,general_name:state.general_name})
  const req=await axios.put(host+'/climatePlaces',{data})  
  const res=decrptObject(req.data)
  if(res.error){
      setState({...state,...saveProcess('error','Error while updating please try again later')})
  }
  else if(!res.error&&res.updated){
    setState({...state,...saveProcess('success','updating success')})  
  }      
  }
       catch(err){
setState({...state,...saveProcess('error','Adding Failed server is not active please try again later')})     
    }  
      }
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                 <form onSubmit={e=>handleSubmit(e)}>
                 <p className="font-weight-bold text-center">
      General place name
   </p>
<div className="input-container">
 <FontAwesomeIcon icon={faMapMarker} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" 
placeholder="place name"  onChange={e=>setState({
    ...state,...saveProcess('default'),general_name:e.target.value
     })} required={true} value={state.general_name}/>
</div> 
   
<div className="text-center">
                   <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
 {
     state.loading?<DotLoading/>:<p></p>
 }
 <div className="input-container">
 <button className="btn btn-info mx-3" type='reset'
      disabled={state.disable}
      onClick={()=>setState({
    ...state,general_name:'',...saveProcess('default') })}>
         <FontAwesomeIcon icon={faWindowRestore}/>
         Reset
     </button>
 <button className="btn btn-primary" type='submit'
  disabled={state.disable} >
     <FontAwesomeIcon icon={faPencilAlt} />
     Update
     </button>
     
 </div>
         </div>         
                     </form>   
                </div>
            </div>
        </div>
    )
}

export default EditGeneralName
