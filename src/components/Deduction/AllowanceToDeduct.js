import { faCalendar, faCog, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo'
import { TellDay, tellTime } from '../../controllers/Date'
import { DeductionClass } from '../../controllers/Deductions'
import { StoreContext } from '../contexts/contexts'
import { fetchData_Deductions } from '../fetchers/Functions/FerchDeductions'
import ModalDeduction from '../layout/ModalDeduction'

  const AllowanceToDeduct=()=> {
    const [state,setState]=useState({
        allowance:'',
        found:''
    })
    const { allowances,employees,users,dispatchDeductions,deductions}=useContext(StoreContext)
    const {state:Allowances,loading}=allowances
    const {state:Employees}=employees
    const {state:Users}=users
    const {state:Deductions}=deductions
const Deduction=new DeductionClass(Deductions,Allowances,Employees,Users)
const deduction=Deduction.toDeduct() //array of allowance to deduct
const fetch=()=>fetchData_Deductions(dispatchDeductions)
const handleSearch=(index)=>{
  const allowance=index===''?deduction:Deduction.searchToDeduct(index)
  const found=index===''?false:true
  setState({...state,allowance,found})
}
useEffect(()=>{
    fetchData_Deductions(dispatchDeductions)
    setState({...state,allowance:deduction})
},[loading]) 
const listAllowances=state.allowance.length?
state.allowance.map(a=>{
    return(
<tr key={a._id}>
    <td>{a.id}</td>
    <td>{a.letter_id}</td>
    <td>
    <ReactTimeAgo date={a.created_date}  />
              <p className="font-italic float-right">
                  {tellTime(a.created_date)}
              </p>
              <p className="font-italic">
                   {TellDay(a.created_date)}
               </p>
    </td>
    <td>
        {
   Deduction.isDeductionStarted(a._id)?
   <p className="text-center font-weight-bold font-italic">
       
       Deduction already started check created deduction tab
       </p>:
       <ModalDeduction type='create' allowance={a} fetch={fetch} /> 
        }
    </td>
</tr>
    )
})
:
<tr>
       <td colSpan={4}>
  <p className="text-danger text-center font-weight-bold">
      No allowances completed yet 
      </p>           
       </td>
   </tr>
return (
     <div className="container">
     <div className="row">
       <div className="col-lg-3 my-auto">
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
                        <div className="widget-heading">Allowance to Deduct</div>
                        <div className="widget-subheading">Totall</div>
                    </div>
                    <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span>
                            {deduction.length}
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
                 state.found?
                 <h5 className='text-center'>
   Allowance found -{state.allowance.length}
                </h5>
         :
         <p></p>   
             }
         <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                          <th>
             # Allowance id                                
                    </th>   
                              <th>
             <FontAwesomeIcon icon={faEnvelope} className='mx-2'/>                            
                Letter id Attached                                
                              </th>
            <th>
          <FontAwesomeIcon icon={faCalendar} className='mx-2' />                        
                created
                </th>  
                <th>
          <FontAwesomeIcon icon={faCog} className='mx-2' />                        
            Start Deduction
                </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
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

export default AllowanceToDeduct
