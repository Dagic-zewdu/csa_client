import axios from 'axios';
import React, { useContext, useEffect, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { Calculation } from '../../../controllers/Calculation';
import { host } from '../../config/config';
import { StoreContext } from '../../contexts/contexts';
import { userInfo } from '../../users/userInfo';
import { encryptObject} from '../../auth/encrypt' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { getDate, TellDay, toEthiopianDate, ToEthiopianDateSting } from '../../../controllers/Date';
import { useState } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
class ComponentToPrint extends React.Component {

  render() {
   const {company,allowance,calculation,id,emp_id,ethDate,date}=this.props 
    return (
      <div className="container">
            <div className="row ">
             <div className="col-lg-6">
              <p className="text-center font-italic font-weight-bold">
              Day- {ethDate} E.C <br/>
             {TellDay(date)} G.C
              </p>
              </div> 
             <div className="col-lg-12">
                <h5 className="text-center font-weight-bold">
           {company.state[0].name}   
                    </h5> 
                 </div> 
            <div className="col-lg-12">
        {
          allowance.type==='living'?
          <MDBTable hover bordered striped >
           <MDBTableHead>
             <th colSpan={2}>
             <h6 className="text-center font-weight-bold">
       Allowance Information  
          </h6>
             </th>
             <th colSpan={2}>
             <h6 className="text-center font-weight-bold">
       Calculation 
          </h6>
             </th>
           </MDBTableHead>
        <MDBTableBody>
       <tr>
         <td> Allowance id  </td>
         <td> {allowance.id}</td>
         <td className='font-weight-bold'>Day allowance scale</td>
         <td className='font-weight-bold'>{allowance.scale}</td>
         </tr> 
         <tr>
           <td>Letter id</td>
           <td>{allowance.letter_id}</td>
           <td className='font-weight-bold'>Duration days</td>
         <td className='font-weight-bold'>{calculation.durationDate(id)}</td>
           </tr>
          <tr>
            <td>program</td>
            <td>{allowance.program}</td>
            <td className='font-weight-bold'>living allowance </td>
         <td className='font-weight-bold'>{allowance.living_allowance}</td>
            </tr>
            <tr>
              <td>project Name and code</td>
              <td>{allowance.project_name}</td>
              <td className='font-weight-bold'>climate Allowance </td>
         <td className='font-weight-bold'>{allowance.climate_allowance}</td>
              </tr>
              <tr>
                <td> objective</td>
                <td>{allowance.program}</td>
                <td className='font-weight-bold'> petrol and oil amount </td>
         <td className='font-weight-bold'>{allowance.petrol_allowance}</td>
                </tr>
                <tr>
                  <td>Initial place</td>
                  <td>{allowance.initial_place}</td>
                  <td className='font-weight-bold'> reserve amount </td>
         <td className='font-weight-bold'>{allowance.reserve_amount}</td>  
                  </tr> 
               <tr>
                 <td>Destination place</td>
                 <td>{allowance.destination_place}</td>
                 <td className='font-weight-bold'> Totall </td>
         <td className='font-weight-bold'>{allowance.totall_amount}</td>  
                 </tr>  
               <tr>
                 <td>Initial Date</td>
                 <td>
          {ToEthiopianDateSting(allowance.initial_date)} E.C <br/>
           <p className="font-italic small">
             {TellDay(allowance.initial_date)} G.C
             </p>
                 </td>
                 </tr>  
                 <tr>
                   <td>Return Date</td>
                   <td>
                   Return Date -{ToEthiopianDateSting(allowance.destination_date)} 
            <p className="font-italic small">
             {TellDay(allowance.destination_date)} G.C
             </p>
                   </td>
                   </tr>   
          </MDBTableBody>   
           </MDBTable>:
           allowance.type==='day'?
           <MDBTable hover bordered striped >
           <MDBTableHead>
             <th colSpan={2}>
             <h6 className="text-center font-weight-bold">
       Allowance Information  
          </h6>
             </th>
             <th colSpan={2}>
             <h6 className="text-center font-weight-bold">
       Calculation 
          </h6>
             </th>
           </MDBTableHead>
        <MDBTableBody>
       <tr>
         <td> Allowance id  </td>
         <td> {allowance.id}</td>
         <td className='font-weight-bold'>Day allowance scale</td>
         <td className='font-weight-bold'>{allowance.scale}</td>
         </tr> 
         <tr>
           <td>Letter id</td>
           <td>{allowance.letter_id}</td>
           <td className='font-weight-bold'> Breakfast amount  </td>
         <td className='font-weight-bold'>{allowance.breakfast}</td>
           </tr>
          <tr>
            <td>program</td>
            <td>{allowance.program}</td>
            <td className='font-weight-bold'>Lunch amount </td>
         <td className='font-weight-bold'>{allowance.lunch}</td>
            </tr>
            <tr>
              <td>project Name and code</td>
              <td>{allowance.project_name}</td>
              <td className='font-weight-bold'>Dinner amount </td>
         <td className='font-weight-bold'>{allowance.dinner}</td>
              </tr>
              <tr>
                <td> objective</td>
                <td>{allowance.program}</td>
                <td className='font-weight-bold'> Bed amount </td>
         <td className='font-weight-bold'>{allowance.bed}</td>
                </tr>
                <tr>
            <td>program</td>
            <td>{allowance.program}</td>
            <td className='font-weight-bold'>living allowance </td>
         <td className='font-weight-bold'>{allowance.living_allowance}</td>
            </tr>
            <tr>
              <td>project Name and code</td>
              <td>{allowance.project_name}</td>
              <td className='font-weight-bold'>climate Allowance </td>
         <td className='font-weight-bold'>{allowance.climate_allowance}</td>
              </tr>
              <tr>
                <td> objective</td>
                <td>{allowance.program}</td>
                <td className='font-weight-bold'> petrol and oil amount </td>
         <td className='font-weight-bold'>{allowance.petrol_allowance}</td>
                </tr>
                <tr>
                  <td>Initial place</td>
                  <td>{allowance.initial_place}</td>
                  <td className='font-weight-bold'> reserve amount </td>
         <td className='font-weight-bold'>{allowance.reserve_amount}</td>  
                  </tr> 
               <tr>
                 <td>Destination place</td>
                 <td>{allowance.destination_place}</td>
                 <td className='font-weight-bold'> Totall </td>
         <td className='font-weight-bold'>{allowance.totall_amount}</td>  
                 </tr>   
          </MDBTableBody>   
           </MDBTable> :
<p></p>
        }      
             
              </div>       
            <div className="col-lg-6 font-weight-bold">
     Employee name- {calculation.Name(emp_id)}
    <div className="form-group">
<div className="input-group input-container">
				<span className="input-group-addon">
                 Signature
                    </span>
    <input type="text" className="input-field form-control"
     disabled={true} />
            </div>
            </div>
            </div>
          <div className="col-lg-6"></div>
         <div className="col-lg-6"></div>
         <div className="col-lg-6">
            <h6 className="text-center font-weight-bold">
                Manager
            </h6>
         Manager name- {calculation.Name(allowance.approval_manager.emp_id)}  
             <div className="input-group input-container">
				<span className="input-group-addon">
                 Signature
                    </span>
    <input type="text" className="input-field form-control"  disabled={true} />
            </div>    
             </div> 
           <div className="col-lg-6">
           <p className="font-weight-bold">
    calculation approval Manager-{calculation.Name(allowance.f_pending_tl.emp_id)}  
             </p>
             <div className="input-group input-container">
				<span className="input-group-addon">
                 Signature
                    </span>
    <input type="text" className="input-field form-control"
     disabled={true}/>
            </div>        
               </div>
             <div className="col-lg-6"></div>
             <div className="col-lg-6">
             <p className="text-center small font-weight-bold font-italic">
               Allowance system developed by metrix technologies
               </p>  
               </div>        
        </div>
        </div>
    );
  }
}
 
export const PrintAllowance = (props) => {
  const {allowance}=props
const [date,setDate]=useState('')
  const {allowances,users,employees,config,place,
    company}=useContext(StoreContext)
         /**calculation class */
 const {_id:id,creater:emp_id}=allowance
 const calculation=new Calculation(place.state,allowances.state,
                   employees.state,users.state,config.state[0])
    const setSeen=async ()=>{
     let data=encryptObject({...userInfo(),_id:allowance._id,all_done:true})
     const req=await axios.put(host+'/allowances',{data})   
    }
    const fecthDate=async ()=>{
      let date=await getDate()
      setDate(date)
    }
  
 var initial_date=new Date(allowance.initial_date)
 var destination_date=new Date(allowance.destination_date)
 var created_date=new Date(allowance.created_date)
    useEffect(()=>{
        if(!allowance.all_done)
          {setSeen()}
          fecthDate()
          document.title='Allowance system developed by metrix technologies'
      },[])
  const componentRef = useRef();
 const ethDate=ToEthiopianDateSting(date)
 return (
    <div>
     
      <ReactToPrint
        trigger={() => 
        <div className="container">
        <div className="row">
          <div className="col-lg-9"></div>
          <div className="col-lg-3">
            <button className="btn btn-outline-info">
              <FontAwesomeIcon icon={faPrint} className='mx-2' />
              Print
            </button>
            </div>
        </div>
      </div>
      }
        content={() => componentRef.current }
      />
      <ComponentToPrint ref={componentRef} company={company}
      allowance={allowance} calculation={calculation}
      initial_date={initial_date} destination_date={destination_date}
      id={id} emp_id={emp_id} ethDate={ethDate} date={date}
      />
    </div>
  );
}