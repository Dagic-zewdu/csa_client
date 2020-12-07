import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import {   faPencilAlt, faStamp  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditCompany from '../system Admin/company/EditCompany';
const ModalCompany = (props) => {
    const {  className } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    return (
        <div>
        <button type="button" data-toggle="dropdown" aria-haspopup="true"
         onClick={toggle} aria-expanded="false" className="btn-shadow btn btn-info">
                <span className="btn-icon-wrapper pr-2 opacity-7">
                <FontAwesomeIcon icon={faPencilAlt}
                 className='fa fa-business-time fa-w-20' />
                </span>
                Edit company
                
            </button>            
     
            <Modal isOpen={modal} toggle={toggle} size='xl' className={className}>
                <ModalHeader toggle={toggle} onClick={()=>props.fetch()} >
                    <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
           Edit
          </ModalHeader>
                <ModalBody>
                
       <EditCompany company={props.company}/>
                </ModalBody>

            </Modal>
        </div>

    )
}

export default ModalCompany
