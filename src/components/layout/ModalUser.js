import React, { useState } from 'react'
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';
import { faPlus, faUser, faEye, faPaperclip, faPencilAlt, faTrash, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateEmployee from '../system Admin/employee/CreateEmployee';
import ViewEmployee from '../system Admin/employee/ViewEmployee';
import EditEmployee from '../system Admin/employee/EditEmployee';
import DeleteEmployee from '../system Admin/employee/DeleteEmployee';
import { MDBBtn } from 'mdbreact';
const ModalUser = (props) => {
    const { className,type } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    if(type==='admin_create_user')
    {
    return (
        <div>
            <MDBBtn  rounded onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPlus} className='mx-2 fa-1x' />
       Register Employee
        </MDBBtn>
            <Modal isOpen={modal} toggle={toggle} size={'lg'}  className={className}>
                <ModalHeader toggle={toggle} onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faUser} className='mx-2' />
            New Employee
          </ModalHeader>
                <ModalBody>
<CreateEmployee/>
                </ModalBody>

            </Modal>
        </div>

    )
} 
else if(type==='view_employees'){
    return(
        <div>
            <div onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faEye} className='mx-2 fa-1x text-warning' />
   see
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className}>
                <ModalHeader toggle={toggle} className='text-center'>
                    <FontAwesomeIcon icon={faPaperclip} className='mx-2' />
        {props.employee.first_name + ' '+ props.employee.middle_name}
          </ModalHeader>
                <ModalBody>
  <ViewEmployee employee={props.employee}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='edit_employees'){
    return(
        <div>
            <div onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPencilAlt} className='mx-2 fa-1x' />
   Edit
        </div>
            <Modal isOpen={modal} toggle={toggle} size={'lg'} className={className}>
                <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
                Edit
        </ModalHeader>
                <ModalBody>
  <EditEmployee employee={props.employee}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='delete_employees'){
    return(
        <div>
            <div onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faTrash} className='mx-2 fa-1x' />
   Delete
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className+' dialogue'}>
                <ModalHeader toggle={toggle}  onClick={()=>props.fetch()}>
     <p className="text-danger">
     <FontAwesomeIcon icon={faTrash} className='mx-2 text-danger' />
     Employee is flagged for deletion are you sure you want to delete    
         </p>               
        </ModalHeader>
                <ModalBody>
  <DeleteEmployee employee={props.employee} fetch={props.fetch} close={toggle}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
}

export default ModalUser
