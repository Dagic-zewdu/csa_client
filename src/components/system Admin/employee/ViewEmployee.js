import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

 const ViewEmployee=(props)=> {
    return (
    <div className="main-card mb-3 card text-center"> 
        <FontAwesomeIcon icon={faUser} className='fa-5x text-info float-left'/>
        <p className="font-weight-bold">First name : {props.employee.first_name}</p>
        <p className="font-weight-bold">
            middle name : {props.employee.middle_name} 
            </p>
        <p className="font-weight-bold">
            last name : {props.employee.last_name}
            </p>
            <p className="font-weight-bold">
            Department : {props.employee.department}
            </p>
            <p className="font-weight-bold">
            sex : {props.employee.sex}
            </p>
            <p className="font-weight-bold">
            salary : {props.employee.salary}
            </p>
            <p className="font-weight-bold">
            official employee: {props.employee.official?'Yes':'No'}
            </p>
            {props.employee.official?<p className="font-weight-bold">
            position: {props.employee.position}
            </p>:
            <p></p>
            }
            <p className="font-weight-bold">
            user type: {props.employee.type}
            </p>          
    </div>
    )
}

export default ViewEmployee
