import React, { useContext, useEffect } from 'react'
import { faBarcode, faDraftingCompass, faCog, faTruckMoving, faUser, faHammer, faObjectGroup, faBell } from '@fortawesome/free-solid-svg-icons'
import { MDBTableBody, MDBTable, MDBTableHead } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StoreContext } from '../../contexts/contexts'
import { AllowanceClass } from '../../../controllers/Allowance'
import { DotLoading } from '../../layout/Loading'
import ModalAllowance from '../../layout/ModalAllowance'
import { fetchData_Allowance } from '../../fetchers/Functions/FecthAllowance'

   const IncomingCalculations=()=> {
    const { allowances,dispatchAllowances,employees,users}=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,
            error:empError}=employees
     const {state:Users,loading:userLoading,error:userError}=users 
     const allowance=new AllowanceClass(Allowances,Employees,Users)
     
     const newAllowances=allowance.newCalculations()
     const seenAllowances=allowance.seenCalculations()
     const allAllowances=allowance.IncomingCalculations()
     const commented=allowance.tlCommented() //allowance commented by team leader
     const Commented=allowance.drCommented() //allowance commented by finance director
  //fetch if change occurs
 const fetch=()=>fetchData_Allowance(dispatchAllowances)
 useEffect(()=>{
    fetch()  
      },[])
   //new allowances render
     const NewAllowances=loading||empLoading||userLoading?
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
   newAllowances.map(na=>{
       return(
       <tr key={na._id}>
       <td className="text-info">
          {na.id}     
           </td> 
    <td className="text-info">
        {allowance.Name(na.creater)}
    </td>
    
    <td className="text-info">
        {na.letter_id}
    </td>
    
    <td className="text-info">
        {na.initial_place}-{na.destination_place}
    </td>
    <td className="text-info">
        {
         na.f_pending_emp.calculated==='approve'?
         <p className="text-center font-italic">
             calculations is done and sent for approval
             </p>:
          na.f_pending_emp.calculated==='draft'?
          <p className="text-center font-italic">
             calculations is done and save as draft
             </p>:
           <p className="text-center font-italic">
            Allowance is waiting for calculation
               </p>            
        }
    </td>
    <td className="text-info">
        <ModalAllowance type='view_details' allowance={na} fetch={fetch}
         Manager_seen={false} pendingDirector={false} approve_tl={false}
          pendingTeamLeader={false} incomingCalculations={true}
          adr={false}
           />
          
       
  </td>
       </tr>    
       )
   }) 
   //seen allowance render
   const SeenAllowances=loading||empLoading||userLoading?
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
allAllowances.length?
 seenAllowances.map(na=>{
     return(
     <tr key={na._id}>
     <td>
          {na.id}     
           </td> 
  <td>
      {allowance.Name(na.creater)}
  </td>
  
  <td>
      {na.letter_id}
  </td>
 
  <td>
      {na.initial_place}-{na.destination_place}
  </td>
  <td>
  {
         na.f_pending_emp.calculated==='approve'&&
         allowance.progress(na._id)!==16 &&
         allowance.progress(na._id)!==20
         ?
         <p className="text-center font-italic">
             calculations is done and sent for approval
             </p>:
          na.f_pending_emp.calculated==='draft'?
          <p className="text-center font-italic">
             calculations is done and save as draft
             </p>:
(allowance.progress(na._id)===16 && !na.f_pending_emp.redone) ||
(allowance.progress(na._id)===20 &&!na.f_pending_emp.redone_director)?
             <h5 className="text-warning font-italic">
            Allowance needs calculation again
               </h5> 
           :
           (allowance.progress(na._id)===16 && na.f_pending_emp.redone) ||
(allowance.progress(na._id)===20 &&na.f_pending_emp.redone_director)?
            <p className="text-center font-italic">
      Allowance  is redone waiting to be approved by your manager          
                </p>   
           :<p className="text-center font-italic">
            Allowance is waiting for calculation
               </p>            
        }
        {console.log(allowance.isReDone(na._id))}
        {
     allowance.progress(na._id)===16?
     <p className="font-italic text-warning font-weight-bold">
    commented by your team leader {allowance.Name(na.f_pending_tl.emp_id)}
          <br/>
    comment-{na.f_approve_tm.comment}
   
         </p>:
     <p></p>
 }
 {
     allowance.progress(na._id)===20?
     <p className="font-italic text-warning font-weight-bold">
    commented by your Director {allowance.Name(na.f_pending_dr.emp_id)}
          <br/>
    comment-{na.f_approve_dr.comment}
         </p>:
     <p></p>
 }
  </td>
  <td>
      <ModalAllowance type='view_details' allowance={na} fetch={fetch}
       Manager_seen={true} />
   {
    allowance.progress(na._id)<15||allowance.progress(na._id)===16
     ||allowance.progress(na._id)===20?
        <ModalAllowance type='start' allowance={na} fetch={fetch} />:
         <p></p>
         }
         {
             allowance.isCalculationDone(na._id)?
        <ModalAllowance type='see_calculations' allowance={na}
        tl={false}   director={false}
         fetch={fetch} />:
         <p></p>
         }
  </td>
     </tr>    
     )
 }): 
 <tr>
<td colSpan={5} className='text-center text-danger'>
           ...oops No allowances yet
           </td>
</tr>  
    return (
        <div className="container">
            <div className="row  mt-3 main-card mb-3 card min-height">
           <div className="col-lg-12">
           {
               newAllowances.length?
           <h5 className="text-center text-info my-2">
               New Allowance need calculation({newAllowances.length})
           </h5>:
           <p></p>
           }
           {
               commented.length?
               <h5 className="text-center text-warning my-2">
     <FontAwesomeIcon icon={faBell} />              
    {commented.length} allowance is commented please do calculation
             again      
               </h5>
               :
            Commented.length?
            <h5 className="text-center text-warning my-2">
     <FontAwesomeIcon icon={faBell} />              
    {Commented.length} allowance is commented please do calculation
             again      
               </h5>:    
               <p></p>
           }
           </div>
                
           <div className="col-lg-12">
           <MDBTable hover striped bordered>
         <MDBTableHead>
                          <tr>
                          <th>
             # id                                
                              </th>                 
                              <th>
             <FontAwesomeIcon icon={faUser} className='mx-2'/>                            
                     user                                
                              </th>
                                
                              <th>
    <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                 Letter id                     
                              </th>
                              
               <th>
               <FontAwesomeIcon icon={faTruckMoving} className='mx-2' />              
                   initial place -destination place
                              </th>
                              <th>
               <FontAwesomeIcon icon={faHammer} className='mx-2' />              
                  Action made
                              </th>
                <th>
          <FontAwesomeIcon icon={faCog} className='mx-2' />                        
                Options
                </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                          {NewAllowances}
                          {SeenAllowances}
                      </MDBTableBody>
                  </MDBTable>
               </div>     
            </div>
        </div>
    )
}

export default IncomingCalculations
