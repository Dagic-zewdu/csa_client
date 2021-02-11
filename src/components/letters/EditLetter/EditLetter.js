import { faEdit, faLayerGroup, faUserCheck,  faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext,useEffect,useState } from 'react'
import { withRouter } from 'react-router'
import { LetterContext, StoreContext } from '../../contexts/contexts'
import {LettersClass} from '../../../controllers/Letters'
import {Progress} from 'reactstrap'
import { toEthiopianDate } from '../../../controllers/Date'
import Approval from '../Approval'
import LetterTypes from '../LetterTypes'
import WriteLetter from '../WriteLetter'
import AddParticipants from '../AddParticipants'
import { Donothing } from '../../../controllers/saveProcess'


const EditLetter=({match,l_id:id})=> {
    const emp_id=match.params.id
   
    const {letters,users,employees}=useContext(StoreContext)
    const Letter=new LettersClass(letters.state,users.state,employees.state)
   const letter=Letter.find_letter(id)
   const [values,setValues]=useState({
        step:1,
        type:'',
        tab:'type',
        employees:[],
        approval_manager:[],
        f_director:[],
        participants:[],
        usage:'edit' 
    })

    useEffect(()=>{

let apm=Letter.approval_managers(id).filter(e=> Letter.UserRole(e.emp_id) !== 'f_director')
let fdirector=Letter.approval_managers(id).filter(e=> Letter.UserRole(e.emp_id) === 'f_director')
setValues(s=>({...s,
        approval_manager:apm.map(m=>{ return { emp_id:m.emp_id,step:m.step}}),
        f_director:fdirector.map(fd=>{ return {emp_id:fd.emp_id,step:fd.step}}),
        participants:Letter.participants(id).map(p=>{return p?{emp_id:p.emp_id}:Donothing()}),
        type:letter.type,
        editorState:Letter.editorState(id),
        description:JSON.stringify(Letter.description(id)),
        title:letter.title,
        /**for allowance letter type */
        objective:letter.objective,
        project_name:letter.project_name,
        program:letter.program,
        initial_place:letter.initial_place,
        destination_place:letter.destination_place,
        idate:letter.type==='allowance'?toEthiopianDate(letter.initial_date).date:'',
        imonth:letter.type==='allowance'?toEthiopianDate(letter.initial_date).month:'',
        iyear:letter.type==='allowance'?toEthiopianDate(letter.initial_date).year:'',
        rdate:letter.type==='allowance'?toEthiopianDate(letter.return_date).date:'',
        rmonth:letter.type==='allowance'?toEthiopianDate(letter.return_date).month:'',
        ryear:letter.type==='allowance'?toEthiopianDate(letter.return_date).year:'',
      }))
    },[])


    const setTab=tab=>{
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
            <LetterContext.Provider value={{setValues,values,id,letter}}>
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

export default withRouter(EditLetter)
