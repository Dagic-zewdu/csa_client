import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { faPlus,  faEye,  faPaperclip, faPencilAlt, faTrash, faCity, faUserAstronaut, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeletePlace from '../system Admin/place//DeletePlace'
import { MDBBtn } from 'mdbreact';
import CreateFieldAllowance from '../system Admin/FieldAllowance/CreateFieldAllowance';
import EditFieldAllowance from '../system Admin/FieldAllowance/EditFieldAllowance';
import DeleteFieldAllowance from '../system Admin/FieldAllowance/DeleteFieldAllowance';
const ModalFieldAllowance = (props) => {
    const {  className,type } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    if(type==='create_field_allowance')
    {
    return (
        <div>
            <MDBBtn  rounded onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPlus} className='mx-2 fa-1x' />
       create an employee with field allowance
        </MDBBtn>
            <Modal isOpen={modal} toggle={toggle}   className={className}>
                <ModalHeader toggle={toggle} onClick={()=>props.fetch()} >
                    <FontAwesomeIcon icon={faUserAstronaut} className='mx-2' />
            New employee with field allowance
          </ModalHeader>
                <ModalBody>
       <CreateFieldAllowance/>
                </ModalBody>

            </Modal>
        </div>

    )
} 

else if(type==='edit_field_allowance'){
    return(
        <div>
            <div onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPencilAlt} className='mx-2 fa-1x' />
   Edit
        </div>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
                Edit
        </ModalHeader>
                <ModalBody>
  <EditFieldAllowance employee={props.employee}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='delete_field_allowance'){
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
    <DeleteFieldAllowance employee={props.employee}
       fetch={props.fetch} close={toggle}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
}

export default ModalFieldAllowance
