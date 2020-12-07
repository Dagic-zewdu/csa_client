import { faCheck, faComment, faEye, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { DeductionClass } from '../../../controllers/Deductions'
import { StoreContext } from '../../contexts/contexts'
import { fetchData_Deductions } from '../../fetchers/Functions/FerchDeductions'

const ViewProgress = (props) => {
    const { deduction } = props
    const { allowances, employees, users, dispatchDeductions,
        deductions } = useContext(StoreContext)
    const { state: Allowances } = allowances
    const { state: Employees } = employees
    const { state: Users } = users
    const { state: Deductions, loading } = deductions
    const Deduction = new DeductionClass(Deductions, Allowances, Employees, Users)
    const { _id: id } = deduction
    const progress = Deduction.Progress(id)
    const tellProgress = Deduction.tellDeductionProgress(id)
    const color = Deduction.deductionColor(id)
    const totallProgress = Deduction.progressTotall(id)
    useEffect(() => {
        fetchData_Deductions(dispatchDeductions)
    }, [loading, deduction, JSON.stringify(Deductions)])
    //show icon
    const showIcon = color => color === 'danger' ? <FontAwesomeIcon icon={faWindowClose} className='fa-2x mx-2 text-danger' /> :
        color === 'warning' ? <FontAwesomeIcon icon={faComment} className='fa-2x mx-2 text-warning' /> :
            color === 'primary' || color === 'success' ? <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-primary' /> :
                color === 'info' ? <FontAwesomeIcon icon={faEye} className='fa-2x mx-2 text-info' /> :
                    <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-light' />

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6">
                    <h4 className="font-weight-bold text-center">
                        Totall progress made
</h4>
                    <p className="font-weight-bold">
                        <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-info' />
    Deduction is created
</p>
                    {
                        progress > 0 && progress < 5 ?
                            <p>
                                {showIcon(color)}
     Deduction has reviewed and approved by your manager
    </p> :
                            progress === 0 ?
                                <p>
                                    {showIcon('')}
    Deduction has reviewed and approved by your manager
    </p> :
                                <p className="font-weight-bold">
                                    <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-info' />
     Deduction has reviewed and approved by your manager
    </p>
                    }
                    {
                        progress > 4 && progress < 9 ?
                            <p>
                                {showIcon(color)}
     Deduction is accepted by finance
    </p> :
                            progress < 5 ?
                                <p>
                                    {showIcon('')}
    Deduction is accepted by finance
    </p> :
                                <p className="font-weight-bold">
                                    <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-info' />
    Deduction is accepted by finance
    </p>
                    }
                    {
                        progress > 10 && progress < 13 ?
                            <p>
                                {showIcon(color)}
     Deduction is calculating
    </p> :
                            progress < 11 ?
                                <p>
                                    {showIcon('')}
    Deduction is calculating
    </p> :
                                <p className="font-weight-bold">
                                    <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-info' />
    Deduction is calculating
    </p>
                    }
                    {
                        progress > 12 && progress < 16 ?
                            <p>
                                {showIcon(color)}
     Deduction has calculated and has approved
    </p> :
                            progress < 13 ?
                                <p>
                                    {showIcon('')}
     Deduction has calculated and has approved
    </p> :
                                <p>
                                    <FontAwesomeIcon icon={faCheck} className='fa-2x mx-2 text-info' />
     Deduction has calculated and has approved
    </p>
                    }
                </div>
                <div className="col-lg-6">
                    <div className={"mb-3 widget-chart widget-chart2 text-left card card-shadow-" + color}>
                        <div className="widget-content">
                            <div className="widget-content-outer">
                                <div className="widget-content-wrapper">
                                    <div className="widget-content-left pr-2 fsize-1">
                                        <div className={"widget-numbers mt-0 fsize-3 text-" + color}>
                                            {Deduction.progressTotall(id)}%
                            </div>
                                    </div>
                                    <div className="widget-content-right w-100">
                                        <div className="progress-bar-xs progress">
                                            <div className={"progress-bar bg-" + color}
                                                role="progressbar" aria-valuenow={Deduction.progressTotall(id)}
                                                aria-valuemin={0} aria-valuemax={100}
                                                style={{ width: Deduction.progressTotall(id) + '%' }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="widget-content-left fsize-1">
                                    <div className="text-muted opacity-6">
                                        Totall progress made
                         </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h5 className={"text-center font-weight-bold mt-2 text-" + color}>
                        {tellProgress}
                    </h5>
                    {
                        progress === 2 || progress === 1 ?
                            <div className="text-center font-weight-bold mt-2 font-italic text-warning">
                                comment- {deduction.approval_manager.comment} <br />
                                <p className="float-right font-italic">
                                    from -{Deduction.Name(deduction.approval_manager.emp_id)}
                                </p>
                            </div> :
                            progress === 6 || progress === 5 ?
                                <div className="text-center font-weight-bold mt-2 font-italic text-warning">
                                    comment- {deduction.f_tl_pending.comment} <br />
                                    <p className="float-right font-italic">
                                        from -{Deduction.Name(deduction.f_tl_pending.emp_id)}
                                    </p>
                                </div> :
                                <p></p>
                    }
                </div>
            </div>
        </div>
    )
}

export default ViewProgress
