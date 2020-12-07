import React, { useContext, useEffect, useState } from 'react'
import { Anotification, StoreContext } from '../contexts/contexts'
import { AllowanceClass } from '../../controllers/Allowance'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import { DotLoading } from '../layout/Loading'
import { faDraftingCompass, faTruckMoving, faSdCard, faBarcode, faEye, faPencilAlt, faCog, faEnvelope, faBellSlash, faBell, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalAllowance from '../layout/ModalAllowance'
import { fetchData_Allowance } from '../fetchers/Functions/FecthAllowance'
import ReactTimeAgo from 'react-time-ago'
import { FullDay, TellDay, tellTime } from '../../controllers/Date'
   const NonFinanceShow=()=> {
    //allowance state 
    const [state,setState]=useState({
        userAllowances:[],
        completed:[],   //completed allowances
        unCompleted:[],   //uncompleted allowances
        found:false
    })
const { allowances,dispatchAllowances,employees,users}=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,error:empError}=employees
    const {state:Users,loading:userLoading,error:userError}=users
const userAllowance=new AllowanceClass(Allowances,Employees,Users)
     const userAllowances=userAllowance.userAllowances()
     const completed=userAllowance.completed()
     const unCompleted=userAllowance.unCompleted()
  
      //search allowances
      const handleSearch=(index)=>{
  let completed=index===''?userAllowance.completed():
  userAllowance.searchCompleted(index)
  let unCompleted=index===''?userAllowance.unCompleted():
  userAllowance.searchUnCompleted(index)
  let found=index===''?false:true 
  setState({...state,completed,unCompleted,found})
      }
      
      useEffect(()=>{
        fetchData_Allowance(dispatchAllowances)
        setState({...state,completed,unCompleted,userAllowances})
      
    },[Allowances.length,loading])
/**set completed un completed allowances */
   
const setCompleted=()=>setState({...state,completed,unCompleted,userAllowances})

const fetch=()=>{
    fetchData_Allowance(dispatchAllowances)
    setCompleted()
}
  const listCompleted=loading||empLoading||userLoading?
  <tr>
      <td colSpan={5} className='text-center'>
          <DotLoading/>
          </td>
  </tr>:
error||empError||userError?
<tr>
<td colSpan={5} className='text-center text-danger'>
          ...oops Loading failed server is not responding
          </td>
</tr>:
state.completed.map(la=>{
   return(
       <tr key={la._id}>
           <td className='text-success font-weight-bold'>
               {la.id}
           </td>
           <td className='text-success font-weight-bold'>
               {la.letter_id}
           </td>
           <td className="text-success">
               Allowance is completed 
               
           </td>
           <td className="text-success font-weight-bold">
              <ReactTimeAgo date={la.created_date} /> 
             
           </td>
           <td className='text-info font-weight-bold'>
     <ModalAllowance type='see_final' allowance={la} fetch={fetch}/>
    </td>
       </tr>
   )
 })

const listAllowances=loading||empLoading||userLoading?
       <tr>
           <td colSpan={5} className='text-center'>
               <DotLoading/>
               </td>
       </tr>:
    error||empError||userError?
    <tr>
    <td colSpan={5} className='text-center text-danger'>
               ...oops Loading failed server is not responding
               </td>
    </tr>:
    state.userAllowances.length?
      state.unCompleted.map(la=>{
        return(
            <tr key={la._id}>
                <td>
                    {la.id}
                </td>
                <td>
                    {la.letter_id}
                </td>
                
                <td>
                    {
           la.all_done?
           <p className="text-center text-success">
              Allowance is done 
               </p>:             
            la.save_options==='approve'?
            <p className="text-center">
                sent for approval and calculation
                </p>:
                <p className="text-center">
                 saved as draft
                    </p>            
                    }
                </td>
            <td >
              <ReactTimeAgo date={la.created_date} />
              <p className="font-italic float-right">
                  {tellTime(la.created_date)}
              </p>
              <p className="font-italic">
                   {TellDay(la.created_date)}
               </p> 

           </td>   
                <td className='row'>
        {
     !la.all_done?
               <div>
               <ModalAllowance type='view_details' allowance={la}
          Manager_seen={false} fetch={fetch} pendingDirector={false}
           pendingTeamLeader={false} incomingCalculations={false}
           approve_tl={false} adr={false}
           />
         {
             la.save_options==='approve'?
<ModalAllowance type='view_progress' allowance={la} employees={Employees}
  users={Users} allowances={Allowances} fetch={fetch} 
             />:
                <p></p>
         }
         {
    userAllowance.progress(la._id)===0||userAllowance.progress(la._id)===2?
    <ModalAllowance type='edit_allowance' allowance={la} fetch={fetch}/>:
            <p></p>   
         }
         {
    userAllowance.progress(la._id)<=2?
    <ModalAllowance type='delete_allowance' allowance={la} fetch={fetch}/>:
            <p></p>      
         }  
           </div>:
    <ModalAllowance type='see_final' allowance={la} fetch={fetch}/>
        }            
         
         </td>
            </tr>
        )
      })
      :
    <tr >
        <td colSpan={5} className='text-center text-danger font-weight-bold'>
        No Allowance created So far
        </td>
    </tr>
    
    //render
  return (
        <div className="container">
     <div className="row">
       <div className="col-lg-3 my-auto">
           <ModalAllowance type='create_allowance' fetch={fetch}/>
       </div>
            <div className="col-lg-5 my-auto">
            <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" 
  placeholder="Type id,letter id,destination,program name"
  onChange={e=>handleSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    </div> 

            </div>
            <div className="col-lg-4 my-auto">
            <div className="card mb-3 widget-content bg-grow-early">
                <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                        <div className="widget-heading">Allowance</div>
                        <div className="widget-subheading">Totall Made</div>
                    </div>
                    <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span>
                            {userAllowances.length}
                            </span></div>
                    </div>
                </div>
            </div> 
                
                </div>  
                {/** */}
                <div className="container mt-3 main-card mb-3 card min-height">
            <div className="row">
         <div className="col-lg-12">
          {
    completed.length?
       <h5 className="text-center text-success font-weight-bold">
      <FontAwesomeIcon icon={faBell} />
        {completed.length} allowances is completed      
           </h5>:
           <p></p>       
          }   
             {
                 state.found?
                 <h5 className='text-center'>
   Allowance found -{state.completed.length + state.unCompleted.length}
                </h5>
         :
         <p></p>   
             }
         <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                          <th>
             <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                Allowance id                                
                              </th>   
                              <th>
             <FontAwesomeIcon icon={faEnvelope} className='mx-2'/>                            
                Letter id Attached                                
                              </th>

                              <th>
          <FontAwesomeIcon icon={faSdCard} className='mx-2' />                        
                saving option
                </th>
              
                <th>
          <FontAwesomeIcon icon={faCalendar} className='mx-2' />                        
                created
                </th>  
                <th>
          <FontAwesomeIcon icon={faCog} className='mx-2' />                        
                Options
                </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                           {listCompleted}
                          {listAllowances}
                      </MDBTableBody>
                  </MDBTable> 
             </div>         
            </div>
        </div>

                {/** */}          
     </div>
 </div>
     
    )
}

export default NonFinanceShow
