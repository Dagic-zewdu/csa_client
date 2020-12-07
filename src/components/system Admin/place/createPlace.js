import React from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity, faUserAlt, faFlag, faMoneyBill, faWindowRestore, faSave } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import axios from 'axios'
import { host } from '../../config/config'
import { decryptToken } from '../../auth/tokenEncryption'

  const CreatePlace=()=> {
    const [state,setState]=useState({
      name:'',
      region:'',
      type:'',
      superintendent_allowance:'',
      higher_officer_allowance:'',
      spr_members_1:'',
      spr_members_2:'',
      other_allowances:'',
      normal_scale_1:'',
      normal_scale_2:'',
      normal_scale_3:'',
      climate_allowances:'',
         process:'',
         success:'',
         error:'',
         disable:false,
         addname:'',
         loading:false,
         official:false,
         normal:true
    })
    const handleSubmit= async (e)=>{
      e.preventDefault()
      /**if alloawance in any kind is not set show error */
      if(!state.official&&!state.normal){
       setState({...state,error:'Allowance in any kind is not set',
        process:'',success:''
      })   
      }
      //if region is not set error 
      else if(state.region===''){
        setState({...state,error:'Enter region',
        process:'',success:''})
      }
      //if type is not set show error
      else if(state.type===''){
        setState({...state,error:'Enter place type ',
        process:'',success:''})
      }
       else{
         /**disabling the button when regestering */
        setState({...state,disable:true,process:'registering...',loading:true,
      error:'',success:''
      })
          //getting token from localStorage
          let {token:Token,user_type:usertype}=localStorage
          //decrypting token
          const token=decryptToken(Token)
    const  {
      name,region,type,superintendent_allowance,higher_officer_allowance,spr_members_1,
      spr_members_2,other_allowances,normal_scale_1,normal_scale_2,
      normal_scale_3,climate_allowances}=state
      /**encrypting request for security purposes */
      const encrpt=encryptObject({
  name,region,type,superintendent_allowance,higher_officer_allowance,spr_members_1,
  spr_members_2,other_allowances,normal_scale_1,normal_scale_2,
  normal_scale_3,climate_allowances,token,usertype
      })
      /**sending to server */
   try{
      const req=await axios.post(host+'/places',{data:encrpt})
//decrypting response
      const res=decrptObject(req.data)
//if error occured show error message  
if(res.error){
    setState({...state,error:'Error while ssaving try again later',disable:false,
  loading:false,success:''})
  }
  else if(res.created&&!res.error){
    
  setState({...state,
    success:'save successful',disable:false,
    loading:false,error:''
  })
  }
} 
//if the server is down or not active show error message
catch(err){
  console.log(err)
  setState({...state,error:'saving failed server is not active try again later or contact system admin to activate the server',
  disable:false,loading:false,success:''
  })
}
       } 
    }
    return (
        <div className="col-lg-12">
       <form onSubmit={e=>handleSubmit(e)}>
       <div className="main-card mb-3 card">
           <div className="row">
               <div className="col-lg-12">
                   <h5 className="text-center font-weight-bold">
                       Register new Place
                       </h5>
               </div>
               <div className="col-lg-6">
    <div className="card-body">
        {/**name input   */}
        <p className="font-weight-bold text-center">name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCity} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto mx-2">place has name?</p>
    <input className="my-auto" type="checkbox"
onClick={e=>setState(s=>({
  ...state,addname:!s.addname,name:'',
position:'',process:'',error:'',success:''}))} 
checked={state.addname} />
{ 
   state.addname?
  <input className="input-field form-control my-auto" type="text"
 placeholder="name" required={true} onChange={e=>{
     setState({...state,name:e.target.value,process:'',error:'',success:''})}}
     value={state.name} />:
     <p></p>
}


 </div>
 <p className="font-weight-bold text-center">Region</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faFlag} 
    className='text-info fa-2x mx-2 my-auto '/>
    <select className="input-field form-control my-auto" 
onChange={
  e=>setState({
    ...state,region:e.target.value,
  process:'',error:'',success:''})}>
    <option value="">Enter region</option>
    <option value="Amhara">Amhara</option>
    <option value="Oromia">Oromia</option>
    <option value="Tigrai">Tigrai</option>
    <option value="Somalia">Somalia</option>
    <option value="Benshangul">Benshangul</option>
    <option value="Afar">Afar</option>
    <option value="Gambela">Gambela</option>
    <option value="SPNR">south nation people</option>
    <option value="Sidama">Sidama</option>
    <option value="Harari">Harari</option>
    <option value="DireDewa">DireDewa</option>
    <option value="addis_ababa">Addis Ababa</option>
  </select>
