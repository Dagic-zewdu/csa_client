import React, { useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faHeading, faCalendar, faPaperclip,  faPencilRuler, faSpinner, faWindowClose, faCheck, faCheckDouble, faTrashAlt, faUser, faLayerGroup, faUsers, faStamp, faPlus, faPlusCircle, faLevelUpAlt, faSuitcase, faForward, faTrash, faFile, faSdCard, faSave, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { StoreContext } from '../contexts/contexts'
import { EmployeeClass } from '../../controllers/Employees'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { searchEmployee } from '../../controllers/search'
import { DotLoading } from '../layout/Loading'
import { removeDuplicates } from '../../controllers/removeRedudant'
import { Progress } from 'reactstrap'
import axios from 'axios'
import { host } from '../config/config'
import { decryptToken } from '../auth/tokenEncryption'
import { encryptObject, decrptObject } from '../auth/encrypt'
import { UsersClass } from '../../controllers/Users'

const CreateLetters=(props)=> {
     const [state,setState]=useState({
       number:'',letter_date:Date.now(),to:'', //initial
       title:'',body:'',project_name:'',project_code:'',
       initial_place:'',destination_place:'',
       /**participants are employee that are participated
        * for the allowance
        * initial_phase-if the user peek conseucative letter movment
        * it save the inital department name role and user id to be sent
        */
       conseucative:true,participantsFound:[],participants:[],
       initial_phase:[],seachloading:false,searchfound:false,
       searcherror:false, departmentAvailable:[],position:'',
       department:'',files:[],filesUpload:[],
       //process
       loading:false,process:'',success:'',error:'',disable:false,
       saveOptions:'draft',draft:true,participant:false,forward:false,
        all:false 
     })
 const [loaded,setLoaded]=useState(0)
 const [fileDate,setFileDate]=useState('')

     //getting employee datas by destrucring
     const {employees,department,users}=useContext(StoreContext)
     const {state:Users}=users
     const {state:Employees}=employees
     const {state:Department,loading:depLoading,error:depError}=department
     //setting employee for controling
     const employee=new EmployeeClass(Employees)
     const user=new UsersClass(Users,Employees)
         const Donothing=()=>{}
     /**listing participants */
    const listParticipants=state.participants.length?
   state.participants.map(p=>{
       return(
        <tr key={p.emp_id}>
     <td>{employee.Emp_id(p.emp_id)  /**name found from employee class */}</td>
    <td>{employee.Name(p.emp_id)}</td>
    <td>{employee.Department(p.emp_id)}</td>
    <td onClick={()=>RemoveParty(p.emp_id)}
     className='btn btn-outline-danger'>
        <FontAwesomeIcon icon={faTrash}/></td>
        </tr>   
       )
   }):
   <tr>
<td className="text-danger font-weight-bold" colSpan={4}>
    No participants added
</td>
     </tr>
     
     //search participant
     const handleSearch=(index)=>{
        const result=index===''?[]:searchEmployee(Employees,index)
        setState({...state,participantsFound:result})
     }
     
     //show participants that are found searched
     const showParty=state.participantsFound.length?
     state.participantsFound.map(p=>{
        return(
         <tr key={p.emp_id}>
      <td>{p.emp_id}</td>
     <td>{p.first_name+' '+p.middle_name+' '+p.last_name}</td>
     <td>{p.department}</td>
     <td onClick={()=>AddToParty(p.emp_id)} className='btn btn-outline-info'>
         <FontAwesomeIcon icon={faPlusCircle} className='text-warning'/>
         Add
         </td>
         </tr>   
        )
    }): 
    <tr>
<td className="text-danger font-weight-bold" colSpan={4}>
    Search participant to add
</td>
     </tr>
  
  //prevent duplicate participants
  const prevent=(id)=>{
    let participants=state.participants.filter(p=>{
        return p.emp_id===id
    })
    return (participants.length?true:false)  
  }

    //add to participant  party
    const AddToParty=(id)=>{
       let found=prevent(id)
       found?Donothing():
       setState(s=>({...state,draft:false,
      participants:[...s.participants,{emp_id:id}],
       saveOptions:s.initial_phase.length?'DoAll':'participant',
        forward:false,participant:s.initial_phase.length?false:true,
        all:s.initial_phase.length?true:false 
}))
    }
     //remove participant
    const RemoveParty=(id)=>{
     let participants=state.participants.filter(p=>{
         return p.emp_id !== id 
     })
     setState(s=>({...state,participants,
     participant:state.initial_phase.length?false:participants.length?
      true:false,
     forward:participants.length?false:state.initial_phase.length?true:false,
     all:(participants.length&&state.initial_phase)?true:false,
     saveOptions:state.initial_phase.length?participants.length?
     'DoAll':'forward':participants.length?'participant':'draft'         
    }))   
    }
  
    
//Manager role availiable
   const roleAvailable=(dep)=>{
       let department=Employees.filter(d=>{
 return d.department === dep && (d.type === 'director'||d.type ==='sector_leader' ||d.type === 'senior_officer') 
       })
       const departmentAvailable=removeDuplicates(department,'type')
      setState({...state,departmentAvailable,department:dep})
   }
 // prevent double approval
 const preventDoubleApproval=(id)=>{
    let participants=state.initial_phase.filter(p=>{
        return p.emp_id===id
    })
    return (participants.length?true:false)  
  }
   //add to Managers approval party
   const approvalParty=(type)=>{
    //managers that qualify    
    let qualify=Employees.filter(e=>{
return e.department===state.department&&e.type===type&&!preventDoubleApproval(e.emp_id)          
       })
    
    qualify.map(i=>{
      setState(s=>({...state,
          initial_phase:[...s.initial_phase,{emp_id:i.emp_id,
          level:s.initial_phase.length+1
        }],draft:false,participant:false,
        //set forward true if it only have approval  managers
        forward:s.participants.length?false:true,
        //set all true if it  have both approval managers and participants 
        all:s.participants.length?true:false,
        //save Options is essential for later movment
        saveOptions:s.participants.length?
        'DoAll':'forward' 
      })) 
    })
   }
  //set approval level of each manager
   const setLevel=(level,id)=>{
       //first remove the manager
    let remove=state.initial_phase.filter(m=>{
        return m.emp_id !== id
    })
    //setting new level
    let newManger={emp_id:id,level}
    //setting new initial_phase
    let initial_phase=[...remove,newManger]
    //updating state
    setState({...state,initial_phase})   
   }
    //removing manager from approval
    const removeManager=(id)=>{
        let initial_phase=state.initial_phase.filter(m=>{
            return m.emp_id !== id
        })
        setState({...state,initial_phase,
    participant:initial_phase.length?false:state.participants.length?
    true:false,
    forward:state.participants.length?false:initial_phase.length?true:false,
    all:(state.participants.length&&initial_phase)?true:false,
    saveOptions:initial_phase.length?state.participants.length?
    'DoAll':'forward':state.participants.length?'participant':'draft'
        })
    }


  //list approval manager
    const listApproval=state.initial_phase.length?
    state.initial_phase.map(p=>{
        return(
         <tr key={p.emp_id}>
      <td>{employee.Emp_id(p.emp_id)  /**name found from employee class */}</td>
     <td>{employee.Name(p.emp_id)}</td>
     <td>{employee.Department(p.emp_id)}</td>
     <td>{employee.UserRole(p.emp_id)}</td>
     {
         state.conseucative?
         <td>{p.level}</td>:
         <p></p>
     }
    {
        state.conseucative?
        <td>
     <div className="input-container">
 <FontAwesomeIcon icon={faLevelUpAlt} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
  min='1' 
 placeholder="set level"
  onChange={e=>parseInt(e.target.value)>state.initial_phase.length
  ||parseInt(e.target.value)<1
   ||e.target.value===''?
   Donothing():setLevel(parseInt(e.target.value),p.emp_id)
}
   />
     
 </div>
         </td>:
         <p></p>
    }
  
<td onClick={()=>removeManager(p.emp_id)} className='btn btn-outline-danger'>
     <FontAwesomeIcon icon={faTrash} className='mx-2'/>
     Remove       
         </td>    
         </tr>   
        )
    }):
    <tr>
 <td className="text-danger font-weight-bold" colSpan={4}>
     No Approval managers added
 </td>
      </tr>

 //attach files
   const addFiles=(Files)=>{
   //setting a unique identifier for iteration
   Files.map(f=>{
       setState((s,id=(Math.round(Math.random(0,1000000)*1000000)))=>
       ({...state,files:[...s.files,{id,name:f.name,
       }],filesUpload:[...s.filesUpload,{id,file:f}]
    }))
   })
}
   //remove files
   const removeFile=(id)=>{
       let files=state.files.filter(f=>{
        return f.id !== id
       })
       let filesUpload=state.filesUpload.filter(f=>{
           return f.id !== id
       })
    setState({...state,files,filesUpload})   
   }
   //show Files
   const showFiles=state.filesUpload.length? 
    state.filesUpload.map(f=>{
        return(
            <tr key={f.id}>
            <td>{f.file.name}</td>
            <td>{f.file.type}</td>
            <td>{f.file.size}</td>
            <td className='btn btn-outline-danger'
             onClick={()=>removeFile(f.id)} >
                <FontAwesomeIcon icon={faTrash} />
                </td>    
            </tr>
        )
    })
   :
   <tr>
       <td className="text-center" colSpan={3}>
           No files attached.... +Add files to attach
       </td>
   </tr>
   //handle submit
   const handleSubmit=async (e)=>{
        e.preventDefault()
        try{
      //first file upload if files are availaible
      const {filesUpload:Files}=state
if(Files.length>0){
    setState({...state,process:'uploading your files...',error:'',success:'',
  disable:true})
        var data=new FormData()
        Files.map(f=>{
           data.append('file',f.file) 
         })
         //uploading
         const upload= await axios.post(host+'/uploadLetterFiles',data,
     {
      onUploadProgress: ProgressEvent=>
      setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
      })   
      if(upload.data.error){
 setState({...state,process:'',error:'can not upload files try again later',success:'',
    disable:false
      })
    } 
    else if(!upload.data.error&&upload.data.upload){
        //setting uploading date as file indentifier
        setFileDate(upload.data.date)
setState({...state,process:'',error:'',success:'uploading file success',
disable:false,})
  saveLetter()
    }
}
    else{
saveLetter()
       }
        }
        catch(err){
setState({...state,process:'',error:'can not upload server is not active',
success:'',disable:false
    })
        }
   }
     const saveLetter=async ()=>{
        setState({...state,process:'saving your letters please wait...',error:'',
        disable:true,loading:true})
     const {letter_date,project_code,project_name,number,
        title,body,conseucative,participants,initial_phase
        ,saveOptions
       }=state
     //getting files name with unique upload date
       const files=[...state.files.map(f=>{
         return {name:fileDate+f.name}
     })]
     
     //getting token and decrypting
     const {token:Token,user_type:usertype,id}=localStorage
     const token=decryptToken(Token)
     //creater of the letter
     const creater=user.getEmp_id(id)
     //encrypting to request
  const encrypt=encryptObject({letter_date,project_code,project_name,number,
    title,body,conseucative,participants,initial_phase,token,usertype,files
    ,saveOptions,creater})
   //sending request 
    const req=await axios.post(host+'/letters',{data:encrypt})
    //decrypting response
    const res=decrptObject(req.data)
  if(res.error){
    setState({...state,process:'',error:res.message,
    disable:false,loading:false,success:''
     }) 
  }
  else if(!res.error&&res.created){
      setState({
          ...state,process:'',error:'',success:res.message,disable:false,
          loading:false
      })
  }
     }
     console.log(state.saveOptions)
   //render
    return (
        <form onSubmit={e=>handleSubmit(e)}>
      <div className="container mt-3 main-card min-height mb-3 card">
     <div className="row">
         <div className="col-lg-4 mt-3">
    {/**project attached if any */}
 <p className="font-weight-bold text-center">Project name</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faPaperclip} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="project name if any" onChange={e=>{
     setState({...state,project_name:e.target.value,process:'',
     error:'',success:''})}}
    />
 </div>
  {/**project attached if any */}
  <p className="font-weight-bold text-center">Project code</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBarcode} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="project code if any" onChange={e=>{
     setState({...state,project_code:e.target.value,process:'',
     error:'',success:''})}}
     />
 </div>           
         </div>
         <div className="col-lg-4"></div>
         <div className="col-lg-4 mt-3">
       {/**letter number */}
         <p className="font-weight-bold text-center">Letter Number</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faBarcode} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="letter number" onChange={e=>{
     setState({...state,number:e.target.value,process:'',
     error:'',success:''})}}
     required={true}/>

 </div>
 {/**letter date */}  
 <p className="font-weight-bold text-center">Letter Date</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="dd-mm-YYYY" onChange={e=>{
     setState({...state,letter_date:e.target.value,process:'',
     error:'',success:''})}}
     required={true}/>

 </div>
 
       </div>
       <div className="col-lg-3"></div>
     <div className="col-lg-5">
     <p className="font-weight-bold text-center">Title</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faHeading} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="text"
 placeholder="Input title" onChange={e=>{
     setState({...state,title:e.target.value,process:'',
     error:'',success:''})}}
     required={true}/>
