import { faPencilAlt, faSun, faWindowClose, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { saveProcess } from '../../../../controllers/saveProcess'
import { decrptObject, encryptObject } from '../../../auth/encrypt'
import { host } from '../../../config/config'
import { DotLoading } from '../../../layout/Loading'
import { userInfo } from '../../../users/userInfo'

 const RemovePlaces=(props)=> {
     const {level_1,level_2,level_3}=props
     const [state,setState]=useState({
         level_1:[],
         level_2:[],
         level_3:[],
         Deletelist:[],
         ...saveProcess()
     })
     useEffect(()=>{
      setState({...state,level_1,level_2,level_3})
     },[level_1,level_2,level_3])
  const addToRemoval=(id,level)=>setState({...state,
 level_1:level==='level_1'?state.level_1.filter(p=>p._id!==id):state.level_1,
 level_2:level==='level_2'?state.level_2.filter(p=>p._id!==id):state.level_2,
 level_3:level==='level_3'?state.level_3.filter(p=>p._id!==id):state.level_3,
 Deletelist:[...state.Deletelist,id]
    })
     const handleSave=async ()=>{
     try{
        setState({...state,...saveProcess('initial','saving...')})   
     const data=encryptObject({...userInfo(),
        Places_id:state.Deletelist})
     const req=await axios.put(host+'/addPlace',{data})
     const res=decrptObject(req.data)
     if(res.error){
    setState({...state,...saveProcess('error','Saving failed please try again later')})
     }
     else if(!res.error&&res.deleted){
setState({...state,...saveProcess('success','Saved successfully')})
         
     }   
     }
     catch(err){
setState({...state,...saveProcess('error','removing failed server is not active please try again later')})     
     }
     }
const listPlaces=<tr>
   <td>
       {state.level_1.map(p=>{
        return(
            <div key={p._id} onClick={()=>addToRemoval(p._id,p.level)}>
            {p.name}
            <FontAwesomeIcon icon={faWindowClose} 
            className='btn-outline-danger mx-2' />  
            ,</div>
        )   
       })
       }
   </td>
   <td>
       {state.level_2.map(p=>{
        return(
            <div key={p._id} onClick={()=>addToRemoval(p._id,p.level)}>
            {p.name}
            <FontAwesomeIcon icon={faWindowClose} 
            className='btn-outline-danger mx-2' />  
            ,</div>
        )   
       })
       }
   </td>
   <td>
       {state.level_3.map(p=>{
        return(
            <div key={p._id} onClick={()=>addToRemoval(p._id,p.level)}>
            {p.name}
            <FontAwesomeIcon icon={faWindowClose} 
            className='btn-outline-danger mx-2' />  
            ,</div>
        )   
       })
       }
   </td>
</tr>
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                <MDBTable hover>
                    <MDBTableHead>
                        <tr>
                            <th>
    <FontAwesomeIcon icon={faSun} className='mx-2'/>                            
            level 1 Allowance places
                           </th>
             <th>
             <FontAwesomeIcon icon={faSun} className='mx-2' />              
                 Level 2 Allowance places
         </th>
         <th>
             <FontAwesomeIcon icon={faSun} className='mx-2' />              
             Level 3 Allowance places
         </th>
               
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {listPlaces}
                    </MDBTableBody>
                </MDBTable> 
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
    ...state,level_1,level_2,level_3,...saveProcess('default') })}>
         <FontAwesomeIcon icon={faWindowRestore}/>
         Reset
     </button>
 <button className="btn btn-primary" type='submit' onClick={()=>handleSave()}
  disabled={state.disable} >
     <FontAwesomeIcon icon={faPencilAlt} />
     save
     </button>
     
 </div>
         </div>
                </div>
            </div>
        </div>
              )
}

export default RemovePlaces
