import React,{useState, useEffect,useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPizzaSlice, faWineBottle, faBed, faSun, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { DotLoading } from '../../layout/Loading'
import { encryptObject, decrptObject } from '../../auth/encrypt'
import axios from 'axios'
import { host } from '../../config/config'
import { withRouter } from 'react-router'
import CompanyFetcher from '../../fetchers/CompanyFetcher'
import ConfigFetch from '../../fetchers/configFetcher'
import { StoreContext } from '../../contexts/contexts'
import { decryptToken } from '../../auth/tokenEncryption'

   const CreateConfigaration=(props)=> {
      const [state,setState]=useState({
          dinner:0,
          breakfast:0,
          lunch:0,
          bed:0,
          climate_1:0,
          climate_2:0,
          climate_3:0,
          process:'',success:'',error:'',
          disable:false,loading:false
       })
       const {company,config}=useContext(StoreContext)
       const {state:Company,loading}=company
       
  const {state:Config,loading:loadingConfig}=config  
  
  useEffect(()=>{     
  //if configured push to Admin sign up
           if(!loading&&!loadingConfig){
             var x   
   Company.length?
   Config.length?props.history.push('/adminSignUp'):
   x=3   
   :
   props.history.push('/createCompany')  //if company info is not set push to company     
             }
       },[loadingConfig])


    const handleSubmit=async (e)=>{
  e.preventDefault()
    try{
    setState({...state,disable:true,loading:true,
        process:'saving',success:'',error:''})    
    const {dinner,bed,breakfast,lunch,climate_1,
        climate_2,climate_3,}=state
    const totall=parseFloat(dinner)+parseFloat(breakfast)+parseFloat(lunch)
      +parseFloat(bed)
    if(totall>100){
        setState({...state,disable:false,loading:false,
process:'',success:'',error:'breakfast,lunch,dinner and bed allowance should not be greater than 100%'})    

    }
    else{
     /**encrypting requset for security */   
        const encrypt=encryptObject({
            dinner,bed,breakfast,lunch,climate_1,climate_2,climate_3})
                const req=await axios.post(host+'/config',{data:encrypt})  
                 const res=decrptObject(req.data)
                 if(res.error){
                    setState({...state,disable:false,loading:false,
                        process:'',success:'',error:'error while saving check out the server'})    
                    
                 }
                 else if(res.created&&!res.error){
                    setState({...state,disable:false,loading:false,
       process:'',success:'saving success you can edit on admin panel',error:''})    
setTimeout(()=>{
    props.history.push('/adminSignUp')},
      1000)//after displaying success push to create system admin
                 }    
    }      
    
}
    catch(err){
        console.log(err)
        setState({...state,disable:false,loading:false,
            process:'',success:'',error:'unable to save server is not active'})    
        
    }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-4">
                    <CompanyFetcher/>
                    <ConfigFetch/>
                </div>
                <div className="col-lg-4">
                <div className="signup-form ">	
    <form className='main-card mb-3 card' onSubmit={e=>handleSubmit(e)}>
		<h2>Sytem configaration</h2>
		<p className="lead">
            welcome to allowance system  create system configuration you can
            edit later on admin panel
            </p>
        <div className="form-group">
			<div className="input-group input-container">
				<span className="input-group-addon">
                    <FontAwesomeIcon icon={faCoffee}
                     className="fa fa-barcode"/>
                    </span>
    <input type="number" className="input-field form-control" 
        placeholder="Breakfast allowance by percent" required={true}
        onChange={e=>setState({...state,breakfast:e.target.value,success:'',
     error:'',process:''})}
        />
            </div>
        </div>
        <div className="form-group">
			<div className="input-group">
				<span className="input-group-addon">
                <FontAwesomeIcon icon={faPizzaSlice} className="fa fa-user"/>    
                    </span>
				<input type="number" className="form-control" 
                 placeholder="Lunch allowance by %"
    onChange={e=>setState({...state,lunch:e.target.value,
         success:'',error:'',process:''
    })}             
                  required={true}/>
			</div>
        </div>
		<div className="form-group">
			<div className="input-group">
				<span className="input-group-addon">
        <FontAwesomeIcon icon={faWineBottle} className="fa fa-lock" />            
                    </span>
				<input type="number" className="form-control" 
                 placeholder="Dinner allowance by %"
   onChange={e=>setState({...state,dinner:e.target.value,success:'',
     error:'',process:''   
})}           required={true}   
                 />
			</div>
        </div>
		<div className="form-group">
			<div className="input-group">
				<span className="input-group-addon">
        <FontAwesomeIcon icon={faBed} className="fa fa-lock" />            
                    </span>
				<input type="number" className="form-control" 
                 placeholder="Bed allowance by %" required={true}
   onChange={e=>setState({...state,bed:e.target.value,success:'',
     error:'',process:''   
})}              
                 />
			</div>
        </div>
        <div className="form-group">
			<div className="input-group">
				<span className="input-group-addon">
        <FontAwesomeIcon icon={faSun} className="fa fa-lock" />            
                    </span>
				<input type="number" className="form-control" 
                 placeholder="climate scale 1 allowance by %" required={true}
   onChange={e=>setState({...state,climate_1:e.target.value,success:'',
     error:'',process:''   
})}            
                 />
			</div>
        </div>
        <div className="form-group">
			<div className="input-group">
				<span className="input-group-addon">
        <FontAwesomeIcon icon={faSun} className="fa fa-lock" />            
                    </span>
				<input type="number" className="form-control" 
                 placeholder="climate scale 2 allowance by %" required={true}
   onChange={e=>setState({...state,climate_2:e.target.value,success:'',
     error:'',process:''   
})}              
                 />
			</div>
        </div>
        <div className="form-group">
			<div className="input-group">
				<span className="input-group-addon">
        <FontAwesomeIcon icon={faSun} className="fa fa-lock" />            
                    </span>
				<input type="number" className="form-control" 
                 placeholder="climate scale 3 allowance by %" required={true}
   onChange={e=>setState({...state,climate_3:e.target.value,success:'',
     error:'',process:''   
})}             
                 />
			</div>
        </div> 
        <div className="text-center">
                   <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
 {
     state.loading?<DotLoading/>:<p></p>
 }
 </div>    
 

     <div className="form-group">
            <button type="submit" disabled={state.disable} 
            className="btn btn-primary btn-block btn-lg">
            setup
            </button>
        </div>
     
</form>
</div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(CreateConfigaration)