</div>
         </div>  
       <div className="col-lg-12">
       <p className="font-weight-bold text-center">Body</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faPencilRuler} 
    className='text-info fa-2x mx-2 my-auto '/>
    <textarea  cols="70" rows="30"
     className="input-field form-control my-auto"
     onChange={e=>{
     setState({...state,body:e.target.value,process:'',
     error:'',success:''})}}
     placeholder='input decription' required={true}
     >
     </textarea>
</div>       
           </div>
        <div className="col-lg-4 mt-4">
        <p className="font-weight-bold text-center">Attach files</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faPaperclip} 
    className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="file" multiple={true}
 placeholder="Input title" onChange={e=>e.target.files.length>0?
    addFiles([...e.target.files]):Donothing()
        }
     />
</div>      
            </div>
            <div className="col-lg-8 mt-4">
            <div className="main-card card">
           <MDBTable hover>
                      <MDBTableHead>
                          <tr>
                              <th>
      <FontAwesomeIcon icon={faFile} className='mx-2'/>                            
                             file name
                             </th>
               <th>
               <FontAwesomeIcon icon={faFile} className='mx-2' />              
                   File type
           </th>

                              <th>
          <FontAwesomeIcon icon={faSdCard} className='mx-2' />                        
                File size
                </th>
                            
                              <th>
                <FontAwesomeIcon icon={faTrash} className='mx-2' />                 
                            remove
                                  </th>
                          </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                          {showFiles}
                      </MDBTableBody>
                  </MDBTable> 
                  </div>            
                </div>   
           <div className="col-lg-12 mt-3">
               <h4 className="text-center font-weight-bold">
               <FontAwesomeIcon icon={faUsers} className='text-warning mx-2'/>   
                   Participants ({state.participants.length})
               </h4>
           </div>
           {/**search participants */}
           <div className="col-lg-4"></div>
         <div className="col-lg-6 align-items-center">
         <div className="search-wrapper active text-center">
                        <div className="input-holder">
  <input type="text" className="search-input"
   placeholder="input Employee id,name,department"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    
                    </div>  
             </div>  
           {/**Add participants */}
           <div className="col-lg-6 mt-3">
               <div className="main-card card">
           <MDBTable hover>
                      <MDBTableHead>
                          <tr>
                              <th>
      <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                             id
                             </th>
               <th>
               <FontAwesomeIcon icon={faUser} className='mx-2' />              
                   Name
           </th>

                              <th>
          <FontAwesomeIcon icon={faLayerGroup} className='mx-2' />                        
                                  Department
                </th>
                            
                              <th>
                <FontAwesomeIcon icon={faPlusCircle} className='mx-2' />                 
                                  Add
                                  </th>
                          </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                          {showParty}
                      </MDBTableBody>
                  </MDBTable> 
                  </div> 
         </div> 
         <div className="col-lg-6 mt-3">
      {/**show participants */}
      <div className="main-card card">
      <MDBTable hover>
                      <MDBTableHead>
                          <tr>
                              <th>
      <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                             id
                             </th>
               <th>
               <FontAwesomeIcon icon={faUser} className='mx-2' />              
                   Name
           </th>

                              <th>
          <FontAwesomeIcon icon={faLayerGroup} className='mx-2' />                        
                                  Department
                </th>
                      
                              <th>
                <FontAwesomeIcon icon={faTrashAlt} className='mx-2' />                 
                                  remove
                                  </th>
                          </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                          {listParticipants}
                      </MDBTableBody>
                  </MDBTable> 
                  </div>      
             </div>
             <div className="col-lg-12 mt-3">
               <h4 className="text-center font-weight-bold">
               <FontAwesomeIcon icon={faStamp} className='text-warning mx-2'/>   
            Approval
               </h4>
           </div>
        <div className="col-lg-4">
   {/**add approval attached if any */}
   <p className="font-weight-bold text-center">
       Enter department
       </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faLayerGroup} 
    className='text-info fa-2x mx-2 my-auto '/>
    <select  className="input-field form-control my-auto"
    onChange={e=>e.target.value===''?Donothing():roleAvailable(e.target.value)
    }
    >
        <option value="">Input department</option>
        {
        depLoading?
        <option value=""><DotLoading/></option>:
        depError?
        <option value="">Laoding failed</option>:
        Department.map(d=>{
            return(
           <option value={d.name} key={d._id}>{d.name}</option>     
            )
        })
        }
    </select>
 </div>           
            </div>
            {/**enter manager role */}
            <div className="col-lg-4">
   {/**add approval attached if any */}
   <p className="font-weight-bold text-center">
        Manager role availiable in the department
       </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faLayerGroup} 
    className='text-info fa-2x mx-2 my-auto '/>
    <select  className="input-field form-control my-auto"
    onChange={e=>
    e.target.value===''?Donothing():approvalParty(e.target.value) 
    }
    >
        <option value="">Input Managerial role</option>
        {
    state.departmentAvailable.length?
    state.departmentAvailable.map(da=>{
        return(
        <option value={da.type} key={da._id}>
            {da.type}
            </option>    
        )
    })
    :<option value="" className='text-danger'>
       sorry... No Managers are registered in this department 
        </option>
        }
    </select>
 </div>              
            </div> 
            <div className="col-lg-4">
 {/**letter movment types */}
 <p className="font-weight-bold text-center">Letter movment</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faForward} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto">is conseucative</p>
