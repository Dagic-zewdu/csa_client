import React, { useState, useEffect } from 'react'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import Axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faPizzaSlice, faWineBottle, faBed, faSun, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { host } from '../../config/config'
import { decryptToken } from '../../auth/tokenEncryption'

 const EditConfig=(props)=> {
    const [state,setState]=useState({
        dinner:0,
        breakfast:0,
        lunch:0,
        bed:0,
        climate_1:0,
        climate_2:0,
        climate_3:0,
        process:'',success:'',error:'',
        disable:false,loading:false
     })
     useEffect(()=>{
    setState({...state,...props.config})
     },[props.config])
  const handleSubmit=async (e)=>{
e.preventDefault()
  try{
  setState({...state,disable:true,loading:true,
      process:'saving',success:'',error:''})    
  const {dinner,bed,breakfast,lunch,climate_1,
      climate_2,climate_3,}=state
  const totall=parseFloat(dinner)+parseFloat(breakfast)+parseFloat(lunch)
    +parseFloat(bed)
  if(totall>100){
      setState({...state,disable:false,loading:false,
process:'',success:'',error:'breakfast,lunch,dinner and bed allowance should not be greater than 100%'})    

  }
  else{
    //getting token from localStorage
    let {token:Token,user_type:usertype}=localStorage
    //decrypting token
    const token=decryptToken(Token)
    /**encrypting requset for security */  
      const encrypt=encryptObject({
   _id:props.config._id,token,usertype,
dinner,bed,breakfast,lunch,climate_1,climate_2,climate_3})
              const req=await Axios.put(host+'/config',{data:encrypt})  
               const res=decrptObject(req.data)
               if(res.error){
                  setState({...state,disable:false,loading:false,
                      process:'',success:'',error:'error while editing check out the server'})    
                  
               }
               else if(res.updated&&!res.error){
                  setState({...state,disable:false,loading:false,
     process:'',success:'Editing success',error:''})    
                       
               }    
  }      
  
}
  catch(err){
      console.log(err)
      setState({...state,disable:false,loading:false,
          process:'',success:'',error:'unable to save server is not active'})    
      
  }
  }
  return (
      <form className='main-card mb-3 card' onSubmit={e=>handleSubmit(e)}>
      <div className="container">
          <div className="row">
              <div className="col-lg-12">
              <h2 className='text-center'>Allowance configaration</h2>
      <p className="lead bg-warning text-center text-white">
     Note:-editing will affect allowance calculation so enter carefully
          </p>
              </div>
  <div className="col-lg-6">
      <p className="text-center font-weight-bold">
          Breakfast allowance by %
      </p>
      <div className="form-group">
          <div className="input-group input-container">
              <span className="input-group-addon">
                  <FontAwesomeIcon icon={faCoffee}
                   className="fa fa-barcode"/>
                  </span>
  <input type="number" className="input-field form-control" 
      placeholder="Breakfast allowance by percent" required={true}
      onChange={e=>setState({...state,breakfast:e.target.value,success:'',
   error:'',process:''})}   value={state.breakfast}
      />
          </div>
      </div>
      <p className="text-center font-weight-bold">
          Lunch allowance by %
      </p>
      <div className="form-group">
          <div className="input-group">
              <span className="input-group-addon">
              <FontAwesomeIcon icon={faPizzaSlice} className="fa fa-user"/>    
                  </span>
              <input type="number" className="form-control" 
               placeholder="Lunch allowance by %"
  onChange={e=>setState({...state,lunch:e.target.value,
       success:'',error:'',process:''
  })}           value={state.lunch}
                required={true}/>
          </div>
      </div>
      <p className="text-center font-weight-bold">
          Dinner allowance by %
      </p>
      <div className="form-group">
          <div className="input-group">
              <span className="input-group-addon">
      <FontAwesomeIcon icon={faWineBottle} className="fa fa-lock" />            
                  </span>
              <input type="number" className="form-control" 
               placeholder="Dinner allowance by %" required={true}
 onChange={e=>setState({...state,dinner:e.target.value,success:'',
   error:'',process:''   
})}           required={true}   value={state.dinner}
               />
          </div>
      </div>
      <p className="text-center font-weight-bold">
          Bed allowance by %
      </p>
      <div className="form-group">
          <div className="input-group">
              <span className="input-group-addon">
      <FontAwesomeIcon icon={faBed} className="fa fa-lock" />            
                  </span>
              <input type="number" className="form-control" 
               placeholder="Bed allowance by %" required={true}
 onChange={e=>setState({...state,bed:e.target.value,success:'',
   error:'',process:''   
})}           required={true}   value={state.bed}
               />
          </div>
      </div>
      
              </div>
              <div className="col-lg-6">
             <div className="form-group">
             <p className="text-center font-weight-bold">
          Level one allowance by %
      </p>       
          <div className="input-group">
              <span className="input-group-addon">
      <FontAwesomeIcon icon={faSun} className="fa fa-lock" />            
                  </span>
              <input type="number" className="form-control" 
               placeholder="climate scale 1 allowance by %" required={true}
 onChange={e=>setState({...state,climate_1:e.target.value,success:'',
   error:'',process:''   
})}             value={state.climate_1}
               />
          </div>
      </div>
      <p className="text-center font-weight-bold">
          Level two allowance by %
      </p>  
      <div className="form-group">
          <div className="input-group">
              <span className="input-group-addon">
      <FontAwesomeIcon icon={faSun} className="fa fa-lock" />            
                  </span>
              <input type="number" className="form-control" 
               placeholder="climate scale 2 allowance by %"
 onChange={e=>setState({...state,climate_2:e.target.value,success:'',
   error:'',process:''   
})}           required={true}   value={state.climate_2}
               />
          </div>
      </div>
      <p className="text-center font-weight-bold">
          Level three allowance by %
      </p>  
      <div className="form-group">
          <div className="input-group">
              <span className="input-group-addon">
      <FontAwesomeIcon icon={faSun} className="fa fa-lock" />            
                  </span>
              <input type="number" className="form-control" 
               placeholder="climate scale 3 allowance by %" required={true}
 onChange={e=>setState({...state,climate_3:e.target.value,success:'',
   error:'',process:''   
})}        value={state.climate_3}
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
          <FontAwesomeIcon icon={faPencilAlt} />
          Edit
          </button>
      </div>
              </div>
          </div>
      </div>
      </form>

  )
}

export default EditConfig
