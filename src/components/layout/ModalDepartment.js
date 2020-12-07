import React, { useState } from 'react'
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';
import { faPlus, faPencilAlt, faTrash, faLayerGroup, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBBtn } from 'mdbreact';
import CreateDepartment from '../system Admin/Department/CreateDepartment';
import EditDepartment from '../system Admin/Department/EditDepartment';
import DeleteDepartment from '../system Admin/Department/DeleteDepartment';
const ModalDepartment = (props) => {
    const {  className,type } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    if(type==='create_department')
    {
    return (
        <div>
            <MDBBtn  rounded onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPlus} className='mx-2 fa-1x' />
       Register Department
        </MDBBtn>
            <Modal isOpen={modal} toggle={toggle}  
            className={className}>
                <ModalHeader toggle={toggle} onClick={()=>props.fetch()}> 
                    <FontAwesomeIcon icon={faLayerGroup} className='mx-2' />
            New Department
          </ModalHeader>
                <ModalBody>
<CreateDepartment/>
                </ModalBody>

            </Modal>
        </div>

    )
} 
else if(type==='edit_department'){
    return(
        <div>
            <div onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPencilAlt} className='mx-2 fa-1x' />
   Edit
        </div>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                 onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
                Edit
        </ModalHeader>
                <ModalBody>
  <EditDepartment  department={props.department}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='delete_department'){
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
     Department is flagged for deletion are you sure you want to delete    
         </p>               
        </ModalHeader>
                <ModalBody>
  <DeleteDepartment department={props.department} fetch={props.fetch} close={toggle}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
}

export default ModalDepartment
