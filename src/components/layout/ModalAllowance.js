import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { faPlus,  faEye,  faPaperclip, faPencilAlt, faTrash,  faPaperPlane, faLevelUpAlt, faChartLine, faHammer, faPen, faForward, faCalculator, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateAllowance from '../Allowance/CreateAllowance';
import SeeDetails from '../Allowance/View/SeeDetails';
import SeeProgress from '../Allowance/View/SeeProgress';
import Approve_Manager from '../Allowance/Approve_Manager';
import EditAllowance from '../Allowance/EditAllowance';
import DeleteAllowance from '../Allowance/DeleteAllowance';
import PendingDirector from '../Allowance/Finance_Director/TakeActions';
import ForwardToEmployee from '../Allowance/Finance_team_leader/Forward';
import StartCalculations from '../Allowance/Finance_Employee/StartCalculations';
import ShowCalculation from '../Allowance/Finance_Employee/ShowCalculation';
import TlApprove from '../Allowance/Finance_team_leader/TlApprove';
import DrApprove from '../Allowance/Finance_Director/DrApprove';
import { PrintAllowance } from '../Allowance/View/PrintAllowance';
const ModalAllowance = (props) => {
    const {  className,type } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    if(type==='create_allowance')
    {
    return (
        <div>
        <button className="btn btn-outline-pimary btn-info" 
        onClick={toggle}>
        <FontAwesomeIcon icon={faPlus} />
               Create Allowance
           </button>
            <Modal isOpen={modal} toggle={toggle} size='lg'
               className={className}>
                <ModalHeader toggle={toggle}  
                 onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faPaperPlane} className='mx-2' />
            New Allowance
            </ModalHeader>
                <ModalBody>
    <CreateAllowance/>
                </ModalBody>

            </Modal>
        </div>

    )
} 
else if(type==='view_details'){
    return(
        <div>
            <div onClick={toggle} color="primary"
            className=' btn btn-outline-secondary mx-2 my-2 '
            >
                <FontAwesomeIcon icon={faEye} 
                className='mx-2 fa-1x text-info' />
   view Details
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                onClick={()=>props.fetch()}
                >
                    <FontAwesomeIcon icon={faEye} className='mx-2' />
        </ModalHeader>
                <ModalBody>
  <SeeDetails allowance={props.allowance}
   pendingDirector={props.pendingDirector} 
   Manager_seen={props.Manager_seen} 
   pendingTeamLeader={props.pendingTeamLeader}
   incomingCalculations={props.incomingCalculations}
   approve_tl={props.approve_tl} adr={props.adr}
 />
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='view_progress'){
    return(
        <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-secondary mx-2 my-2 '
            >
                <FontAwesomeIcon icon={faChartLine} 
                className='mx-2 fa-1x text-info' />
   view Progress
        </div>
            <Modal isOpen={modal} toggle={toggle} size={'lg'} className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                 onClick={()=>props.fetch()}>
                    <FontAwesomeIcon icon={faChartLine} className='mx-2' />
                Progress
        </ModalHeader>
                <ModalBody>
  <SeeProgress allowance={props.allowance} employees={props.employees}
   users={props.users} allowances={props.allowances}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='manager_approve'){
    return(
        <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-secondary mx-2 my-2 '
            >
                <FontAwesomeIcon icon={faHammer} 
                className='mx-2 fa-1x text-info' />
        Take Decision
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                 onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faHammer} className='mx-2' />
                Make Decision
        </ModalHeader>
                <ModalBody>
  <Approve_Manager allowance={props.allowance}
       Manager_seen={props.Manager_seen}
        />
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='edit_allowance'){
    return(
        <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-secondary mx-2 my-2 '
            >
                <FontAwesomeIcon icon={faPencilAlt} 
                className='mx-2 fa-1x text-info' />
        Edit
        </div>
            <Modal isOpen={modal} toggle={toggle} size='lg'  className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                 onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faPencilAlt} className='mx-2' />
                Edit
        </ModalHeader>
                <ModalBody>
  <EditAllowance allowance={props.allowance}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='delete_allowance'){
    return(
        <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-secondary mx-2 my-2 '
            >
                <FontAwesomeIcon icon={faTrash} className='mx-2 fa-1x text-info' />
   Delete
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className+' dialogue'}>
                <ModalHeader toggle={toggle}  onClick={()=>props.fetch()}>
     <p className="text-danger">
     <FontAwesomeIcon icon={faTrash} className='mx-2 text-danger' />
     Allowance is flagged for deletion are you sure you want to delete    
         </p>               
        </ModalHeader>
                <ModalBody>
  <DeleteAllowance allowance={props.allowance} 
      fetch={props.fetch} close={toggle}/>
                </ModalBody>

            </Modal>
        </div>
    )
}
else if(type==='director_pending_approve'){
    return(
    <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-secondary mx-2 my-2 '
            >
                <FontAwesomeIcon icon={faHammer} 
                className='mx-2 fa-1x text-info' />
        Take Decision
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                 onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faHammer} className='mx-2' />
                Make Decision
        </ModalHeader>
                <ModalBody>
  <PendingDirector allowance={props.allowance}/>
                </ModalBody>

            </Modal>
        </div>    
    )
}
else if(type==='tl_pending_approve'){
    return(
    <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-secondary mx-2 my-2 '
            >
                <FontAwesomeIcon icon={faForward} 
                className='mx-2 fa-1x text-info' />
        Assign employee for calculation
        </div>
            <Modal isOpen={modal} toggle={toggle}  className={className}>
                <ModalHeader toggle={toggle} className='text-center'
                 onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faForward} className='mx-2' />
            Forward
        </ModalHeader>
                <ModalBody>
  <ForwardToEmployee allowance={props.allowance}/>
                </ModalBody>

            </Modal>
        </div>    
    )
}
else if(type==='start'){
    return(
    <div>
        <div onClick={toggle} color="primary"
            className=' btn btn-outline-secondary mx-2 my-2 '
            >
        <FontAwesomeIcon icon={faCalculator} 
        className='mx-2 fa-1x text-info' />
        Do calculation
        </div>
            <Modal isOpen={modal} toggle={toggle} size='xl'  
            className={className}>
    <ModalHeader toggle={toggle} className='text-center'
            onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faCalculator} className='mx-2' />
            Do Calculation
        </ModalHeader>
                <ModalBody>
  <StartCalculations allowance={props.allowance}/>
                </ModalBody>

            </Modal>
        </div>    
    )
}
else if(type==='see_calculations'){
    return(
    <div>
<div onClick={toggle} color="primary"className=' btn btn-outline-secondary mx-2 my-2 '>
        <FontAwesomeIcon icon={faCalculator} 
        className='mx-2 fa-1x text-info' />
        See Calculations
        </div>
<Modal isOpen={modal} toggle={toggle} size='lg'  className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faCalculator} className='mx-2' />
        See Calculation
        </ModalHeader>
                <ModalBody>
  <ShowCalculation allowance={props.allowance} tl={props.tl}   director={props.director}/>
                </ModalBody>

            </Modal>
        </div>    
    )
}
else if(type==='approve_tl'){
    return(
    <div>
<div onClick={toggle} color="primary"className=' btn btn-outline-secondary mx-2 my-2 '>
        <FontAwesomeIcon icon={faHammer} 
        className='mx-2 fa-1x text-info' />
        Take actions
        </div>
<Modal isOpen={modal} toggle={toggle} className={className}>
    <ModalHeader toggle={toggle} className='text-center'
     onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faCalculator} className='mx-2' />
        Take actions
        </ModalHeader>
                <ModalBody>
  <TlApprove allowance={props.allowance}  />
                </ModalBody>

            </Modal>
        </div>    
    )
}
/**approve finance director */
else if(type==='approve_dr'){
    return(
    <div>
<div onClick={toggle} color="primary"className=' btn btn-outline-secondary mx-2 my-2 '>
        <FontAwesomeIcon icon={faHammer} className='mx-2 fa-1x text-info' />
        Take actions
        </div>
<Modal isOpen={modal} toggle={toggle} className={className}>
    <ModalHeader toggle={toggle} className='text-center'
     onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faCalculator} className='mx-2' />
        Take actions
        </ModalHeader>
                <ModalBody>
  <DrApprove allowance={props.allowance}  />
                </ModalBody>

            </Modal>
        </div>    
    )
}
else if(type==='see_final'){
    return(
    <div>
<div onClick={toggle} color="primary"className=' btn btn-outline-secondary mx-2 my-2 '>
        <FontAwesomeIcon icon={faCalculator} 
        className='mx-2 fa-1x text-info' />
        See Final result
        </div>
<Modal isOpen={modal} toggle={toggle} size='lg'  className={className}>
    <ModalHeader toggle={toggle} className='text-center' onClick={()=>props.fetch()}>
     <FontAwesomeIcon icon={faCalculator} className='mx-2' />
        
        </ModalHeader>
                <ModalBody>
  <PrintAllowance allowance={props.allowance}/>
                </ModalBody>

            </Modal>
        </div>    
    )
}
}

export default ModalAllowance
