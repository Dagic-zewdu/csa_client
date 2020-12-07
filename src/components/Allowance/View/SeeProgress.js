import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faWindowClose, faComment, faEye } from '@fortawesome/free-solid-svg-icons'
import { AllowanceClass } from '../../../controllers/Allowance'
import { fetchData_Allowance } from '../../fetchers/Functions/FecthAllowance'
import { useEffect } from 'react'
import { StoreContext } from '../../contexts/contexts'

    const SeeProgress=(props)=> {
    const {allowance}=props
   const { allowances,dispatchAllowances,employees,users}=useContext(StoreContext)
    const Allowance=new AllowanceClass(allowances.state,employees.state,users.state) 
       const {_id:id}=allowance
    const progress=Allowance.progress(id)
    
    useEffect(()=>{
    fetchData_Allowance(dispatchAllowances)
    },[dispatchAllowances])
    //icon are shown for progress
    const showIcon=type=>type==='unApproved'?
    <FontAwesomeIcon icon={faWindowClose} className='fa-2x mx-2 text-danger' />:
    type==='commented'?
    <FontAwesomeIcon icon={faComment} className='fa-2x mx-2 text-warning'/>:
    type==='waiting'?
    <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-light' />:
    type==='Reviewed'?
    <FontAwesomeIcon icon={faEye} className='fa-2x mx-2 text-primary' />:
    <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-info' />
     const Color=type=>type==='unApproved'?
     'danger':type==='commented'?
     'warning':type==='completed'?
     'success':'info'
   return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6">
                    <h3 className="text-center">
                        Totall steps made
                    </h3>
         <p className="font-weight-bold">
         <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-info' />
         Allowance is created and send for approval
             </p>           
           {
           progress>=1?
           progress>=5?
           <p className='font-weight-bold'>
             {showIcon('right')}
          Allowance is being reviewed and approved by your Manager   
         </p>:  
         <p className='font-weight-bold'>
             {showIcon(Allowance.checkApproval(progress))}
          Allowance is being reviewed and approved by your Manager   
         </p>:
          <p>
             {showIcon('waiting')}
          Allowance is being reviewed and approved by your Manager   
         </p>
           }
           {
            progress>=5?
            progress>=11?
           <p className='font-weight-bold'>
             {showIcon('right')}
             Allowance is accepted by finance director   
         </p>:
         <p className='font-weight-bold'>
             {showIcon(Allowance.checkApproval(progress))}
             Allowance is accepted by finance director  
         </p>:
         <p >
             {showIcon('waiting')}
             Allowance is accepted by finance director   
         </p>       
           }
           {
            progress>=11?progress>=15?
           <p className='font-weight-bold'>
             {showIcon('right')}
             Allowance is calculating   
         </p>:
         <p className='font-weight-bold'>
             {showIcon(Allowance.checkApproval(progress))}
             Allowance is calculating   
         </p>:
         <p >
             {showIcon('waiting')}
             Allowance is calculating   
         </p>   
           }
           {
            progress>=15?progress>=22?
           <p className='font-weight-bold'>
             {showIcon('right')}
             Allowance is calculated and is ready for approval  
         </p>:
         <p className='font-weight-bold'>
             {showIcon(Allowance.checkApproval(progress))}
             Allowance is calculated and is ready for approval  
         </p>:
         <p>
             {showIcon('waiting')}
             Allowance is calculated and is ready for approval   
         </p>   
           }
           {
            progress===22?
         <p className='font-weight-bold'>
             {showIcon('completed')}
             Allowance is completed  contact finance department  
         </p>:
         <p>
             {showIcon('waiting')}
            Allowance is completed contact finance department  
         </p>   
           }   
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
    </div>   
    <p className={"text-center lead mt-3 text-"+
        Color(Allowance.checkApproval(progress))}>
        {Allowance.tellProgress(id)}
        </p>
        <div className="card mt-4">
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
{allowance.approval_manager.comment}
            </p>:
            progress===5?
            <p className="text-center font-italic font-weight-bold">
{allowance.f_pending_dr.comment}
            </p>
            :<p></p>
        } 
        {
       progress===22?
        <p className="text-center font-weight-bold">
You can contact finance for payment please don't forget allowance id for cross check
        </p>:
        <p></p>
        }    
            </div> 
           
                </div>
            </div>
        </div>
    )
}

export default SeeProgress
