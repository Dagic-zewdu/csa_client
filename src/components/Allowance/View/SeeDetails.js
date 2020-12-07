import React, { useEffect, useContext } from 'react'
import { userInfo } from '../../users/userInfo'
import axios from 'axios'
import { encryptObject } from '../../auth/encrypt'
import { host } from '../../config/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { StoreContext } from '../../contexts/contexts'
import { EmployeeClass } from '../../../controllers/Employees'
import { AllowanceClass } from '../../../controllers/Allowance'
import { TellDay, ToEthiopianDateSting } from '../../../controllers/Date'
   const SeeDetails=(props)=> {
       const {allowance,Manager_seen,pendingDirector,approve_tl,
        pendingTeamLeader,incomingCalculations,adr}=props
        
      const {seen}=allowance.approval_manager
      const {seen:PendingDirectorView}=allowance.f_pending_dr
      const {seen:PendingTlView}=allowance.f_pending_tl
      const {seen:IncomingCalculationView}=allowance.f_pending_emp
      const {seen:tlApproveSeen}=allowance.f_approve_tm
      const {seen:drApproveSeen}=allowance.f_approve_dr
   /**Employee data */
   const {employees,allowances,users}=useContext(StoreContext)
   const Employee=new EmployeeClass(employees.state)
      /**Approval manager set seen */
      const encrypt=encryptObject({
        ...userInfo(),_id:allowance._id,
        approval_manager:{
          ...allowance.approval_manager,
          seen:true,
          seen_date:Date.now()
            }     
      })
/**date */
var initial_date=new Date(allowance.initial_date)
var destination_date=new Date(allowance.destination_date)
var created_date=new Date(allowance.created_date)
/**allowance class */
  const {state:Allowances}=allowances
    const {state:Employees}=employees
     const {state:Users}=users 
     const Allowance=new AllowanceClass(Allowances,Employees,Users)
     const {_id:id}=allowance
        const progress=Allowance.progress(id)
      /**Finance Director set seen */
      const p_d_seen=encryptObject({
        ...userInfo(),_id:allowance._id,
        f_pending_dr:{
          ...allowance.f_pending_dr,
          seen:true,
          seen_date:Date.now()
        }
      })
      /**Finance team leader set seen */
      const p_tl_seen=encryptObject({
        ...userInfo(),_id:allowance._id,
        f_pending_tl:{
          ...allowance.f_pending_tl,
          seen:true,
          seen_date:Date.now()
        }
      })
      const calculation_seen=encryptObject({
        ...userInfo(),_id:allowance._id,
        f_pending_emp:{
          ...allowance.f_pending_emp,
          seen:true,
          seen_date:Date.now()
        }
      })
      const approveTl=encryptObject({
        ...userInfo(),_id:allowance._id,
        f_approve_tm:{
          ...allowance.f_approve_tm,
          seen : true ,
          seen_date:Date.now()
        }
      })
      const approveDr=encryptObject({
        ...userInfo(),_id:allowance._id,
        f_approve_dr:{
          ...allowance.f_approve_dr,
           seen:true,
          seen_date:Date.now()
        }

      })
      useEffect(()=>{
        const saveSeen=async (data)=>{
          const req=await axios.put(host+'/allowances',{data})
      }
      if(Manager_seen&&!seen){
        saveSeen(encrypt) 
         }
      if(pendingDirector&&!PendingDirectorView){
       saveSeen(p_d_seen)
      }
      if(!PendingTlView&&pendingTeamLeader){
        saveSeen(p_tl_seen)
      }
      if(!IncomingCalculationView&&incomingCalculations){
        saveSeen(calculation_seen)
      }
      if(approve_tl&&!tlApproveSeen){
    saveSeen(approveTl)
      }
      if(adr&&!drApproveSeen){
     saveSeen(approveDr)
      }   
       },[])
       const Color=type=>type==='unApproved'?
       'danger':type==='commented'?
       'warning':type==='completed'?
       'success':'info'
    return (
        <div className="container">
            <div className="row">
          <div className="col-lg-6">
         <p className="font-italic">
           <FontAwesomeIcon icon={faUser} className='mx-2 fa-2x' />
         {Employee.Name(allowance.creater)}  
           </p>   
            </div>
            <div className="col-lg-6">
         <p className="font-italic">
           <FontAwesomeIcon icon={faCalendar} className='mx-2 fa-2x' />
         created Date-{created_date.toUTCString()}  
           </p>   
            </div>   
                <div className="col-lg-12">
      <div className="card">
      <h5 className="text-center lead">
        Letter id - {allowance.letter_id} 
          </h5>
          <h5 className="text-center lead">
         program- {allowance.program} 
           </h5>
           <h5 className="text-center lead">
         project Name and code- {allowance.project_name} 
           </h5>
           <h5 className="text-center lead">
          objective- {allowance.objective} 
           </h5>
           <h5 className="text-center lead">
          Initial place- {allowance.initial_place} 
           </h5>
           <h5 className="text-center lead">
          Destination place- {allowance.destination_place} 
           </h5>
            <h5 className="text-center lead">
           Initial Date -{ToEthiopianDateSting(allowance.initial_date)} E.C <br/>
           <p className="font-italic small">
             {TellDay(allowance.initial_date)} G.C
             </p>   
            </h5>
            <h5 className="text-center lead">
            Return Date -{ToEthiopianDateSting(allowance.destination_date)} 
            <p className="font-italic small">
             {TellDay(allowance.destination_date)} G.C
             </p>
            </h5>
      </div>
                </div>
                <div className="col-lg-12 mt-2">
                <div className="card">
            {
        progress===2?
        <p className="text-align-right font-italic">
   from-{Allowance.Name(allowance.approval_manager.emp_id)}
            </p>:
            <p></p>
            }
       
        {
            progress===2?
            <p className="text-center font-italic font-weight-bold">
{allowance.f_pending_dr.comment}
            </p>:
            progress===5?
            <p className="text-center font-italic font-weight-bold">
{allowance.f_pending_dr.comment}
            </p>
            :<p></p>
        }
               
            </div> 
           
                </div>   
                <div className="col-lg-6">
  <div className={"mb-3 widget-chart widget-chart2 text-left card card-shadow-"+
          Color(Allowance.checkApproval(progress))}>
        <div className="widget-content">
            <div className="widget-content-outer">
                <div className="widget-content-wrapper">
                    <div className="widget-content-left pr-2 fsize-1">
                        <div className={"widget-numbers mt-0 fsize-3 text-"+ 
                        Color(Allowance.checkApproval(progress))}>
                            {Allowance.totallProgress(id)}%
                            </div>
                    </div>
                    <div className="widget-content-right w-100">
                        <div className="progress-bar-xs progress">
        <div className={"progress-bar bg-"+Color(Allowance.checkApproval(progress))}
         role="progressbar"  aria-valuenow={Allowance.totallProgress(id)} aria-valuemin="0"
          aria-valuemax="100" style={{width: Allowance.totallProgress(id)+'%'}}></div>
    </div>
                    </div>
                </div>
                <div className="widget-content-left fsize-1">
                    <div className="text-muted opacity-6">Totall progress made </div>
                </div>
            </div>
        </div>
    </div>:
    <p></p>    
                </div>
                <div className="col-lg-6">
    <p className="text-center font-italic font-weight-bold">
      from Department {Allowance.Department(allowance.creater)}
    </p>
    
                </div>
                
            </div>
        </div>
    )
}

export default SeeDetails
