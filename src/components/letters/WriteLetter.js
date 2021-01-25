import { faBackward, faBarcode, faCalendar, faCar, faDraftingCompass, faForward, faProjectDiagram, faTruck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LetterContext } from '../contexts/contexts'
import { convertToRaw,EditorState,convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToMarkdown,{} from 'draftjs-to-markdown'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { checkDate, convertToEuropean } from '../../controllers/Date';
import { Donothing } from '../../controllers/saveProcess';
 const WriteLetter=()=> {
   const {values,setValues}=useContext(LetterContext)
   const {type,editorState,step}=values
   const [state,setState]=useState({
       error:false,
       derror:false,
       description:''
   })
   const text=useRef(null)
   const date=useRef(null)
   const onEditorStateChange=editorState=>{
setValues({...values,editorState,description:JSON.stringify(convertToRaw(editorState.getCurrentContent()))})
       setState({...values,error:false,derror:false})
    }
 
 //setValues({...values,editorState:JSON.stringify(convertToRaw(editorState.getCurrentContent()))})
// const content=editorState?
//             EditorState.createWithContent(convertFromRaw(JSON.parse(editorState))):
//             EditorState.createEmpty() 

const handleSubmit=e=>{
   e.preventDefault()
   let err=!editorState?true:false
   if(err){
      setState({...values,error:true})
      try{
        text.current.focus()
      }
      catch(err){
        console.log(err)
      }
   }
   else{
     if(type==='allowance'){

      try{
  let initial=convertToEuropean(values.idate,values.imonth,values.iyear) 
  let Return=convertToEuropean(values.rdate,values.rmonth,values.ryear)  
  if(!checkDate(initial,Return)){
      setState({...state,derror:true})
      date.current.focus()
     } 
          else{
setValues({...values,step:step<=2?3:step, tab:step<=3?'approval':step===4?'parcticpant':''})
          }
        }
          catch(err){
           setState({...state,derror:true})
        date.current.focus()
          }
     }
     else{
setValues({...values,step:step<=2?3:step,tab:step<=3?'approval':step===4?'parcticpant':''})    
     }
}}
return (
    <form onSubmit={e=>handleSubmit(e)}>
        <div className="container">
        <div className="row">
         <div className="col-lg-12 text-center">
    <div className="signup-form">
    <p className="font-weight-bold text-center">Title</p>
    <div className="form-group">
			<div className="input-group input-container">
				<span className="input-group-addon">
    <h3>T</h3>
                    </span>
    <input type="text" className="input-field form-control" 
        placeholder="Title" required={true} value={values.title}
        onChange={e=>setValues({...values,title:e.target.value})}
        />
            </div>
        </div>  
    </div>
</div>
<div className="col-lg-12">
<p className="font-weight-bold text-center">Description</p>
<Editor  toolbarClassName="toolbarClassName" 
editorStyle={{marginLeft:100,width:'212mm',minHeight:450, border: "1px solid",borderColor:values.error?'red':'' }}
wrapperClassName="wrapperClassName"
  editorClassName="editorClassName"
   onEditorStateChange={onEditorStateChange}
   editorState={editorState}
   ref={text}
   />
   {
    state.error?
    <p className="text-center text-danger font-weight-bold">
      Please enter description
      </p>:
      <p></p>
   }
   
</div>
<div>
     
      </div>
         </div>
         {
        type==='allowance'?
       <div className="row">
          <div className="col-lg-6">
          <p className="font-weight-bold text-center">Objective</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faDraftingCompass} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text" value={values.objective}
 placeholder="Objective" onChange={e=>setValues({...values,objective:e.target.value})}
 required={true} value={values.objective}
    />
</div>
<p className="font-weight-bold text-center">Project name and code</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBarcode} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
  value={values.project_name}
 placeholder="Project name and code" onChange={e=>setValues({...values,project_name:e.target.value})} 
   />
</div>
<p className="font-weight-bold text-center">program name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faProjectDiagram} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
value={values.program}
 placeholder="Program name" onChange={e=>setValues({...values,program:e.target.value})} 
   />
</div>
              </div>
              <div className="col-lg-6">

<p className="font-weight-bold text-center">Initial Place</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faTruck} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Initial place" onChange={e=>setValues({...values,initial_place:e.target.value})} 
   values={values.initial_place} required={true}/>