<input className="input-field my-auto mx-2" type="checkbox"
  onChange={e=>{
     setState(s=>({...state,conseucative:!s.conseucative,process:'',
     error:'',success:''}))}}
     checked={state.conseucative}
     />
 </div>

            </div>
            <div className="col-lg-12">
            <div className="main-card card">
      <MDBTable hover>
                      <MDBTableHead>
                          <tr>
                              <th>
      <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                             id
                             </th>
               <th>
               <FontAwesomeIcon icon={faUser} className='mx-2' />              
                   Name
           </th>

                              <th>
          <FontAwesomeIcon icon={faLayerGroup} className='mx-2' />                        
                                  Department
                </th>
                <th>
          <FontAwesomeIcon icon={faSuitcase} className='mx-2' />                        
                            Manageral level
                </th>
             {
                 state.conseucative?
                <th>
                <FontAwesomeIcon icon={faTrashAlt} className='mx-2' />                 
                                Approval level
                                  </th>:
                       <p></p>           
             }     
                  {
                      state.conseucative?
                      <th>
                <FontAwesomeIcon icon={faLevelUpAlt} className='mx-2' />                 
                                Set level
                                  </th>:
                                  <p></p>
                  }                                       
                              <th>
                <FontAwesomeIcon icon={faTrashAlt} className='mx-2' />                 
                                  operation
                                  </th>
                          </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                          {listApproval}
                      </MDBTableBody>
                  </MDBTable> 
                  </div>       
                </div>
                <div className="col-lg-12 mt-3">
               <h3 className="text-center">
                   Save options
                   </h3>     
                </div>
              <div className="col-lg-3">
              <p className="font-weight-bold text-center">Save as Draft</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faSave} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto">Save as a draft</p>
