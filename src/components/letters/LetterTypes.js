import {  faEnvelopeOpen, faForward } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext} from 'react'
import { withRouter } from 'react-router'
import { LetterContext } from '../contexts/contexts'

const LetterTypes=()=> {
    const {values,setValues}=useContext(LetterContext)
    const {type,step}=values
    return (
       <div className="container my-4">
            <div className="row card">
   <div className="col-lg-12 mb-2">
       <h2 className="text-center">
           Please select letter type
       </h2>
       <hr/>
   </div>
 <div className="col-lg-12 text-center my-2"
  onClick={()=>setValues({...values,type:'allowance'})}>
   {
       type==='allowance'?
       <button className="btn btn-info">
           <h3>
 <FontAwesomeIcon icon={faEnvelopeOpen} className='mx-2' /> 
           Allowance letter
           </h3>
       </button>:
       <button className="btn">
           <h3>
 <FontAwesomeIcon icon={faEnvelopeOpen} className='mx-2' /> 
           Allowance letter
           </h3>
       </button>
   }
        
                </div>
  <div className="col-lg-12 text-center my-2" onClick={()=>setValues({...values,type:'normal'})}>
  {
       type==='normal'?
       <button className="btn btn-info">
           <h3>
 <FontAwesomeIcon icon={faEnvelopeOpen} className='mx-2' /> 
           Normal letter
           </h3>
       </button>:
       <button className="btn">
           <h3>
 <FontAwesomeIcon icon={faEnvelopeOpen} className='mx-2' /> 
           Normal letter
           </h3>
       </button>
   }    
                </div>
            </div>
         <div className="row mt-3">
             <div className="col-lg-4">

             </div>
             <div className="col-lg-4"></div>
             <div className="col-lg-4">
     {
         type?
         <button className="btn btn-info float-right text-white"
     onClick={()=>setValues({...values,
     step: values.type==='allowance'?2:step<=2?2:values.step,
     tab: values.type ==='allowance'?'create':step<=2?'create':step===3?'approval':step===4?'parcticpant':''
     })}    
         >
             <FontAwesomeIcon icon={faForward} className='mx-2' />
             Next        
                 </button>:
              <p></p>   
     }
             </div>
         </div>   
        </div>
    )
}

export default withRouter( LetterTypes)
