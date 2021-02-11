import { faChartLine, faEnvelope, faEye, faHammer, faPencilAlt, faPlus, faProcedures, faProjectDiagram, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import { Donothing } from '../../controllers/saveProcess';
import CreateLetters from '../letters/CreateLetters'
import DeleteLetter from '../letters/DeleteLetter';
import EditLetter from '../letters/EditLetter/EditLetter';
import LetterProgress from '../letters/LetterProgress';
import TakeActions from '../letters/TakeActions';
import ViewLetters from '../letters/ViewLetters';

const ModalLetter=({className,type,typing,stop_typing,l_id,emitter})=> {

    
    const [modal, setModal] = useState(false);
    const [size,setSize]=useState('xl')
    const [hover,sethover]=useState(false)
    const toggle = () =>{
        setModal(!modal);
      type==='create_letter'?!modal?typing():stop_typing():Donothing()
      type==='delete_letter'?!modal?Donothing():emitter():Donothing()
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
else if(type==='Create_letter')
{
    return(
      <div>
      <button className="btn btn-outline-success mx-2 my-2" onClick={toggle}>
        <FontAwesomeIcon icon={faPlus} className='mx-2'/>
        Create Letter
      </button>
            <Modal isOpen={modal} toggle={toggle} size={size}
               className={className}>
                <ModalHeader toggle={toggle}>
                    <FontAwesomeIcon icon={faEnvelope} className='mx-2' />
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
      <button className="btn btn-outline-success mx-2 my-2" onClick={toggle}>
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
      <button className="btn btn-outline-success mx-2 my-2" onClick={toggle}>
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
else if(type==='delete_letter'){
    return(
        <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-success mx-2 my-2 '
            >
                <FontAwesomeIcon icon={faTrash} className='mx-2 fa-1x' />
   Delete
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className+' dialogue'}>
                <ModalHeader toggle={toggle}>
     <p className="text-danger">
     <FontAwesomeIcon icon={faTrash} className='mx-2 text-danger' />
     Letter is flagged for deletion are you sure you want to delete    
         </p>               
        </ModalHeader>
                <ModalBody>
  <DeleteLetter _id={l_id} close={toggle}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='progress')
{
    return(
      <div>
      <button className="btn btn-outline-success mx-2 my-2" onClick={toggle}>
        <FontAwesomeIcon icon={faChartLine} className='mx-2'/>
        Progress
      </button>
            <Modal isOpen={modal} toggle={toggle} size='lg'
               className={className}>
                <ModalHeader toggle={toggle}>
                    <FontAwesomeIcon icon={faChartLine} className='mx-2' />
           Progress
            </ModalHeader>
                <ModalBody>
    <LetterProgress l_id={l_id /**letter id */}/>
                </ModalBody>

            </Modal>
        </div>   
    )
}
else if(type==='approve')
{
    return(
      <div>
      <button className="btn btn-outline-success mx-2 my-2" onClick={toggle}>
        <FontAwesomeIcon icon={faHammer} className='mx-2'/>
        Take Decision
      </button>
            <Modal isOpen={modal} toggle={toggle} size='md'
               className={className}>
                <ModalHeader toggle={toggle}>
                    <FontAwesomeIcon icon={faHammer} className='mx-2' />
           Take Decision
            </ModalHeader>
                <ModalBody>
    <TakeActions l_id={l_id /**letter id */}/>
                </ModalBody>

            </Modal>
        </div>   
    )
}
}

export default ModalLetter
