import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalHeader from 'reactstrap/lib/ModalHeader';

function ModalLetter(props) {
    const {  className,type } = props;

    const [modal, setModal] = useState(false);
    const [hover,sethover]=useState(false)
    const toggle = () => setModal(!modal);
    if(type==='create_letter')
    {
    return (
        <div>
        <div className="btn" onClick={toggle}
        onMouseEnter={() => sethover(true)} onMouseLeave={() => sethover(false)} 
        >
        <FontAwesomeIcon icon={faEnvelope} className='text-danger fa-2x' />
<p style={{display:hover?'':'none'}} className='font-italic font-weight-bold'>
            Create a letter
        </p>
           </div>
            <Modal isOpen={modal} toggle={toggle} size='lg'
               className={className}>
                <ModalHeader toggle={toggle}>
                    <FontAwesomeIcon icon={faEnvelope} className='mx-2' />
            New Letter
            </ModalHeader>
                <ModalBody>
    
                </ModalBody>

            </Modal>
        </div>

    )
} 
}

export default ModalLetter
