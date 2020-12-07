import { faMapMarker, faSave, faSun, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useState } from 'react'
import { saveProcess } from '../../../../controllers/saveProcess'
import { decrptObject, encryptObject } from '../../../auth/encrypt'
import { host } from '../../../config/config'
import { DotLoading } from '../../../layout/Loading'
import { userInfo } from '../../../users/userInfo'

 const AddPlace=(props)=> {
     const {general_name}=props
     const [state,setState]=useState({
         name:'',
         level:'',
         ...saveProcess('default')
     })
     /**handlesubmit */
     const handleSubmit=async (e)=>{
         e.preventDefault()
      try{
      setState({...state,...saveProcess('initial','Adding place...')})
    const data=encryptObject({...userInfo(),general_name,
        name:state.name,level:state.level}) 
     const req=await axios.post(host+'/addPlace',{data})
     const res=decrptObject(req.data)
     if(res.error){
    setState({...state,...saveProcess('error','Adding Failed please try again later')})     
     }
     else if(!res.error&&res.created){
    setState({...state,...saveProcess('success','Adding success')})     
     }     
      }
      catch(err){
       console.log(err)   
        setState({...state,...saveProcess('error','Adding Failed server is not active please try again later')})     
    }   
     }
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                <form onSubmit={e=>handleSubmit(e)}>   
                <p className="font-weight-bold text-center">
      place name
   </p>
<div className="input-container">
 <FontAwesomeIcon icon={faMapMarker} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" 
placeholder="place name"  onChange={e=>setState({
    ...state,...saveProcess('default'),name:e.target.value
     })} required={true}/>
</div>
<p className="font-weight-bold text-center">
    climate Allowance level
   </p>
<div className="input-container">
 <FontAwesomeIcon icon={faSun} className='text-info fa-2x mx-2 my-auto '/>
   <select className="input-field form-control my-auto"
    onChange={e=>setState({
    ...state,...saveProcess('default'),level:e.target.value
     })} required={true} >
     <option value="">Add climate Place level</option>
     <option value="level_1">level one</option>
     <option value="level_2">level two</option>
     <option value="level_3">level three</option>
     </select>

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
    ...state,...saveProcess('default'),name:'',level:'',
     })}>
         <FontAwesomeIcon icon={faWindowRestore}/>
         Reset
     </button>
 <button className="btn btn-primary" type='submit'
  disabled={state.disable} >
     <FontAwesomeIcon icon={faSave} />
     save
     </button>
     
 </div>
         </div>
         </form> 
                </div>
            </div>
        </div>
    )
}

export default AddPlace
