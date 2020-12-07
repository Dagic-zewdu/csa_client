import React, { useContext, useEffect } from 'react'
import { faBarcode, faDraftingCompass, faCog, faTruckMoving, faUser, faHammer, faObjectGroup } from '@fortawesome/free-solid-svg-icons'
import { MDBTableBody, MDBTable, MDBTableHead } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StoreContext } from '../../contexts/contexts'
import { AllowanceClass } from '../../../controllers/Allowance'
import { DotLoading } from '../../layout/Loading'
import ModalAllowance from '../../layout/ModalAllowance'
import { fetchData_Allowance } from '../../fetchers/Functions/FecthAllowance'

   const ShowPending_TL=()=> {
    const { allowances,dispatchAllowances,employees,users}=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,
            error:empError}=employees
     const {state:Users,loading:userLoading,error:userError}=users 
     const allowance=new AllowanceClass(Allowances,Employees,Users)
     
     const newAllowances=allowance.New_F_Pending_tl()
     const seenAllowances=allowance.seen_F_Pending_tl()
     const allAllowances=allowance.F_pending_tl()
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
   na.f_pending_tl.forwarded?
<p className='font-italic'>
    Assigned employee-{allowance.Name(na.f_pending_emp.emp_id)}
     </p>:
<p className='font-italic'>
    Waiting to forward
    </p>      
        }
    </td>
    <td className="text-info">
        <ModalAllowance type='view_details' allowance={na} fetch={fetch}
         Manager_seen={false} pendingDirector={false} approve_tl={false}
         pendingTeamLeader={true} incomingCalculations={false}
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
   na.f_pending_tl.forwarded?
<p className='font-italic'>
    Assigned employee-{allowance.Name(na.f_pending_emp.emp_id)}
     </p>:
<p className='font-italic'>
    Waiting to forward
    </p>      
        }
  </td>
  <td>
      <ModalAllowance type='view_details' allowance={na} fetch={fetch}
       Manager_seen={true} />
       {
             allowance.progress(na._id)<14?
        <ModalAllowance type='tl_pending_approve'
         allowance={na} fetch={fetch} />:
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
               New Allowances to ({newAllowances.length})
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

export default ShowPending_TL