</div>
<p className="font-weight-bold text-center">
   place type
   </p>
   <div className="input-container">
 <FontAwesomeIcon icon={faCity} 
    className='text-info fa-2x mx-2 my-auto '/>
    <select className="input-field form-control my-auto" 
onChange={
    e=>setState({
    ...state,type:e.target.value,
    process:'',error:'',success:''})}>
    <option value="">Enter place type</option>
    <option value="state_city">State city</option>
    <option value="zone">Zone</option>
    <option value="woreda">woreda</option>
    <option value="rural_kebele">Rural kebele</option>
  </select>
</div>

 <p className="font-weight-bold text-center">
                   Enter official or normal scale allowance
                 </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCity} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto mx-2">official allowance</p>
    
    <input className="my-auto" type="checkbox"
onClick={e=>setState(s=>({
    ...state,official:!s.official,normal:false,addname:true,
    position:'',process:'',error:'',success:'',normal_scale_1:'',
    normal_scale_2:'',normal_scale_3:''
  }))} 
checked={state.official}  />
<p className="my-auto mx-2">Normal allowance</p>
<input className="my-auto" type="checkbox"
onClick={e=>setState(s=>({
    ...state,normal:!s.normal,official:false,spr_members_1:'',
    spr_members_2:'',other_allowances:'',superintendent_allowance:'',
    position:'',process:'',error:'',success:''
  }))} 
checked={state.normal}  />
</div>
 </div>
               </div>
               <div className="col-lg-6">
                 {/**superintendent */}
         
            {
              state.official?(
<div>
<p className="font-weight-bold text-center">
   superintendent ( በላይ ሀላፊ ) allowance
   </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
 placeholder="superintendent ( በላይ ሀላፊ ) allowance" min='0'
  onChange={e=>setState({
    ...state,superintendent_allowance:e.target.value,
     process:'',error:'',success:''
     })}   required={true}
     />

 </div>
 <p className="font-weight-bold text-center">
   Higher allowance ( ከፍተኛ ሀላፊ )
   </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="Higher allowance ( ከፍተኛ ሀላፊ )" onChange={e=>setState({
   ...state,
   higher_officer_allowance:e.target.value
 ,process:'',error:'',success:'' 
 })}   required={true}
     />

 </div>
 {/**Entering spr_member_allowances allownces */}
 <p className="font-weight-bold text-center">
   State people representives allowances( (ክልል ም/ቤት አባል 1))
   </p>
   <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="spr one (ክልል ም/ቤት አባል 1)" onChange={e=>setState({
   ...state,
   spr_members_1:e.target.value
 ,process:'',error:'',success:'' 
 })}   required={true}
     />

 </div>
 {/**Entering spr_member_allowances_2 allownces */}
 <p className="font-weight-bold text-center">
   State people representives allowances( (ክልል ም/ቤት አባል 2))
   </p>
   <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="SPR (ክልል ም/ቤት አባል 2)" onChange={e=>setState({
   ...state,spr_members_2:e.target.value,process:'',
   error:'',success:'' 
 })}   required={true}
     />

 </div>
 <p className="font-weight-bold text-center">
   other allowances
   </p>
   <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="other allowances" 
 onChange={e=>setState({
   ...state,other_allowances:e.target.value,process:'',
   error:'',success:'' 
 })
 }   required={true}
     />

 </div>
</div>
              ):(
                <p></p>
              )
            }     
       {
         state.normal?(
   <div>
   <p className="font-weight-bold text-center">
   Normal scale one allowances
   </p>
   <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="Noraml scale one" onChange={e=>setState({
   ...state,
 normal_scale_1:e.target.value,process:'',error:'',success:'' 
 })}   required={true}
     />

 </div>
 <p className="font-weight-bold text-center">
   Normal scale two allowances
   </p>
   <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="Noraml scale two" onChange={e=>setState({
   ...state,
 normal_scale_2:e.target.value,process:'',error:'',success:'' 
 })}   required={true}
     />

 </div>
 <p className="font-weight-bold text-center">
   Normal scale three allowances
   </p>
   <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number" min='0'
 placeholder="Noraml scale three" onChange={e=>setState({
   ...state,
 normal_scale_3:e.target.value,process:'',error:'',success:'' 
 })}   required={true}
     />

 </div>
   </div>
         ):(
     <p></p>
         )
       }
       
 
            {/**Buttons and info while saving */}
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
          ...state,region:'',type:'',official:false,normal:false,
          success:'',error:'',process:''
          })}>
         <FontAwesomeIcon icon={faWindowRestore}/>
         Reset
     </button>
 <button className="btn btn-primary" type='submit'
  disabled={state.disable} >
     <FontAwesomeIcon icon={faSave} />
     Register
     </button>
     
 </div>
 
                   </div>
               </div>
           </div>
    </div>
           </form>
           </div>

    )
}

export default CreatePlace
