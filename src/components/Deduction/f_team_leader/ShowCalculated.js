import React, { useContext, useEffect, useState } from 'react'
import { DeductionClass } from '../../../controllers/Deductions'
import { StoreContext } from '../../contexts/contexts'
import { faBarcode, faBell, faCalculator, faCheck, faCheckCircle, faCog, faComment, faPaperPlane, faUser, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalDeduction from '../../layout/ModalDeduction'
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo'
import { TellDay, tellTime } from '../../../controllers/Date'
import { fetchData_Deductions } from '../../fetchers/Functions/FerchDeductions'

const ShowCalculated=(props)=> {
    const [state,setState]=useState({
        deductions:[],
        found:false,
        seenDeductions:[],
        newDeductions:[],
        redoneDeductions:[]
    })
    const { allowances,dispatchDeductions,deductions,employees,users }=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,error:empError}=employees
    const {state:Users,loading:userLoading,error:userError}=users
    const {state:Deductions,loading:deductionsLoading,error:deductionError}=deductions
const Deduction=new DeductionClass(Deductions,Allowances,Employees,Users)
const All=Deduction.ftl_Calulated()
const New=Deduction.ftl_newCalculated()  //array of new calculated deductions
const redone=Deduction.ftl_Redone()  //array of redone calculations
const  Seen=Deduction.ftl_CalulatedSeen() //array of seen calculations
 
const fetch=()=>fetchData_Deductions(dispatchDeductions)
  useEffect(()=>{
      fetchData_Deductions(dispatchDeductions)
  setState({...state,newDeductions:New,seenDeductions:Seen,redoneDeductions:redone})
  },[deductionsLoading,JSON.stringify(All)])
const SeenDeductions=All.length?
  state.seenDeductions.map(d=>{
      return(
     <tr key={d._id}>
    <td className="text-center">
        {d.id}
    </td>
    <td className="text-center">
        {Deduction.findAllowance(d.allowance_id)?
        Deduction.findAllowance(d.allowance_id).id:''
        }
    </td>
    <td className="text-center">
       {Deduction.Name(d.creater)} 
    </td>
    <td className='text-center'>
  {
    d.f_tl_approve.approve==='waiting'?
    <p className="text-center font-italic">
        Calculated by -{Deduction.Name(d.f_employee.emp_id)} <br/>
         Waiting to approve the calculation. <br/>
          Calculated <ReactTimeAgo date={d.f_employee.calculated_date} /> <br/>
        {TellDay(d.f_employee.calculated_date)} <br/>
        {tellTime(d.f_employee.calculated_date)}  
         </p> :
         d.f_tl_approve.approve==='Approved'?
         <p className="text-center font-italic">
          <FontAwesomeIcon icon={faCheckCircle} className='mx-2 fa-2x text-success'/>
      Approved at <ReactTimeAgo date={d.f_tl_approve.approved_date} /> <br/>
        {TellDay(d.f_tl_approve.approved_date)} <br/>
        {tellTime(d.f_tl_approve.approved_date)}
         </p>:
         d.f_tl_approve.approve==='commented'?
         <p className="text-center font-italic text-warning">
          <FontAwesomeIcon icon={faComment} className='mx-2 fa-2x text-warning'/> commented <br/>
        comment -{d.f_tl_approve.comment}  
         </p>:
         d.f_tl_approve.approve==='unApproved'?
         <p className="text-center font-italic text-danger">
<FontAwesomeIcon icon={faWindowClose} className='mx-2 fa-2x text-danger'/> unApproved <br/>
        comment -{d.f_tl_approve.comment}  
         </p>:
         <p></p>
  } 
    </td>
    <ModalDeduction type='view_calculation' fetch={fetch} deduction={d} ftl={true}/>
    {
      !d.c_seen?
      <ModalDeduction type='approve_calculation'fetch={fetch} deduction={d}/>:
      <p></p>
  }
     <td>

</td>
    </tr>
      )
  }):
  <tr>
      <td colSpan={5} className='text-center text-danger font-weight-bold'>
     No deductions to approve yet
      </td>
  </tr>  

const NewDeductions=state.newDeductions.map(d=>{
      return(
     <tr key={d._id}>
    <td className="text-center text-info font-weight-bold">
        {d.id}
    </td>
    <td className="text-center text-info font-weight-bold">
        {Deduction.findAllowance(d.allowance_id)?
        Deduction.findAllowance(d.allowance_id).id:''
        }
    </td>
    <td className="text-center font-weight-bold text-info">
       {Deduction.Name(d.creater)} 
    </td>
    <td className='text-info font-weight-bold'>
    <p className="text-center font-italic">
        Calculated by -{Deduction.Name(d.f_employee.emp_id)} <br/>
         Waiting to approve the calculation. <br/>
          Calculated <ReactTimeAgo date={d.f_employee.calculated_date} /> <br/>
        {TellDay(d.f_employee.calculated_date)} <br/>
        {tellTime(d.f_employee.calculated_date)}  
         </p> 
    </td>
    
    <td>
    <ModalDeduction type='view_calculation' fetch={fetch} deduction={d} ftl={true}/>
    </td>
    </tr>
      )
  })
  const RedoneDeductions=state.redoneDeductions.map(d=>{
    return(
   <tr key={d._id}>
  <td className="text-center text-warning font-weight-bold">
      {d.id}
  </td>
  <td className="text-center text-warning font-weight-bold">
      {Deduction.findAllowance(d.allowance_id)?
      Deduction.findAllowance(d.allowance_id).id:''
      }
  </td>
  <td className="text-center font-weight-bold text-warning">
     {Deduction.Name(d.creater)} 
  </td>
  <td className='font-weight-bold'>
     <p className="text-center text-warning font-italic">
   Comment - {d.f_tl_approve.comment}       
         </p> 
  <p className="text-center text-warning">
       Calulation is redone please review!! Calculated at
       <ReactTimeAgo date={d.f_employee.calculated_date} /> <br/>
      {TellDay(d.f_employee.calculated_date)} <br/>
      {tellTime(d.f_employee.calculated_date)}  
       </p> 
  </td>
  
  <td>
  <ModalDeduction type='view_calculation' fetch={fetch} deduction={d} ftl={true}/>
  {
      !d.c_seen?
      <ModalDeduction type='approve_calculation'fetch={fetch} deduction={d}/>:
      <p></p>
  }
 </td>
  </tr>
    )
})


    const handleSearch=(index)=>{
        const NewDeductions=index===''?New:Deduction.ftlSeacrchCalulated(index).new
        const SeenDeductions=index===''?Seen:Deduction.ftlSeacrchCalulated(index).seen
        const redoneDeductions=index===''?redone:Deduction.ftlSeacrchCalulated(index).redone
        const found=index===''?false:true
        setState({...state,newDeductions:NewDeductions,
            seenDeductions:SeenDeductions,found,redoneDeductions})   
    }
return (
                <div className="container">
     <div className="row">
       <div className="col-lg-3 my-auto">
       </div>
            <div className="col-lg-5 my-auto">
            <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input"  placeholder="Type deduction id, allowance id"
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
                        <div className="widget-heading">Deductions</div>
                        <div className="widget-subheading">Totall recieved</div>
                    </div>
                    <div className="widget-content-right">
                        <div className="widget-numbers text-white"><span>
                            {All.length}
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
         New.length?
         <h5 className="text-center font-weight-bold text-info">
             <FontAwesomeIcon icon={faBell} className='mx-2 text-info' />
             {New.length} Deductions are calculated
             </h5>:
             <p></p>   
             }
             {
         redone.length?
         <h5 className="text-center font-weight-bold text-info">
             <FontAwesomeIcon icon={faBell} className='mx-2 text-warning' />
             {redone.length} Deductions are calculation are redone
             </h5>:
             <p></p>   
             }
         {
                 state.found?
                 <h5 className='text-center'>
   Deductions found -{state.seenDeductions.length+state.newDeductions.length+state.redoneDeductions.length}
                </h5>
         :
         <p></p>   
             }
       <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                          <th>
             <FontAwesomeIcon icon={faBarcode} className='mx-2'/>                            
                Deduction id                                
                              </th>   
                              <th>
             <FontAwesomeIcon icon={faPaperPlane} className='mx-2'/>                            
                Allowance id                                
                              </th>
<FontAwesomeIcon icon={faUser}  className='mx-2'/>
                           user
                     
              <th>
        <FontAwesomeIcon icon={faCalculator} className='mx-2'/>
    Calclulation
              </th>
                <th>
          <FontAwesomeIcon icon={faCog} className='mx-2' />                        
                Options
                </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                           {NewDeductions}
                           {RedoneDeductions}
                          {SeenDeductions}
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

export default ShowCalculated
