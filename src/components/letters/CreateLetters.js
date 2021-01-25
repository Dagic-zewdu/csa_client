import { faEdit, faLayerGroup, faUserCheck, faUserEdit, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { LetterContext } from '../contexts/contexts'
import {Progress} from 'reactstrap'
import LetterTypes from './LetterTypes'
import WriteLetter from './WriteLetter'
import Approval from './Approval'
import AddParticipants from './AddParticipants'
const CreateLetters=({match,setSize})=> {
    const emp_id=match.params.id
    const [values,setValues]=useState({
        step:1,
        type:'',
        tab:'type',
        employees:[],
        approval_manager:[],
        f_director:[],
        participants:[],
        usage:'create' 
    })
    useEffect(()=>{
   setSize('xl')
    },[])
    /**return's a string of 4 types 
     * @param {*} tab clicked tab 
     */
    const setTab=(tab)=>{
    if(tab==='type'){
   return 'type'
    }
    else if(tab==='create'){
return values.step>=2?'create':'type' 
    }
    else if(tab==='approval'){
 return values.step>=3?'approval':values.step===1?'type':values.step===2?'create':'' 
    }
    else if(tab==='participant'){
 return values.step>=4?'participant':values.step===1?'type':values.step===2?'create':values.step==3?'approval':''     
    }
    else {return ''}
    }
    return (
    <LetterContext.Provider value={{setValues,values,setSize,emp_id}}>
    <div className='container'>
        <div className="row">
            <div className="col-lg-3" onClick={()=>setValues({...values,tab:setTab('type')})}>
            <h4 className="text-center">
      <FontAwesomeIcon icon={faLayerGroup} className='text-info' />   
       select type
         </h4>  
            </div>
            <div className="col-lg-3" 
    onClick={()=>setValues({...values,tab:setTab('create')})}>
            <h4 className="text-center">
      <FontAwesomeIcon icon={faEdit} className={values.step>=2?'text-info mx-2':''} />   
       Write aletter
         </h4>  
            </div>
            <div className="col-lg-3" 
            onClick={()=>setValues({...values,tab:setTab('approval')})}>
            <h4 className="text-center">
      <FontAwesomeIcon icon={faUserCheck} className={values.step>=3?'text-info mx-2':''} />   
       Select approval stages
         </h4>  
            </div>
            <div className="col-lg-3" 
            onClick={()=>setValues({...values,tab:setTab('participant')})}>
            <h4 className="text-center">
      <FontAwesomeIcon icon={faUsers} className={values.step>=4?'text-info mx-2':''} />   
        Add participants
         </h4>  
            </div>  
        </div>
   <div className="col-lg-12 my-3">
     <h4 className="text-center">
     <Progress animated  multi>
        <Progress animated  bar value={25}>select type</Progress>
        <Progress animated  bar color="warning" value={values.step>=2?25:0}>Write aletter</Progress>
        <Progress animated  bar color="info" value={values.step>=3?25:0}>Select approval stages</Progress>
        <Progress animated  bar color="success" value={values.step>=4?25:0}>Add participants</Progress>
      </Progress>   
         </h4>  
   </div>
   {
   values.tab==='type'?<LetterTypes/>:
   values.tab==='create'?<WriteLetter/>:
   values.tab==='approval'?<Approval/>:
   values.tab==='participant'?<AddParticipants/>:
   <p></p>
   }
    </div>
    </LetterContext.Provider> 
    )
}

export default withRouter(CreateLetters)
