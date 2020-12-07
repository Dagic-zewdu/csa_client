import React, { useState } from 'react'
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowRestore, faCheckCircle,  faWindowClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import ResetPassword from '../system Admin/user/ResetPassword';
import UserAccess from '../system Admin/user/UserAccess';
import DeleteUser from '../system Admin/user/DeleteUser';

  const UserModal=(props)=> {
    const { className,type } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
     if(type==='reset'){
        return(
            <div>
                <div onClick={toggle} color="primary">
                    <FontAwesomeIcon icon={faWindowRestore} className='mx-2 fa-1x' />
       Reset password
            </div>
                <Modal isOpen={modal} toggle={toggle} className={className}>
                    <ModalHeader toggle={toggle} className='text-center'
                     onClick={()=>props.fetch()}>
                        <FontAwesomeIcon icon={faWindowRestore} className='mx-2' />
                    Reset password
            </ModalHeader>
                    <ModalBody>
            <ResetPassword  user={props.user}/>
                    </ModalBody>
    
                </Modal>
            </div>
        )
    }
    else if(type==='access'){
        return(
        <div>
                <div onClick={toggle} color="primary">
                {
           props.user.access==='activated'?
            <FontAwesomeIcon icon={faWindowClose} className='mx-2 fa-1x' />:
           <FontAwesomeIcon icon={faCheckCircle} className='mx-2 fa-1x' />
           }             
       
       {
           props.user.access==='activated'?'deactivate':'activate'
           }
            </div>
                <Modal isOpen={modal} toggle={toggle} className={className+' dialogue'}>
                    <ModalHeader toggle={toggle} className='text-center'
                     onClick={()=>props.fetch()}>
  {
           props.user.access==='activated'?
            <FontAwesomeIcon icon={faWindowClose} className='mx-2 fa-1x' />:
           <FontAwesomeIcon icon={faCheckCircle} className='mx-2 fa-1x' />
           }             
       
       {
           props.user.access==='activated'?
           <p className="text-center text-danger">
          you are about to deactivate the user are you sure
          you want to continue    
           </p>
           :
           <p className="text center text-success">
           you are about to activate the user are you sure
          you want to continue
           </p>
           }
            </ModalHeader>
                    <ModalBody>
            <UserAccess  user={props.user} fetch={props.fetch} close={toggle}/>
                    </ModalBody>
    
                </Modal>
            </div>       
        )
    }
    else if(type==='delete'){
        return(
        <div>
                <div onClick={toggle} color="primary">
            <FontAwesomeIcon icon={faTrash} className='mx-2 fa-1x' />
         Delete
            </div>
                <Modal isOpen={modal} toggle={toggle} className={className +' dialogue'}>
                    <ModalHeader toggle={toggle} className='text-center'
                     onClick={()=>props.fetch()}>
                        <FontAwesomeIcon icon={faTrash} className='mx-2' />
                    Delete user
            </ModalHeader>
                    <ModalBody>
            <DeleteUser  user={props.user} fetch={props.fetch} close={toggle}/>
                    </ModalBody>
    
                </Modal>
            </div>       
        )
    }
}

export default UserModal
