import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faObjectGroup, faUserCog, faCity, faHouseUser, faPhone, faPenNib, faMap, faImage, faStamp } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { Progress } from 'reactstrap'
import { host, files_url } from '../../config/config'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import { decryptToken } from '../../auth/tokenEncryption'
     const EditCompany=(props)=> {
        const [state,setState]=useState({
            name:'',
            logo:'',
            dept_length:0,
            emp_length:0,
            city:'',
            subcity:'',
            woreda:'',
            house:'',
            phone_1:'',
            phone_2:'',
            file:'',
              image:'',
              disable:false,
              loading:false,
              process:'',
              success:'',
              error:'',
              ierror:'' 
       })
       const [loaded,setLoaded]=useState(0)
       const {company}=props
       useEffect(()=>{
    setState({...state,...company,image:files_url+company.logo})
       },[company]) 
       const handleSubmit=async (e)=>{
         e.preventDefault()
         if(state.file!==''){
             try{
  
               var data= new FormData()
         data.append('file',state.file)
       //uploading file
         const logoUpload= await axios.post(host+'/file',data,
        {
         onUploadProgress: ProgressEvent=>
         setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100)
         }) 
    if(logoUpload.data.upload){
                
       saveCompany()
     }
     else{
       setState({...state,error:'unable to upload the logo',success:'',process:''})
   }
   }
   catch(err){
    
       setState({...state,error:'unable to upload logo file Server is not active',
       success:'',process:''})
   }}
   else{
       saveCompany()
   }
   }
   const saveCompany=async ()=>{
         try{
           setState({...state,error:'', success:'',process:''
           ,loading:true,process:'saving...',disable:true
           })
    const { name,logo,dept_length,emp_length,city,subcity,woreda,house,
            phone_1,phone_2}=state
          //getting token from localStorage
        let {token:Token,user_type:usertype}=localStorage
        //decrypting token
        const token=decryptToken(Token)
        /**encrypting requset for security */  
     const encrypt=encryptObject({name,logo,dept_length,
       emp_length,city,subcity,woreda,house,phone_1,phone_2
        ,_id:props.company._id,token,usertype   
    })               
   
       const req=await axios.put(host+'/company',{data:encrypt})      
        const res=decrptObject(req.data)
        if(res.error){
           setState({...state,error:'can not edit company info try again later',
            success:'',process:''
           ,loading:false,process:'',disable:false
           })     
        }
        else if(!res.error&&res.updated){
           setState({...state,error:'', 
               success:'company edited successfully',
           process:'',loading:false,process:'',disable:false
           })
           if(state.file!==''){
              //deleting previous data
              const encDel=encryptObject({file:company.logo})
              //requesting
              const reqDel=await axios.put(host+'/file',{data:encDel})
              const resDel=decrptObject(reqDel.data.encrypt)
       if(!resDel.deleted){
           setState({...state,error:'unable to delete previous file',success:'',process:''})
        }}
        }
   }
   
         catch(err){
             console.log(err)
           setState({...state,error:'unable to save data server is not responding',
            success:'',process:'',loading:false,process:'',disable:false
           })
         }
       } 
       return (
        <form onSubmit={e=>handleSubmit(e)}>
         <div className="container">
             <div className="row">
   <div className="col-lg-12 text-center">
   <FontAwesomeIcon icon={faStamp} className='fa-2x my-auto'/>
            <p className="my-auto font-weight-bold">
        Edit company info        
                </p>
   </div>
   <div className="col-lg-4">
     <p className="text-center font-weight-bold">
           Company name
         </p>
         <div className="form-group">
             <div className="input-group input-container">
                 <span className="input-group-addon">
                     <FontAwesomeIcon icon={faBuilding}
                      className="fa fa-barcode"/>
                     </span>
     <input type="text" className="input-field form-control" 
         placeholder="Company name" required={true} value={state.name}
         onChange={e=>setState({...state,name:e.target.value,success:'',
      error:'',process:''})}   />
             </div>
         </div>
         <p className="text-center font-weight-bold">
           Comapny logo
         </p>
         <div className="form-group">
             <div className="input-group">
                 <span className="input-group-addon">
                 <FontAwesomeIcon icon={faImage} className="fa fa-user"/>    
                     </span>
                 <input type="file" className="form-control" 
                  placeholder="logo"
     onChange={e=>e.target.files[0]?
     e.target.files[0].type==='image/jpeg'||
        e.target.files[0].type==='image/png'?
        setState({...state,
          logo:e.target.files[0].name,
          success:'',
          ierror:'', process:'',error:'',
          file:e.target.files[0],
          image: URL.createObjectURL(e.target.files[0])
     })
        :
        setState({...state,
        success:'',error:'',ierror:'jpg and png file formats are only supported'    
        ,process:'',image:''
        }):
        setState({...state,
            logo:'',error:'',file:[],success:'',process:'',image:''})
     }           
                      />
             </div>
         </div>
   <p className="text-danger text-center font-weight-bold">{state.ierror}</p>
   
         <p className="text-center font-weight-bold">
           Department length
         </p>
       <div className="form-group">
             <div className="input-group">
                 <span className="input-group-addon">
         <FontAwesomeIcon icon={faObjectGroup} className="fa fa-lock" />            
                     </span>
                 <input type="number" className="form-control" 
                  placeholder="how many department" 
    onChange={e=>setState({
        ...state,dept_length:e.target.value,success:'',error:'',process:''   
   })}           required={true} value={state.dept_length} 
                  />
             </div>
         </div>
         <p className="text-center font-weight-bold">
           Employee quantity
         </p>
      <div className="form-group">
             <div className="input-group">
                 <span className="input-group-addon">
         <FontAwesomeIcon icon={faUserCog} className="fa fa-lock" />            
                     </span>
                 <input type="number" className="form-control" 
                  placeholder="How many employees" 
    onChange={e=>setState({...state,emp_length:e.target.value,success:'',
      error:'',process:''   
   })}           required={true} value={state.emp_length}  
                  />
             </div>
         </div>
         <p className="text-center font-weight-bold">
           city
         </p>
         <div className="input-group">
                 <span className="input-group-addon">
         <FontAwesomeIcon icon={faCity} className="fa fa-lock" />            
                     </span>
                 <input type="text" className="form-control" 
                  placeholder="Enter city company reside" 
    onChange={e=>setState({...state,city:e.target.value,success:'',
      error:'',process:''   
   })}      value={state.city}     />
             </div>
                 </div>
                 <div className="col-lg-4 mt-3">
       <p className="text-center font-weight-bold">
         Subcity
         </p>
         <div className="form-group">
             <div className="input-group">
                 <span className="input-group-addon">
         <FontAwesomeIcon icon={faCity} className="fa fa-lock" />            
                     </span>
                 <input type='text' className="form-control" 
                  placeholder="Subcity" 
    onChange={e=>setState({...state,subcity:e.target.value,success:'',
      error:'',process:''   
   })}     value={state.subcity}      />
             </div>
         </div>
         <p className="text-center font-weight-bold">
           woreda
         </p>    
         <div className="form-group">
             <div className="input-group">
                 <span className="input-group-addon">
         <FontAwesomeIcon icon={faMap} className="fa fa-lock" />            
                     </span>
                 <input type="text" className="form-control" 
                  placeholder="Enter woreda if any" 
    onChange={e=>setState({...state,woreda:e.target.value,success:'',
      error:'',process:''   
   })}       value={state.woreda}
                  />
             </div>
         </div>
         <p className="text-center font-weight-bold">
           House number
         </p>
         <div className="form-group">
             <div className="input-group">
                 <span className="input-group-addon">
         <FontAwesomeIcon icon={faHouseUser} className="fa fa-lock" />            
                     </span>
                 <input type="text" className="form-control" 
                  placeholder="Enter house number" 
    onChange={e=>setState({...state,house:e.target.value,success:'',
      error:'',process:''   
   })}            value={state.house}
                  />
             </div>
         </div> 
         <p className="text-center font-weight-bold">
           phone 1
         </p>
         <div className="form-group">
             <div className="input-group">
                 <span className="input-group-addon">
         <FontAwesomeIcon icon={faPhone} className="fa fa-lock" />            
                     </span>
                 <input type="text" className="form-control" 
                  placeholder="Phone number one" required={true}
    onChange={e=>setState({...state,phone_1:e.target.value,success:'',
      error:'',process:''   
   })}           required={true}  value={state.phone_1}
                  />
             </div>
         </div>
         <p className="text-center font-weight-bold">
           phone 2
         </p>
         <div className="form-group">
             <div className="input-group">
                 <span className="input-group-addon">
         <FontAwesomeIcon icon={faPhone} className="fa fa-lock" />            
                     </span>
                 <input type="text" className="form-control" 
                  placeholder="Phone number two" required={true}
    onChange={e=>setState({...state,phone_2:e.target.value,success:'',
      error:'',process:''   
   })}            value={state.phone_2}
                  />
             </div>
         </div>
        </div>
                 <div className="col-lg-4">
           <div className="card">
   <img src={state.image} alt="" className="card-img-top"/>
               </div>        
                 <div className="text-center">
                    <p className="text-danger text-center font-weight-bold">{state.error}</p>
   <p className="text-success text-center font-weight-bold">{state.success}</p>
   <p className="text-info text-center font-weight-bold">{state.process}</p>
   {
      state.loading?<DotLoading/>:<p></p>
   }
   <Progress max="100" color="text-success" value={loaded} >
              { Math.round(loaded,2) }%
              </Progress>
   </div>    
   
   
      <div className="form-group">
             <button type="submit" disabled={state.disable} 
             className="btn btn-primary btn-block btn-lg">
             <FontAwesomeIcon icon={faPenNib} />
             Save
             </button>
         </div>
                 </div>
             </div>
         </div>
         </form>
       
       )
}

export default EditCompany