</div>
<p className="font-weight-bold text-center">Destination Place</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCar} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Destination place" onChange={e=>setValues({...values,destination_place:e.target.value})} 
   value={values.destination_place} required={true}/>
</div>
<p className="font-weight-bold text-center">
     Initial Date
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30} value={values.idate}  onChange={e=>{
     setValues({...values,idate:parseInt(e.target.value)
})}} required={true} />
  <select  className="input-field form-control my-auto"
      onChange={e=>setValues({...values,imonth:parseInt(e.target.value)
        ,process:'',error:'',success:''})} value={values.imonth} required={true}>
        <option value="">mm</option>
      <option value={1}>መስከረም</option>
      <option value={2}>ጥቅምት</option>
      <option value={3}>ህዳር</option>
      <option value={4}>ታህሳስ</option>
      <option value={5}>ጥር</option>
      <option value={6}>የካቲት</option>
      <option value={7}>መጋቢት</option>
      <option value={8}>ሚያዝያ</option>
      <option value={9}>ግንቦት</option>
      <option value={10}>ሰኔ</option>
      <option value={11}>ሐምሌ</option>
      <option value={12}>ነሐሴ</option>
      <option value={13}>ጳጉሜ</option>
      </select> 
      <input className="input-field form-control my-auto" type="number"
 placeholder="YYYY"  min={2013} onChange={e=>{
     setValues({...values,iyear:parseInt(e.target.value)})}} required={true} 
     value={values.iyear}/>
     <p className="my-auto font-weight-bold">
         E.C
         </p>    
 </div> 
 <p className="font-weight-bold text-center">
     Return Date
     </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30} value={values.rdate}  
      onChange={e=>{
  setValues({...values,rdate:parseInt(e.target.value)})}} 
     required={true} ref={date}/>
  <select  className="input-field form-control my-auto" value={values.rmonth}
      onChange={e=>setValues({...values,rmonth:parseInt(e.target.value)
        ,process:'',error:'',success:''})} required={true}>
        <option value="">mm</option>
      <option value={1}>መስከረም</option>
      <option value={2}>ጥቅምት</option>
      <option value={3}>ህዳር</option>
      <option value={4}>ታህሳስ</option>
      <option value={5}>ጥር</option>
      <option value={6}>የካቲት</option>
      <option value={7}>መጋቢት</option>
      <option value={8}>ሚያዝያ</option>
      <option value={9}>ግንቦት</option>
      <option value={10}>ሰኔ</option>
      <option value={11}>ሐምሌ</option>
      <option value={12}>ነሐሴ</option>
      <option value={13}>ጳጉሜ</option>
      </select> 
      <input className="input-field form-control my-auto" type="number"
 placeholder="YYYY"  min={2013} onChange={e=>{
     setValues({...values,ryear:parseInt(e.target.value),process:'',
     error:'',success:''
     })}} required={true} value={values.ryear}/>
     <p className="my-auto font-weight-bold">
         E.C
         </p>
 </div> 
              </div>

           </div>:
           <p></p>      
         } 
         <div className="row">
     <div className="col-lg-12">
   {
     state.derror?
     <p className="text-center text-danger font-weight-bold">
       Invalid date entered please check initial day and return day
       </p>:
     <p></p>
   }    
       </div>      
             <div className="col-lg-6">
           <div className="btn-danger btn" onClick={()=>setValues({...values,tab:'type'})}>
          <FontAwesomeIcon icon={faBackward}  className='text-white'/>
          Back    
               </div>      
             </div>
             <div className="col-lg-6">
        <button type="submit" className="btn btn-info mt-3 float-right">
            <FontAwesomeIcon icon={faForward} className='text-white' />
            Next
            </button>        
             </div>
         </div>  
        </div>
        </form>
    )
}

export default WriteLetter
