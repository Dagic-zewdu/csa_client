import { faBarcode, faBell, faCheckCircle, faCog, faComment, faHammer, faPaperPlane, faUser, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext, useEffect, useState } from 'react'
import { DeductionClass } from '../../../controllers/Deductions'
import { StoreContext } from '../../contexts/contexts'
import { fetchData_Deductions } from '../../fetchers/Functions/FerchDeductions'
import ModalDeduction from '../../layout/ModalDeduction'
import ReactTimeAgo from 'react-time-ago/commonjs/ReactTimeAgo'
import { TellDay, tellTime } from '../../../controllers/Date'

const Ft_showIncomingDeduction=()=> {
    const [state,setState]=useState({
        deductions:[],
        found:false,
        seenDeductions:[],
        newDeductions:[],
    })
    const { allowances,dispatchDeductions,deductions,employees,users }=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,error:empError}=employees
    const {state:Users,loading:userLoading,error:userError}=users
    const {state:Deductions,loading:deductionsLoading,error:deductionError}=deductions
const Deduction=new DeductionClass(Deductions,Allowances,Employees,Users)
const allDeductions=Deduction.ftl_IncomingDeductions()  //array of deductions of the manager
const seenDeductions=Deduction.ftl_seenIncomingDeductions() //array of seen deductions
const newDeductions=Deduction.ftl_newIncomingDeductions()
const emp_id=Deduction.getEmp_id()
const fetch=()=>fetchData_Deductions(dispatchDeductions)
useEffect(()=>{
    fetchData_Deductions(dispatchDeductions)
    setState({...state,seenDeductions,newDeductions})
},[deductionsLoading,JSON.stringify(allDeductions)])
    const handleSearch=(index)=>{
   const NewDeductions=index===''?newDeductions:Deduction.searchFtlIncoming(index).new
   const SeenDeductions=index===''?seenDeductions:Deduction.searchFtlIncoming(index).seen
   const found=index===''?false:true
   setState({...state,newDeductions:NewDeductions,seenDeductions:SeenDeductions,found})
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
    d.f_tl_pending.approve==='waiting'?
    <p className="text-center font-italic">
    Waiting for Decision
    </p>:
    d.f_tl_pending.approve==='Approved'?
    <p className="text-center font-italic">
   <FontAwesomeIcon icon={faCheckCircle} className='fa-2x text-success mx-2'/>  
     Approved <ReactTimeAgo date={d.f_tl_pending.approved_date} /> <br/>
      {TellDay(d.f_tl_pending.approved_date)} <br/>
      {tellTime(d.f_tl_pending.approved_date)} <br/>
      Assigned employee -{Deduction.Name(d.f_employee.emp_id)}
    </p>:
    d.f_tl_pending.approve==='unApproved'?
    <p className="text-center font-italic">
      <FontAwesomeIcon icon={faWindowClose} className='fa-2x text-danger mx-2' />
      un Approved <ReactTimeAgo date={d.f_tl_pending.approved_date} /> <br/>
      {TellDay(d.f_tl_pending.approved_date)} <br/>
      {tellTime(d.f_tl_pending.approved_date)} <br/> 
      Reason-{d.f_tl_pending.comment}  
    </p>:
    d.f_tl_pending.approve==='commented'?
    <p className="text-center font-italic">
      <FontAwesomeIcon icon={faComment} className='fa-2x text-warning mx-2' />
      commented <ReactTimeAgo date={d.f_tl_pending.approved_date} /> <br/>
      {TellDay(d.f_tl_pending.approved_date)} <br/>
      {tellTime(d.f_tl_pending.approved_date)} <br/> 
      comment-{d.f_tl_pending.comment}  
    </p>:
    <p></p>
    }   
    </td>
    
    <td>
<ModalDeduction type='view_details' fetch={fetch} deduction={d} ftli={true} 
  am={false} fe={false} />
{
    Deduction.Progress(d._id)<11?
    <ModalDeduction type='ftl_pending' fetch={fetch} deduction={d} />:
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
    Waiting for decision  
    </td>
    
    <td>
<ModalDeduction type='view_details' fetch={fetch} deduction={d} am={true}
     ftli={true} fe={false}/>

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
                        <div className="widget-subheading">Totall Made</div>
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
             {newDeductions.length} Deduction to take actions
             </h5>:
             <p></p>   
             }
         {
                 state.found?
                 <h5 className='text-center'>
   Deductions found -{state.seenDeductions.length+state.newDeductions.length}
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
        <FontAwesomeIcon icon={faHammer} className='mx-2'/>
        Decision made
              </th>
                <th>
          <FontAwesomeIcon icon={faCog} className='mx-2' />                        
                Options
                </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                           {NewDeductions}
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

export default Ft_showIncomingDeduction
