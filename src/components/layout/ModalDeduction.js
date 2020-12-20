import React, { useState } from 'react'
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';
import { faPlus, faPencilAlt, faTrash, faLayerGroup, faEdit, faEye, faChartLine, faHammer, faCalculator, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateDeduction from '../Deduction/CreateDeduction';
import ViewDetails from '../Deduction/View/ViewDetails';
import ViewProgress from '../Deduction/View/ViewProgress';
import EditDeduction from '../Deduction/EditDeduction';
import Deletededuction from '../Deduction/Deletededuction';
import Dam_takeActions from '../Deduction/ApprovalManager/Dam_takeActions';
import Forward_to_Employee from '../Deduction/f_team_leader/Forward_to_Employee';
import DeductionCalculation from '../Deduction/Finance_Employee/DeductionCalculation.js/DeductionCalculation';
import ViewCalculation from '../Deduction/View/ViewCalculation';
import ApproveCalculation from '../Deduction/f_team_leader/ApproveCalculation';
import { ViewCompleted } from '../Deduction/View/ViewCompleted';
const ModalDeduction = (props) => {
    const {  className,type } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    if(type==='create')
    {
    return (
        <div>
    <button onClick={toggle}  className='btn btn-outline-success my-2'>
        <FontAwesomeIcon icon={faPlus} className='mx-2 fa-1x' />
      start deduction
        </button>
            <Modal isOpen={modal} toggle={toggle} size='xl' className={className}>
    <ModalHeader toggle={toggle} onClick={()=>props.fetch()}> 
        <FontAwesomeIcon icon={faEdit} className='mx-2' />
            New Deduction
          </ModalHeader>
                <ModalBody>
<CreateDeduction allowance={props.allowance}/>
                </ModalBody>

            </Modal>
        </div>

    )
} 
else if(type==='view_details'){
    return(
        <div>
            <div onClick={toggle} className='btn btn-outline-success mx-2 my-2'>
                <FontAwesomeIcon icon={faEye} className='mx-2 fa-1x' />
   view Deduction
        </div>
            <Modal isOpen={modal} toggle={toggle} size='lg' className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                 onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faEye} className='mx-2' />
                View
        </ModalHeader>
                <ModalBody>
  <ViewDetails  deduction={props.deduction} am={props.am} ftli={props.ftli} fe={props.fe}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='view_progress'){
    return(
        <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-success mx-2 my-2 '
            >
  <FontAwesomeIcon icon={faChartLine} className='mx-2 fa-1x text-success' />
   view Progress
        </div>
<Modal isOpen={modal} toggle={toggle} size={'lg'} className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
        <FontAwesomeIcon icon={faChartLine} className='mx-2' />
                Progress
        </ModalHeader>
                <ModalBody>
  <ViewProgress deduction={props.deduction} />
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='edit'){
    return(
        <div>
        <div onClick={toggle}  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faPencilAlt} className='mx-2 fa-1x text-success' />
        Edit
        </div>
            <Modal isOpen={modal} toggle={toggle} size='xl'  className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
                Edit Deduction
        </ModalHeader>
                <ModalBody>
  <EditDeduction  deduction={props.deduction}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='delete'){
    return(
        <div>
            <div onClick={toggle} className=' btn btn-outline-success mx-2 my-2 ' >
        <FontAwesomeIcon icon={faTrash} className='mx-2 fa-1x' />
   Delete
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className+' dialogue'}>
                <ModalHeader toggle={toggle}  onClick={()=>props.fetch()}>
     <p className="text-danger">
     <FontAwesomeIcon icon={faTrash} className='mx-2 text-danger' />
     Deduction is flagged for deletion are you sure you want to delete    
         </p>               
        </ModalHeader>
                <ModalBody>
  <Deletededuction deduction={props.deduction} fetch={props.fetch} close={toggle} />
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='approval_manager'){
    return(
        <div>
        <div onClick={toggle}  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faHammer} className='mx-2 fa-1x text-success' />
        Take actions
        </div>
            <Modal isOpen={modal} toggle={toggle}   className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faHammer} className='mx-2' />
                Take actions
        </ModalHeader>
                <ModalBody>
  <Dam_takeActions  deduction={props.deduction}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='ftl_pending'){
    return(
        <div>
        <div onClick={toggle}  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faHammer} className='mx-2 fa-1x text-success' />
        Take actions
        </div>
            <Modal isOpen={modal} toggle={toggle}   className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faHammer} className='mx-2' />
                Take actions
        </ModalHeader>
                <ModalBody>
  <Forward_to_Employee  deduction={props.deduction}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='calculate'){
    return(
        <div>
        <div onClick={toggle}  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faCalculator} className='mx-2 fa-1x text-success' />
        Calculate
        </div>
            <Modal isOpen={modal} toggle={toggle}  size={'xl'} className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faCalculator} className='mx-2' />
                Calculate
        </ModalHeader>
                <ModalBody>
  <DeductionCalculation  deduction={props.deduction} />
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='view_calculation'){
    return(
        <div>
        <div onClick={toggle}  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faEye} className='mx-2 fa-1x text-success' />
        view calculation
        </div>
            <Modal isOpen={modal} toggle={toggle}  size={'xl'} className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faEye} className='mx-2' />
                view calculation
        </ModalHeader>
                <ModalBody>
  <ViewCalculation  deduction={props.deduction} ftl={props.ftl}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='approve_calculation'){
    return(
        <div>
        <div onClick={toggle}  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faHammer} className='mx-2 fa-1x text-success' />
        Take decision
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faEye} className='mx-2' />
                Take Decision
        </ModalHeader>
                <ModalBody>
  <ApproveCalculation  deduction={props.deduction}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='view_final'){
    return(
        <div>
        <div onClick={toggle}  className=' btn btn-outline-success mx-2 my-2 ' >
    <FontAwesomeIcon icon={faCalculator} className='mx-2 fa-1x text-success' />
        See Final result
        </div>
            <Modal isOpen={modal} toggle={toggle}  size={'xl'} className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faCalculator} className='mx-2' />
                see Final result 
        </ModalHeader>
                <ModalBody>
  <ViewCompleted  deduction={props.deduction} user={props.user}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
}

export default ModalDeduction
