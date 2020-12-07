import React, { useContext, useEffect } from 'react'
import { faBarcode, faDraftingCompass, faCog, faTruckMoving, faUser, faHammer, faObjectGroup } from '@fortawesome/free-solid-svg-icons'
import { MDBTableBody, MDBTable, MDBTableHead } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StoreContext } from '../../contexts/contexts'
import { AllowanceClass } from '../../../controllers/Allowance'
import { DotLoading } from '../../layout/Loading'
import ModalAllowance from '../../layout/ModalAllowance'
import { fetchData_Allowance } from '../../fetchers/Functions/FecthAllowance'

   const ShowCalculated=()=> {
    const { allowances,dispatchAllowances,employees,users}=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,
            error:empError}=employees
     const {state:Users,loading:userLoading,error:userError}=users 
     const allowance=new AllowanceClass(Allowances,Employees,Users)
     
     const newAllowances=allowance.NewDrApprove()
     const seenAllowances=allowance.seenDrApprove()
     const allAllowances=allowance.DrApproveAllowance()
     const reDone=allowance.reDone()
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
        
    {na.f_approve_dr.approved}
    </td>
    <td className="text-info">
        <ModalAllowance type='view_details' allowance={na} fetch={fetch}
         Manager_seen={false} pendingDirector={false}  
         approve_tl={false} pendingTeamLeader={false} 
         incomingCalculations={false} adr={true} />
         <ModalAllowance type='see_calculations' allowance={na}
        tl={false} director={true} fetch={fetch} 
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
     <td className="text-info">
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
 {na.f_approve_dr.approved}
 {
     allowance.progress(na._id)===20 && !allowance.isReDone(na._id)?
     <p className="text-center text-warning font-italic">
         comment-{na.f_approve_dr.comment}
     </p>:
     allowance.progress(na._id)===20 && allowance.isReDone(na._id)?
     <h5 className="text-center text-warning font-italic">
    Allowance is redone please review the allowance <br/>
    you commented-{na.f_approve_dr.comment}
     </h5>
     :<p></p>
 }
  </td>
  <td>
      <ModalAllowance type='view_details' allowance={na} fetch={fetch}
       Manager_seen={true} />
       <ModalAllowance type='see_calculations' allowance={na}
        tl={true} director={false} fetch={fetch} />
        {
            !na.all_done?
    <ModalAllowance type='approve_dr' allowance={na} fetch={fetch} />:
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
               New Allowances Done ({newAllowances.length})
           </h5>:
           <p></p>
           }
           {
            reDone.length?
            <h5 className="text-center text-warning my-2">
        {reDone.length} allowance is redone and waitng decision
           </h5>:
           <p></p>     
           }
           </div>
                
           <div className="col-lg-12">
           <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                          <th>
             <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                Allowance id                                
                              </th>          
                              <th>
             <FontAwesomeIcon icon={faUser} className='mx-2'/>                            
                     From user                                
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
                   Decision
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

export default ShowCalculated