<input className="input-field my-auto mx-2" type="checkbox"
 placeholder="project name if any" onChange={e=>{
     setState(s=>({...state,draft:true,participant:false,
    process:'',forward:false,saveOptions:'draft',all:false,
     error:'',success:''}))}}
     checked={state.draft}
     />
 </div>   
                  </div>
             {
                 state.participants.length?
                 <div className="col-lg-3">
              <p className="font-weight-bold text-center">
                  Save and show to participants
                  </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faSave} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto">save and show to participant</p>
<input className="input-field my-auto mx-2" type="checkbox"
 placeholder="project name if any" onChange={e=>{
     setState(s=>({...state,participant:true,draft:false,
     process:'',forward:false,saveOptions:'participant',all:false,
     error:'',success:''}))}}
     checked={state.participant}
     />
 </div>   
                  </div>:
                 <p></p>
             }     
                  
         {
             state.initial_phase.length?
             <div className="col-lg-3">
            {
                state.participants.length?
                <p className="font-weight-bold text-center">
                  Save and start approving with out showing 
                  participants
                  </p>:
                  <p className="font-weight-bold text-center">
                  Save and start approving 
                  </p>
            }
              
 <div className="input-container">
 <FontAwesomeIcon icon={faSave} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto">
        Save and start approving with out showing 
                  participants
                  </p>
<input className="input-field my-auto mx-2" type="checkbox"
 placeholder="project name if any" onChange={e=>{
     setState(s=>({...state,participant:false,draft:false,
     process:'',forward:true,saveOptions:'forward',all:false,
     error:'',success:''}))}}
     checked={state.forward}
     />
 </div>   
                  </div>: 
         <p></p>
         }         
         {
             state.initial_phase.length&&state.participants.length?
             <div className="col-lg-3">
              <p className="font-weight-bold text-center">
                  Save,show to participants and start approving
                  </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faSave} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto">Save,show to participants and start approving</p>
<input className="input-field my-auto mx-2" type="checkbox"
 placeholder="project name if any" onChange={e=>{
     setState(s=>({...state,participant:false,draft:false,
     process:'',forward:false,saveOptions:'DoAll',all:true,
     error:'',success:''}))}}
     checked={state.all}
     />
 </div>   
                  </div>: 
         <p></p>
         }
              <div className="col-lg-12">
              <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
 {
     state.loading?<DotLoading/>:<p></p>
 }
 <Progress max="100" color="success" value={loaded} >
           { Math.round(loaded,2) }%
           </Progress>
      
                  </div>
                
 <div className="col-lg-4 mt-4"> </div>
 <div className="col-lg-8 mt-4">
 <div className="input-container">
 <button className="btn btn-info mx-3" type='reset'
      disabled={state.disable}
      onClick={()=>setState({ 
          ...state,
          letter_date:'',project_name:'',project_code:'',
          number:'',title:'',body:'',files:[],filesUpload:[],
          conseucative:false,participant:false,
          draft:true,forward:false,participants:[],
          initial_phase:[],
          success:'',error:'',process:''
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
             </div>
             </div>
             </form>
    )
}

export default CreateLetters
