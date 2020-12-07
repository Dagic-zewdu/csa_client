import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import {   faPencilAlt, faCog, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditConfig from '../system Admin/configuration/EditConfig';
const ModalConfig = (props) => {
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
                Edit configuration
                <FontAwesomeIcon icon={faCog}
                 className='fa fa-business-time mx-2 fa-w-20' />
                
            </button>            
     
            <Modal isOpen={modal} toggle={toggle} size='lg' className={className}>
                <ModalHeader toggle={toggle} onClick={()=>props.fetch()} >
                    <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
           Edit
          </ModalHeader>
                <ModalBody>
       <EditConfig config={props.config}/>
                </ModalBody>

            </Modal>
        </div>

    )
}

export default ModalConfig
