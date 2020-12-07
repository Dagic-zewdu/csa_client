import { faBell, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { DeductionClass } from '../../controllers/Deductions'
import { UsersClass } from '../../controllers/Users'
import { LayoutContext, StoreContext } from '../contexts/contexts'
import AllowanceToDeduct from '../Deduction/AllowanceToDeduct'
import ApprovalManager from '../Deduction/ApprovalManager/ApprovalManager'
import CreatedDeduction from '../Deduction/CreatedDeduction'
import F_Employee from '../Deduction/Finance_Employee/F_Employee'
import Ft_showIncomingDeduction from '../Deduction/f_team_leader/Ft_showIncomingDeduction'
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
        itl:'',               //finance team leader
        fe:''      
    })
    const { allowances,dispatchAllowances,deductions,
        employees,users }=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,error:empError}=employees
    const {state:Users,loading:userLoading,error:userError}=users
    const {state:Deductions,loading:deductionsLoading,error:deductionError}=deductions
const Deduction=new DeductionClass(Deductions,Allowances,Employees,Users)
const newManagerDeductions=Deduction.newManagerDeductions().length  //deduction notify if new deductions is come 
const newFtlDeductions=Deduction.ftl_newIncomingDeductions().length
const newFeDeductions=Deduction.fNewEmployeeDeductions().length
const User=new UsersClass(Users,Employees)
const isAM=User.isApproval_Manager()
const isTl=User.isFinanceTeamLeader()
const isFe=User.isFinanceEmployee()
 useEffect(()=>{
  setState({...state,
    created:Deduction.userDeductions().length&&!isAM&&!isTl&&!isFe?'text-info':'',
    allowance_deduct:Deduction.userDeductions().length?'':!isAM&&!isTl&&!isFe?'text-info':'',
    am:isAM&&!isTl&&!isFe?'text-info':'',
    itl:!isAM&&isTl&&!isFe?'text-info':'',
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
     onClick={()=>setState({...state,allowance_deduct:'',created:'text-info',am:'',fe:''})}   
       >
     <FontAwesomeIcon icon={faEdit} className='fa-1x m-2x'/>
    created Deduction
     </h5> 
     </div>
     <div className="col-lg-3">
     <h5 className={"text-center "+state.allowance_deduct}
onClick={()=>setState({...state,allowance_deduct:'text-info',created:'',am:'',fe:''})}>
     <FontAwesomeIcon icon={faEdit} className='fa-1x m-2x'/>
    Allowance to deduct
     </h5> 
     </div> 
     {
         isAM?
         <div className="col-lg-3 row">
      
     <h5 className={"text-center "+state.am}
onClick={()=>setState({...state,allowance_deduct:'',created:'',am:'text-info',fe:''})}>
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
onClick={()=>setState({...state,allowance_deduct:'',created:'',am:'',itl:'text-info',fe:''})}>
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
         isFe?
         <div className="col-lg-3 row">
      
      <h5 className={"text-center "+state.fe}
 onClick={()=>setState({...state,allowance_deduct:'',created:'', am:'',itl:'',fe:'text-info'})}>
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
         <F_Employee/> 
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
