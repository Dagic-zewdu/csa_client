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
                <h3 className="text-center font-weight-bold">
           {company.state[0].name}   
                    </h3> 
                 </div>   
            <div className="col-lg-6">
            <div className="card">
    <h4 className="text-center font-weight-bold">
       Allowance Information  
          </h4>
          <h5 className="text-center lead">
        Allowance id - {allowance.id} 
          </h5>    
      <h5 className="text-center lead">
        Letter id - {allowance.letter_id} 
          </h5>
          <h5 className="text-center lead">
         program- {allowance.program} 
           </h5>
           <h5 className="text-center lead">
         project Name and code- {allowance.project_name} 
           </h5>
           <h5 className="text-center lead">
          objective- {allowance.program} 
           </h5>
           <h5 className="text-center lead">
          Initial place- {allowance.initial_place} 
           </h5>
   <h5 className="text-center lead">
           Initial Date -{ToEthiopianDateSting(allowance.initial_date)} E.C <br/>
           <p className="font-italic small">
             {TellDay(allowance.initial_date)} G.C
             </p>   
            </h5>
            <h5 className="text-center lead">
            Return Date -{ToEthiopianDateSting(allowance.destination_date)} 
            <p className="font-italic small">
             {TellDay(allowance.destination_date)} G.C
             </p>
            </h5>
      </div>  
            </div>
            <div className="col-lg-6">
              <hr/>
            {
    allowance.type==='living'?
    <div className="text-center font-weight-bold card">
            Day allowance scale:{allowance.scale} <br/>
            Duration days:{calculation.durationDate(id)} <br/>
            living allowance : {allowance.living_allowance} <br/>
            climate Allowance:{allowance.climate_allowance} <br/>
            petrol and oil amount:{allowance.petrol_allowance} <br/>
            reserve amount:{allowance.reserve_amount} <br/>
            <hr/>
            <h5 className="font-weight-bold">
            Totall:{allowance.totall_amount}
        </h5>
     <hr/>
         </div>:
    allowance.type==='day'?
    <div className="card text-center font-weight-bold">
        <hr/>
        Day allowance scale:{allowance.scale} <br/>
        Breakfast amount ={allowance.breakfast} <br/>
        Lunch amount={allowance.lunch} <br/>
        Dinner amount={allowance.dinner} <br/>
        Bed amount={allowance.bed} <br/>
        climate allowance={allowance.climate_allowance} <br/>
        petrol and oil amount={allowance.petrol_allowance} <br/>
        reserve amount={allowance.reserve_amount} <br/>
        Totall Day allowance:{allowance.day_allowance}
        <hr/>
     <h5 className="font-weight-bold">
       Totall:{allowance.totall_amount}
       </h5>   
        </div>:
    <p></p>
   } 
            </div>
            <div className="col-lg-6">
<p className="font-weight-bold">
    Employee name- {calculation.Name(emp_id)}
</p>
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
            <h6 className="text-center">
                Manager
            </h6>
         <p className="font-weight-bold">
           Manager name- {calculation.Name(allowance.approval_manager.emp_id)}  
             </p> 
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
             <div className="col-lg-6 mt-2"></div>
             <div className="col-lg-6 mt-2">
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