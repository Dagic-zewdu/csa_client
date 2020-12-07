import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { faPlus,  faEye,  faPaperclip, faPencilAlt, faTrash, faCity, faSun, faWindowClose, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeletePlace from '../system Admin/place//DeletePlace'
import { MDBBtn } from 'mdbreact';
import CreateClimatePlace from '../system Admin/place/ClimatePlaces/CreateClimatePlace';
import AddPlace from '../system Admin/place/ClimatePlaces/AddPlace';
import EditGeneralName from '../system Admin/place/ClimatePlaces/EditGeneralName';
import RemovePlaces from '../system Admin/place/ClimatePlaces/RemovePlaces';
const ModalClimatePlaces = (props) => {
    const {  className,type } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    if(type==='create_place')
    {
    return (
        <div>
            <MDBBtn  rounded onClick={toggle} color="primary">
                <FontAwesomeIcon icon={faPlus} className='mx-2 fa-1x' />
       create climate allowance place
        </MDBBtn>
            <Modal isOpen={modal} toggle={toggle} size={'xl'}  className={className}>
                <ModalHeader toggle={toggle}>
                    <FontAwesomeIcon icon={faSun} className='mx-2' />
            New climate allowance Place
          </ModalHeader>
                <ModalBody>
       <CreateClimatePlace fetch={props.fetch}/>
                </ModalBody>

            </Modal>
        </div>

    )
} 
else if(type==='add_place'){
    return(
        <div>
            <div onClick={toggle} className='btn btn-outline-primary my-2'>
<FontAwesomeIcon icon={faPlus} className='mx-2 fa-1x text-warning' />
   Add Place
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faPlus} className='mx-2' />
        {props.general_name}
          </ModalHeader>
                <ModalBody>
  <AddPlace general_name={props.general_name}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='edit_gname'){
    return(
        <div>
            <div onClick={toggle} className='btn btn-outline-primary my-2'>
<FontAwesomeIcon icon={faPencilAlt} className='mx-2 fa-1x' />
   Rename general place name
        </div>
            <Modal isOpen={modal} toggle={toggle} className={className+' dialogue'}>
                <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
                Edit
        </ModalHeader>
                <ModalBody>
  <EditGeneralName general_name={props.general_name}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='remove_places'){
    return(
        <div>
            <div onClick={toggle} className="btn btn-outline-danger">
    <FontAwesomeIcon icon={faWindowClose} className='mx-2 fa-1x' />
      Remove places
        </div>
            <Modal isOpen={modal} toggle={toggle} size='lg'  className={className}>
                <ModalHeader toggle={toggle}  onClick={()=>props.fetch()}>
     <p className="text-danger">
     <FontAwesomeIcon icon={faTrash} className='mx-2 text-danger' />
     Remove places from {props.general_name}    
         </p>               
        </ModalHeader>
                <ModalBody>
  <RemovePlaces level_1={props.level_1} 
                level_2={props.level_2}
                level_3={props.level_3}
                />
                </ModalBody>

            </Modal>
        </div>
    )
}
}

export default ModalClimatePlaces
