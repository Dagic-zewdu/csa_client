import { faBell, faCalculator, faEdit, faExclamationTriangle, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { DeductionClass } from '../../controllers/Deductions'
import { UsersClass } from '../../controllers/Users'
import { LayoutContext, StoreContext } from '../contexts/contexts'
import AllowanceToDeduct from '../Deduction/AllowanceToDeduct'
import ApprovalManager from '../Deduction/ApprovalManager/ApprovalManager'
import CompletedDeduction from '../Deduction/CompletedDeduction'
import CreatedDeduction from '../Deduction/CreatedDeduction'
import F_Employee from '../Deduction/Finance_Employee/F_Employee'
import Ft_showIncomingDeduction from '../Deduction/f_team_leader/Ft_showIncomingDeduction'
import ShowCalculated from '../Deduction/f_team_leader/ShowCalculated'
import DataLoading from '../layout/DataLoading'
import ErrorLoading from '../layout/ErrorLoading'
import Navbar from '../layout/Navbar/Navbar'
import SideNav from '../layout/SideNav/SideNav'

const Deduction=()=> {
    const [state,setState]=useState({
        collapse:'',
        created:'text-info', //controlls created deduction tab
        allowance_deduct:'', //controls allowance to deduct tab
        am:'',               //approval manager
        itl:'',               //incoming deduction for finance team leader
        fe:'',                 //finance employee
        ctl:'',                //calculated deductions for team leader
        cfe:'' 
    })
    const { allowances,dispatchAllowances,deductions,
        employees,users }=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,error:empError}=employees
    const {state:Users,loading:userLoading,error:userError}=users
    const {state:Deductions,loading:deductionsLoading,error:deductionError}=deductions
const Deduction=new DeductionClass(Deductions,Allowances,Employees,Users)
const completedDeduction=Deduction.userNewCompleted().length
const newManagerDeductions=Deduction.newManagerDeductions().length  //deduction notify if new deductions is come 
const newFtlDeductions=Deduction.ftl_newIncomingDeductions().length //incoming array of deductions length for finance team leader 
const newFtlCalculated=Deduction.ftl_newCalculated().length  //calculated array of deductions length for finance team leader
const newFtlRedone=Deduction.ftl_Redone().length //Redone array of deduction calculated
const newFeDeductions=Deduction.fNewEmployeeDeductions().length //new deductions for finance employee
const feRedone=Deduction.fe_RedoneDeductions().length  //redone deduction that to be redone
const User=new UsersClass(Users,Employees)
const isAM=User.isApproval_Manager()
const isTl=User.isFinanceTeamLeader()
const isFe=User.isFinanceEmployee()
 useEffect(()=>{
  setState({...state,
    created:Deduction.userDeductions().length&&!isAM&&!isTl&&!isFe?'text-info':'',
    allowance_deduct:Deduction.userDeductions().length?'':!isAM&&!isTl&&!isFe?'text-info':'',
    am:isAM&&!isTl&&!isFe?'text-info':'',
    itl:!isAM&&isTl&&!isFe?newFtlDeductions?'text-info':newFtlCalculated||newFtlRedone?'':'text-info':'',
    ctl:!isAM&&isTl&&!isFe?newFtlDeductions?'':newFtlCalculated||newFtlRedone?'text-info':'':'',
   fe:!isAM&&!isTl&&isFe?'text-info':''
})
 },[deductionsLoading])
 return (
         <div className={"app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header "+state.collapse}>
       <LayoutContext.Provider value={{uiContents:state,togglers:setState}}>
       <Navbar/>
       <div className="app-main">
        <SideNav/>
        <div className="app-main__outer">
                    <div className="app-main__inner">
                    <div className="container">
     <div className="row">
     <div className="col-lg-3">
     <h5 className={"text-center "+state.created}
     onClick={()=>setState({...state,allowance_deduct:'',created:'text-info',am:'',fe:'',ctl:'',cfe:''})}   
       >
     <FontAwesomeIcon icon={faEdit} className='fa-1x m-2x'/>
    created Deduction
     </h5>
     {
         completedDeduction?
         <h5 className=" mx-2 font-weight-bold text-center">
   <FontAwesomeIcon icon={faBell} className='fa-1x m-2x text-success'/>
    {completedDeduction}
       </h5>  :
       <p></p>
     }  
     </div>
     <div className="col-lg-3">
     <h5 className={"text-center "+state.allowance_deduct}
onClick={()=>setState({...state,allowance_deduct:'text-info',created:'',am:'',fe:'',ctl:'',cfe:''})}>
     <FontAwesomeIcon icon={faEdit} className='fa-1x m-2x'/>
    Allowance to deduct
     </h5> 
     </div>
    
     {
         isAM?
         <div className="col-lg-3 row">
      
     <h5 className={"text-center "+state.am}
onClick={()=>setState({...state,allowance_deduct:'',created:'',am:'text-info',fe:'',ctl:'',cfe:''})}>
     <FontAwesomeIcon icon={faEdit} className='fa-1x m-2x'/>
    Approve Deductions
     </h5>
     {
         newManagerDeductions?
         <h5 className=" mx-2 font-weight-bold text-center">
   <FontAwesomeIcon icon={faBell} className='fa-1x m-2x text-success'/>
    {newManagerDeductions}
       </h5>  :
       <p></p>
     } 
</div> :
     <p></p>
     }
     {
         isTl?
         <div className="col-lg-3 row">
      
     <h5 className={"text-center "+state.itl}
onClick={()=>setState({...state,allowance_deduct:'',created:'',am:'',itl:'text-info',fe:'',ctl:'',cfe:''})}>
     <FontAwesomeIcon icon={faEdit} className='fa-1x m-2x'/>
    Incoming Deductions
     </h5>
     {
         newFtlDeductions?
         <h5 className=" mx-2 font-weight-bold text-center">
   <FontAwesomeIcon icon={faBell} className='fa-1x m-2x text-success'/>
    {newFtlDeductions}
       </h5>  :
       <p></p>
     } 
</div> :
     <p></p>
     }
     {
         isTl?
         <div className="col-lg-3 row">
      
     <h5 className={"text-center "+state.ctl}
onClick={()=>setState({...state,allowance_deduct:'',created:'',am:'',itl:'',fe:'',ctl:'text-info',cfe:''})}>
     <FontAwesomeIcon icon={faCalculator} className='fa-1x m-2x'/>
    Calculated Deductions
     </h5>
     {
         newFtlCalculated?
         <h5 className=" mx-2 font-weight-bold text-center">
   <FontAwesomeIcon icon={faBell} className='fa-1x m-2x text-success'/>
    {newFtlCalculated}
       </h5>  :
       newFtlRedone?
         <h5 className=" mx-2 font-weight-bold text-center">
   <FontAwesomeIcon icon={faBell} className='fa-1x m-2x text-warning'/>
    {newFtlRedone}
       </h5> :
       <p></p>
     } 
</div> :
     <p></p>
     }
     {
         isFe?
         <div className="col-lg-3 row">
      
      <h5 className={"text-center "+state.fe}
 onClick={()=>setState({...state,allowance_deduct:'',created:'', am:'',itl:'',fe:'text-info',ctl:'',cfe:''})}>
      <FontAwesomeIcon icon={faEdit} className='fa-1x m-2x'/>
     Incoming Deductions
      </h5>
      {
          newFeDeductions?
          <h5 className="mx-1 font-weight-bold text-center">
    <FontAwesomeIcon icon={faBell} className='fa-1x m-2x text-success'/>
     {newFeDeductions}
        </h5>  :
        <p></p>
      }
      {
          feRedone?
          <h5 className="mx-1 font-weight-bold text-center text-warning">
    <FontAwesomeIcon icon={faExclamationTriangle} className='fa-1x m-2x text-warning'/>
     {feRedone}
        </h5>  :
        <p></p>
      } 
 </div> :
      <p></p>  
     }
     {
         isFe?
         <div className="col-lg-3 row">
      
      <h5 className={"text-center "+state.cfe}
 onClick={()=>setState({...state,allowance_deduct:'',created:'', am:'',itl:'',fe:'',ctl:'',cfe:'text-info'})}>
      <FontAwesomeIcon icon={faPaperclip} className='fa-1x m-2x'/>
     Completed deductions
      </h5>
 </div> :
      <p></p>  
     }
     
        </div>
           </div>
        <div className="col-lg-12">
           {
          loading||empLoading||userLoading||deductionsLoading?
          <DataLoading/>:
          error||empError||userError||deductionError?
          <ErrorLoading/>:
          state.created==='text-info'?
          <CreatedDeduction/>:
          state.allowance_deduct==='text-info'?
          <AllowanceToDeduct/>:
          state.am==='text-info'?
          <ApprovalManager/>:
          state.itl==='text-info'?
          <Ft_showIncomingDeduction/>
          :state.fe==='text-info'?
         <F_Employee/> :
         state.ctl==='text-info'?
         <ShowCalculated/>:
         state.cfe==='text-info'?
          <CompletedDeduction/> 
          :<p></p>    
           }
            </div>   
                    </div>
                    </div>
       </div>
       </LayoutContext.Provider>    
        </div> 
    )
}

export default Deduction
