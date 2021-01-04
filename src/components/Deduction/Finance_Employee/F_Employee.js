import { faBarcode, faBell, faCalculator, faCheckCircle, faCog, faComment, faExclamationTriangle, faHammer, faPaperPlane, faPencilAlt, faUser, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext, useEffect, useState } from 'react'
import { DeductionClass } from '../../../controllers/Deductions'
import { StoreContext } from '../../contexts/contexts'
import { fetchData_Deductions } from '../../fetchers/Functions/FerchDeductions'
import ModalDeduction from '../../layout/ModalDeduction'
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo'
import { TellDay, tellTime } from '../../../controllers/Date'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

const F_Employee=()=> {
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
const allDeductions=Deduction.fEmployeeDeductions()  //array of deductions of the employee
const seenDeductions=Deduction.fSeenEmployeeDeductions() //array of seen deductions
const newDeductions=Deduction.fNewEmployeeDeductions()
const redoneDeductions=Deduction.fe_RedoneDeductions()
const emp_id=Deduction.getEmp_id()
const fetch=()=>fetchData_Deductions(dispatchDeductions)

useEffect(()=>{
    fetchData_Deductions(dispatchDeductions)
    setState({...state,seenDeductions,newDeductions,redoneDeductions})
},[deductionsLoading,JSON.stringify(allDeductions)])
    const handleSearch=(index)=>{
   const NewDeductions=index===''?newDeductions:Deduction.searchFemployee(index).new
   const SeenDeductions=index===''?seenDeductions:Deduction.searchFemployee(index).seen
   const RedoneDeductions=index===''?redoneDeductions:Deduction.searchFemployee(index).redone
   const found=index===''?false:true
   setState({...state,newDeductions:NewDeductions,seenDeductions:SeenDeductions,found,redoneDeductions:RedoneDeductions})
    }
  const SeenDeductions=allDeductions.length?
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
       d.f_employee.calculated?
       d.f_employee.save_options==='draft'?
       <p className="text-center font-italic">
        Calculated <ReactTimeAgo date={d.f_employee.calculated_date} /> save as a draft <br/>
        {TellDay(d.f_employee.calculated_date)} <br/>
        {tellTime(d.f_employee.calculated_date)}        
           </p>:
       d.f_employee.save_options==='Approve'||d.f_employee.save_options==='approve'?    
    <p className="text-center font-italic">
        calculation is done <ReactTimeAgo date={d.f_employee.calculated_date} /> sent for approval  <br/>
        {TellDay(d.f_employee.calculated_date)} <br/>
        {tellTime(d.f_employee.calculated_date)} 
        </p>:
      <p></p>:
     <p className="text-center font-italic">
         Waiting to do the calculation. Accepted
          <ReactTimeAgo date={d.f_employee.accepted_date} />   <br/>
        {TellDay(d.f_employee.accepted_date)} <br/>
        {tellTime(d.f_employee.accepted_date)}  
         </p>    
    }   
    </td>
    
    <td>
<ModalDeduction type='view_details' fetch={fetch} deduction={d} ftli={false} 
      am={false} fe={true}/>
{
    Deduction.Progress(d._id)===11?
      <Link to={'/deduction/'+d._id}>
      <div  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faCalculator} className='mx-2 fa-1x text-success' />
        Calculate
        </div>
    </Link> :
    Deduction.Progress(d._id)===12||Deduction.Progress(d._id)===14?
    <Link to={'/editDeduction/'+d._id}>
      <div  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faPencilAlt} className='mx-2 fa-1x text-success' />
        Edit Calculation
        </div>
    </Link>:
    <p></p>  
}
{
    d.f_employee.calculated?
    <ModalDeduction type='view_calculation' fetch={fetch} deduction={d} ftl={false}/>:
    <p></p>
}
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
         Waiting to do the calculation. Accepted <ReactTimeAgo date={d.f_employee.accepted_date} /> <br/>
        {TellDay(d.f_employee.accepted_date)} <br/>
        {tellTime(d.f_employee.accepted_date)}  
         </p> 
    </td>
    
    <td>
<ModalDeduction type='view_details' fetch={fetch} deduction={d} am={false} ftli={false} fe={true}/>

    </td>
    </tr>
      )
  })

const redone=state.redoneDeductions.map(d=>{
    return(
   <tr key={d._id}>
  <td className="text-center text-warning">
      {d.id}
  </td>
  <td className="text-center text-warning">
      {Deduction.findAllowance(d.allowance_id)?
      Deduction.findAllowance(d.allowance_id).id:''
      }
  </td>
  <td className="text-center  text-warning">
     {Deduction.Name(d.creater)} 
  </td>
  <td className='text-center'>
   <p className="text-warning font-italic font-weight-bold">
       calculation need to be redone again <br/>
       comment-{d.f_tl_approve.comment} <br/>
       commented by your finace team leader -{Deduction.Name(d.f_tl_pending.emp_id)}
   </p>
  </td>
  
  <td>
<ModalDeduction type='view_details' fetch={fetch} deduction={d} ftli={false} 
    am={false} fe={true}/>
 <Link to={'/editDeduction/'+d._id}>
    <div  className=' btn btn-outline-success mx-2 my-2 ' >
  <FontAwesomeIcon icon={faPencilAlt} className='mx-2 fa-1x text-success' />
      Edit Calculation
      </div>
  </Link>
{
  d.f_employee.calculated?
  <ModalDeduction type='view_calculation' fetch={fetch} deduction={d} ftl={false}/>:
  <p></p>
}
</td>
  </tr>
    )
})
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
                            {allDeductions.length}
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
         newDeductions.length?
         <h5 className="text-center font-weight-bold text-info">
             <FontAwesomeIcon icon={faBell} className='mx-2 text-info' />
             {newDeductions.length} Deductions to do calculation
             </h5>:
             <p></p>   
             }
             {
         redoneDeductions.length?
         <h5 className="text-center font-weight-bold text-warning">
             <FontAwesomeIcon icon={faExclamationTriangle} className='mx-2 text-warning' />
             {redoneDeductions.length} Deductions need to calculate again please review!!
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
                           {redone}
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

export default F_Employee
