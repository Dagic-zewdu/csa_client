import { faEnvelope, faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import { Donothing } from '../../controllers/saveProcess';
import CreateLetters from '../letters/CreateLetters'
import EditLetter from '../letters/EditLetter/EditLetter';
import ViewLetters from '../letters/ViewLetters';

const ModalLetter=({className,type,typing,stop_typing,l_id})=> {

    
    const [modal, setModal] = useState(false);
    const [size,setSize]=useState('xl')
    const [hover,sethover]=useState(false)
    const toggle = () =>{
        setModal(!modal);
      type==='create_letter'?!modal?typing():stop_typing():Donothing()
    }
    if(type==='create_letter')
    {
    return (
        <div>
        <div className="btn" onClick={toggle}
        onMouseEnter={() => sethover(true)} onMouseLeave={() => sethover(false)} 
        >
        <FontAwesomeIcon icon={faEnvelope} className='text-danger fa-2x' />
<p style={{display:hover?'':'none'}} className='font-italic font-weight-bold text-white'>
            Create a letter
        </p>
           </div>
            <Modal isOpen={modal} toggle={toggle} size={size}
               className={className}>
                <ModalHeader toggle={toggle}>
                    <FontAwesomeIcon icon={faEnvelope} className='mx-2' />
            New Letter
            </ModalHeader>
                <ModalBody>
    <CreateLetters setSize={setSize}/>
                </ModalBody>

            </Modal>
        </div>

    )
} 
else if(type==='view_letter')
{
    return(
      <div>
      <button className="btn btn-outline-info mx-2" onClick={toggle}>
        <FontAwesomeIcon icon={faEye} className='mx-2'/>
        View
      </button>
            <Modal isOpen={modal} toggle={toggle} size='lg'
               className={className}>
                <ModalHeader toggle={toggle}>
                    <FontAwesomeIcon icon={faEnvelope} className='mx-2' />
            </ModalHeader>
                <ModalBody>
    <ViewLetters l_id={l_id /**letter id */} setSize={setSize}/>
                </ModalBody>

            </Modal>
        </div>   
    )
}
else if(type==='edit_letter')
{
    return(
      <div>
      <button className="btn btn-outline-info mx-2" onClick={toggle}>
        <FontAwesomeIcon icon={faPencilAlt} className='mx-2'/>
        Edit
      </button>
            <Modal isOpen={modal} toggle={toggle} size={size}
               className={className}>
                <ModalHeader toggle={toggle}>
                    <FontAwesomeIcon icon={faEnvelope} className='mx-2' />
            </ModalHeader>
                <ModalBody>
    <EditLetter l_id={l_id /**letter id */}/>
                </ModalBody>

            </Modal>
        </div>   
    )
}
}

export default ModalLetter
