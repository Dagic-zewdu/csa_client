import { faMap, faMapMarker, faPlus, faPlusCircle, faSave, faWindowClose, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React,{useState} from 'react'
import { randomId, saveProcess } from '../../../../controllers/saveProcess'
import { decrptObject, encryptObject } from '../../../auth/encrypt'
import { host } from '../../../config/config'
import { DotLoading } from '../../../layout/Loading'
import { userInfo } from '../../../users/userInfo'

const CreateClimatePlace=(props)=> {
    const [state,setState]=useState({
       place_name:'',
       place:[],
       level_place:'',
       level_1_error:'',
       level_2_error:'',
       level_3_error:'',
       process:'',error:'',disable:false,loading:false,success:''
    })
   const Found=()=>{
       let place=state.place.find(p=>{
         return p.name === state.level_place  
       })
      
    return place?true:false 
   } 
   const Donothing=()=>{}
    /**accepts places name level_place type and save the place */
    const savePlace=(type)=>{
     let id=randomId()
     let place=type==='level_1'?
    [...state.place,{id,name:state.level_place,level:'level_1'}]:
      type==='level_2'?
      [...state.place,{id,name:state.level_place,level:'level_2'}]:
      type==='level_3'?
      [...state.place,{id,name:state.level_place,level:'level_3'}]:
        []
       Found()?
       type==='level_1'?setState({...state,level_1_error:'Name already in the list'}):
       type==='level_2'?setState({...state,level_2_error:'Name already in the list'}):
       type==='level_3'?setState({...state,level_3_error:'Name already in the list'}):
       Donothing(): 
    state.level_place!==''?
    setState({...state,place}):Donothing()    
               
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
      if(state.place.length===0){
  setState({...state,error:'no places added',success:'',process:''})
      }
      else{
       try{
       setState({...state,...saveProcess('initial','Saving please wait')})       
      let places=[...state.place.map(p=>{
          return {general_name:state.place_name,name:p.name,level:p.level} 
        })]
      let data=encryptObject({places,...userInfo()})
     const req=await axios.post(host+'/climatePlaces',{data})
     const res=decrptObject(req.data)
   if(res.error){
    setState({...state,...saveProcess('error',res.message)})
   }
   else if(!res.error&&res.created){
           setState({...state,...saveProcess('success',res.message)})  
           props.fetch()
     }        
      }
      catch(err){
  setState({...state,...saveProcess('error','can not save place server error please try again later')})        
    }
    }
      
    }
    /** Group by level*/
const LevelOnePlaces=state.place.filter(p=>p.level === 'level_1')
const LevelTwoPlaces=state.place.filter(p=>p.level === 'level_2')
const LevelThreePlaces=state.place.filter(p=>p.level === 'level_3')
/**Remove place */
const remove=id=>setState({...state,place:state.place.filter(p=>p.id !== id)})
   /**list places */
   const listPlaces=state.place.length?<tr>
   <td>{state.place_name}</td>
   <td>
   {
       LevelOnePlaces.length?
     LevelOnePlaces.map(p=>{
         return (
        <div key={p.id} onClick={()=>remove(p.id)}>
            {p.name}
          <FontAwesomeIcon icon={faWindowClose} className='btn-outline-danger mx-2' />  
        ,</div>     
           )
     }):
     <p className="text-center font-weight-bold">
         No places addes on level one allowance
         </p>  
   }   
   </td>
   <td>
   {
       LevelTwoPlaces.length?
     LevelTwoPlaces.map(p=>{
         return (
        <div key={p.id} onClick={()=>remove(p.id)}>
            {p.name}
            <FontAwesomeIcon icon={faWindowClose} 
            className='btn-outline-danger mx-2' />  
            ,</div>     
           )
     }):
     <p className="text-center font-weight-bold">
         No places added on level two allowance
         </p>  
   }   
   </td>
   <td>
   {
       LevelThreePlaces.length?
       LevelThreePlaces.map(p=>{
         return (
        <div key={p.id} onClick={()=>remove(p.id)}>
            {p.name}
            <FontAwesomeIcon icon={faWindowClose} 
            className='btn-outline-danger mx-2' />  
            ,</div>     
           )
     }):
     <p className="text-center font-weight-bold">
         No places added on level three allowance
         </p>  
   }   
   </td>
    </tr>
    :
    <tr>
        <td className="text-danger text-center font-weight-bold" colSpan={4}>
            No places added yet
        </td>
    </tr>


//render
    return (
        <div className="container">
        <form onSubmit={e=>handleSubmit(e)}>
       <div className="main-card mb-3 card">
           <div className="row">
               <div className="col-lg-4">
               <p className="font-weight-bold text-center">
      General place name
   </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faMapMarker} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="General place name"  onChange={e=>e.target.value===''?
 setState({
    ...state,place_name:'',place:[],level_place:'',level_1_error:'',
    level_2_error:'',level_3_error:'',process:'',error:'',success:''
     }):
     setState({
    ...state,place_name:e.target.value,process:'',error:'',success:''
        })}   required={true}
     />
</div>
{
    state.place_name!==''?
    <div className="">
    <p className="font-weight-bold text-center">
      level one Allowance places
   </p>
<div className="input-container">
 <FontAwesomeIcon icon={faMapMarker} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="place name"  onChange={e=>setState({
    ...state,level_place:e.target.value,
    level_1_error:'',level_2_error:'',level_3_error:'',
    process:'',error:'',success:''
     })}   
     />
     <div className="btn btn-outline-info my-auto" 
      onClick={()=>savePlace('level_1')}>
         <FontAwesomeIcon icon={faPlusCircle} />
         Add
     </div>
</div>
  <p className="text-danger text-center font-weight-bold">
      {state.level_1_error}
  </p>
<p className="font-weight-bold text-center">
      level two Allowance places
   </p>
<div className="input-container">
 <FontAwesomeIcon icon={faMapMarker} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="place name"  onChange={e=>setState({
    ...state,level_place:e.target.value,
    level_2_error:'',level_1_error:'',level_3_error:'',
     process:'',error:'',success:''
     })}   
     />
     <div className="btn btn-outline-info my-auto"
     onClick={()=>savePlace('level_2')}>
         <FontAwesomeIcon icon={faPlusCircle} />
         Add
     </div>
</div>
<p className="text-danger text-center font-weight-bold">
      {state.level_2_error}
  </p>
<p className="font-weight-bold text-center text-center">
      level three Allowance places
   </p>
<div className="input-container">
 <FontAwesomeIcon icon={faMapMarker} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="place name"  onChange={e=>setState({
    ...state,level_place:e.target.value,
    level_3_error:'',level_1_error:'',level_2_error:'',
    process:'',error:'',success:''
     })}   
     />
     <div className="btn btn-outline-info my-auto"
     onClick={()=>savePlace('level_3')}>
         <FontAwesomeIcon icon={faPlusCircle} />
         Add
     </div>
</div>
<p className="text-danger text-center font-weight-bold">
      {state.level_3_error}
  </p>
    </div>:
    <p></p>
}
               </div>
               <div className="col-lg-8">
               <MDBTable hover bordered>
                    <MDBTableHead>
                        <tr>
                        <th>
                  General Place name
              </th>
                            <th>
                level 1 places
                           </th>
             <th>
                 Level 2 places
         </th>
         <th>
             Level 3 places
         </th>         
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {listPlaces}
                    </MDBTableBody>
                </MDBTable>         
               </div>
              <div className="col-lg-4"></div>
            <div className="col-lg-8">
        {
            state.place_name!==''?
                
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
    ...state,place_name:'',place:[],level_place:'',level_1_error:'',
    level_2_error:'',level_3_error:'',process:'',error:'',success:''
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
         </div>:
         <p></p>
        }
                </div>   
               </div>
               </div>
               </form>
        </div>
    )
}

export default CreateClimatePlace
