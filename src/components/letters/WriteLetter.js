import { faBackward, faBarcode, faCar, faDraftingCompass, faForward, faProjectDiagram, faTruck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LetterContext } from '../contexts/contexts'
import { convertToRaw,EditorState,convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToMarkdown from 'draftjs-to-markdown'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
 const WriteLetter=()=> {
   const {values,setValues}=useContext(LetterContext)
   const {type,editorState,step}=values
   const [state,setState]=useState({
       error:false,

   })
   const text=useRef(null)
   const onEditorStateChange=editorState=>{
       setValues({...values,editorState})
       setState({...state,error:false})
    }
//setValues({...values,editorState:JSON.stringify(convertToRaw(editorState.getCurrentContent()))})
// const content=editorState?
//             EditorState.createWithContent(convertFromRaw(JSON.parse(editorState))):
//             EditorState.createEmpty() 

const handleSubmit=(e)=>{
   e.preventDefault()
   let err=editorState===undefined?true:false
   if(err){
      setState({...state,error:true})
      try{
        text.current.focus()
      }
      catch(err){
        console.log(err)
      }
   }
   else{
    setValues({...values,step:step<=2?3:step, tab:step<=3?'approval':step===4?'parcticpant':''})
   }
}
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
editorStyle={{minHeight:300, border: "1px solid",borderColor:state.error?'red':'' }}
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
 placeholder="Project name and code" onChange={e=>setValues({...values,project_name:e.target.value})} 
   />
</div>
<p className="font-weight-bold text-center">program name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faProjectDiagram} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
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
    required={true}/>
</div>
<p className="font-weight-bold text-center">Destination Place</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCar} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Destination place" onChange={e=>setValues({...values,destination_place:e.target.value})} 
    required={true}/>
</div>
              </div>

           </div>:
           <p></p>      
         } 
         <div className="row">
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
