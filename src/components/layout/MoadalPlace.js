import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { faPlus,  faEye,  faPaperclip, faPencilAlt, faTrash, faCity, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeletePlace from '../system Admin/place//DeletePlace'
import { MDBBtn } from 'mdbreact';
import CreatePlace from '../system Admin/place/createPlace'
import ViewPlace from '../system Admin/place/viewPlace';
import EditPlace from '../system Admin/place/EditPlace';
const ModalPlaces = (props) => {
    const {  className,type } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    if(type==='create_place')
    {
    return (
        <div>
            <MDBBtn  rounded onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPlus} className='mx-2 fa-1x' />
       create place
        </MDBBtn>
            <Modal isOpen={modal} toggle={toggle} size={'xl'}  className={className}>
                <ModalHeader toggle={toggle} onClick={()=>props.fetch()} >
                    <FontAwesomeIcon icon={faCity} className='mx-2' />
            New Place
          </ModalHeader>
                <ModalBody>
       <CreatePlace/>
                </ModalBody>

            </Modal>
        </div>

    )
} 
else if(type==='view_places'){
    return(
        <div>
            <div onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faEye} className='mx-2 fa-1x text-warning' />
   see
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className}>
                <ModalHeader toggle={toggle} className='text-center'>
                    <FontAwesomeIcon icon={faPaperclip} className='mx-2' />
        {props.places.region + ' '+ props.places.type}
          </ModalHeader>
                <ModalBody>
  <ViewPlace places={props.places}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='edit_places'){
    return(
        <div>
            <div onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPencilAlt} className='mx-2 fa-1x' />
   Edit
        </div>
            <Modal isOpen={modal} toggle={toggle} size={'xl'} className={className}>
                <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
                Edit
        </ModalHeader>
                <ModalBody>
  <EditPlace places={props.places}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='delete_places'){
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
     place is flagged for deletion are you sure you want to delete    
         </p>               
        </ModalHeader>
                <ModalBody>
  <DeletePlace places={props.places} fetch={props.fetch} close={toggle}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
}

export default ModalPlaces
