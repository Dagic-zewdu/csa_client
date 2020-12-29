import { faCalendar, faCalendarCheck, faMap, faPaperPlane, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import React, { Component } from 'react';
import { getDate, TellDay, ToEthiopianDateSting } from '../../../controllers/Date';

class PrintUserDeduction extends Component {
    
    render() {
        const {deduction,Calculation,findSpendingDay,isFieldEmployee,isOfficial,company,prePaid,date}=this.props
        const {_id:id}=deduction
        const {breakfast:iBreakfast,lunch:iLunch,dinner:iDinner,bed:iBed}=deduction.c_initial_day
        const {breakfast:rBreakfast,lunch:rLunch,dinner:rDinner}=deduction.c_return_day
        return (
            <div className="container">
            <div className="row">
                
           <div className="col-lg-12">
           <h4 className="text-center font-weight-bold">
           {company}   
                    </h4>
               <h6 className="text-center">
               <FontAwesomeIcon icon={faUser} className='fa-1x mx-2 ' />
               Employee information    
               </h6>
            <p className="text-center font-weight-bold">
            Name- {Calculation.Name(deduction.creater)} <br/>
           Department -{Calculation.Department(deduction.creater)} <br/>
           Is Employee official?-{isOfficial?'yes':'No'} <br/>
           Is Employe project allowance?-{isFieldEmployee?'yes':'no'} <br/>
           salary-{Calculation.Salary(deduction.creater)}
           </p>  
           <p className="float-right font-italic">
 <FontAwesomeIcon icon={faCalendar} className='mx-2'/> Date-{ToEthiopianDateSting(date)} E.c <br/>
<FontAwesomeIcon icon={faCalendar} className='mx-2'/> Date-{TellDay(date)} G.c <br/>
              # Deduction id-{deduction.id} <br/>
              # Allowance id:{Calculation.findAllowance(deduction.allowance_id)?
            Calculation.findAllowance(deduction.allowance_id).id:''
        } <br/>
              # created date -{TellDay(deduction.created_date)}   
    
               </p>   
           </div>     
                <div className="col-lg-12">
                    <h6 className="text-center">
                        Initial day
                    </h6>
    <MDBTable striped bordered className='table table-condensed'>
       <MDBTableHead>
<tr>
  <th>
       initial date
  </th>
  <th>
   initial Time
    </th>
    <th>
       Allowance situation
    </th>
    <th>
       User Entered place
    </th>
    <th>
       Day allowance
    </th>
 
    <th>
       Climate Allowance
    </th>
</tr>
       </MDBTableHead>
       <MDBTableBody>
    <tr>
      <td rowSpan={4}> 
        {/**initial date */}
        {ToEthiopianDateSting(deduction.initial_date)}
        </td>
      <td rowSpan={4}>
        {/**initial time */}
        {deduction.initial_time.hour}:{deduction.initial_time.min<10?
        '0'+deduction.initial_time.min:deduction.initial_time.min
        }
      </td>
      <td>Breakfast</td>
      <td>
        {/**place */}
        {deduction.initial_day.breakfast}
        </td>
     <td>
        {/**Day Allowance show */}
        {iBreakfast.scale}
      </td>
      <td>
   {/**climate place to calculate */}     
   {iBreakfast.c_scale}
      </td>
    </tr>
    <tr>
      <td>lunch</td>
      <td>
        {/**user entered place */}
        {deduction.initial_day.lunch}
        </td>
     <td>
        {/**Day Allowance show */}
        {iLunch.scale}
      </td>
      <td>
   {/**climate place to calculate */}     
   {iLunch.c_scale}
      </td>
    </tr>
    <tr>
      <td>Dinner</td>
      <td>
        {/**user entered place */}
        {deduction.initial_day.dinner}
        </td>
      
     <td>
        {/**Day Allowance show */}
        {iDinner.scale}
      </td>
      <td>
   {/**climate place to calculate */}     
   {iDinner.c_scale}
      </td>
    </tr>
    <tr>
      <td>Bed</td>
      <td>
        {/**user entered place */}
        {deduction.initial_day.bed}
        </td>
      
     <td>
        {/**Day Allowance show */}
        {iBed.scale}
      </td>
      <td>
   {/**climate place to calculate */}     
   {iBed.c_scale}
      </td>
    </tr>  
       </MDBTableBody>
       </MDBTable>          
              </div>
             <div className="col-lg-12">
             {
          deduction.spending_days.length?
          <div className="col-lg-12">
   <h6 className="text-center">
     spending days
     </h6>
     <MDBTable striped bordered className="table table-condensed" >
       <MDBTableHead>
<tr>
  <th>
       Duration date
  </th>
  <th>
       Duration days
    </th>
    <th>
       Allowance situation
    </th>
    <th>
       User Entered place
    </th>
    <th>
       Day allowance
    </th>
 
    <th>
       Climate Allowance
    </th>
</tr>
       </MDBTableHead>
       {
        deduction.spending_days.map(d=>{
          return(
       <MDBTableBody>
      
         <tr key={d._id}>
           <td rowSpan={4}>
           {ToEthiopianDateSting(Calculation.sFromDate(id,d._id))}- to -
           {ToEthiopianDateSting(Calculation.sUptoDate(id,d._id))}
           </td>
           <td rowSpan={4}>
    <h5 className="font-weight-bold">
    {findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').duration:0}
    </h5>
           </td>
           <td>Breakfast</td>
           <td>
       { d.breakfast}
             </td>
      <td>
   {findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').scale:0}          
             </td>
             <td>
{findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').c_scale:0}          
             </td>
           </tr>
           <tr>
             <td>Lunch</td>
             <td>
  {d.lunch}
             </td>
             <td>
   {findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').scale:0}          
             </td>
             <td>
{findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').c_scale:0}          
             </td>
           </tr>
           <tr>
             <td>Dinner</td>
             <td>
  {d.dinner}
             </td>
      
             <td>
   {findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').scale:0}          
             </td>
             <td>
{findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').c_scale:0}          
             </td>
           </tr>
           <tr>
             <td>Bed</td>
             <td>
  {d.bed}
             </td>
      
             <td>
   {findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').scale:0}          
             </td>
             <td>
{findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').c_scale:0}          
             </td>
           </tr> 
           </MDBTableBody>
          )
        })
      }   
     
       </MDBTable>          
        </div>:
    <p></p>
        }
        {/**return day */}
        <div className="col-lg-12 my-2">
   <h6 className="text-center">
     Return Day
     </h6>
     <MDBTable hover striped bordered className='table table-condensed'>
       <MDBTableHead>
<tr>
  <th>
       Return date
  </th>
  <th>
       Return Time
    </th>
    <th>
       Allowance situation
    </th>
    <th>
       User Entered place
    </th>
    
    <th>
       Day allowance
    </th>
 
    <th>
       Climate Allowance
    </th>
</tr>
       </MDBTableHead>
       <MDBTableBody>
       <tr>
      <td rowSpan={3}> 
        {/**initial date */}
        {ToEthiopianDateSting(deduction.initial_date)}
        </td>
      <td rowSpan={3}>
        {/**initial time */}
        {deduction.return_time.hour}:{deduction.return_time.min<10?
        '0'+deduction.return_time.min:deduction.return_time.min
        }
      </td>
      <td>Breakfast</td>
      <td>
        {/**place */}
        {deduction.return_day.breakfast}
        </td>
      
     <td>
        {/**Day Allowance show */}
        {rBreakfast.scale}
      </td>
      <td>
   {/**climate place to calculate */}     
   {rBreakfast.c_scale}
      </td>
    </tr>
    <tr>
      <td>lunch</td>
      <td>
        {/**user entered place */}
        {deduction.return_day.lunch}
        </td>
      
     <td>
        {/**Day Allowance show */}
        {rLunch.scale}
      </td>
      <td>
   {/**climate place to calculate */}     
   {rLunch.c_scale}
      </td>
    </tr>
    <tr>
      <td>Dinner</td>
      <td>
        {/**user entered place */}
        {deduction.return_day.dinner}
        </td>
      
     <td>
        {/**Day Allowance show */}
        {rDinner.scale}
      </td>
      <td>
   {/**climate place to calculate */}     
   {rDinner.c_scale}
      </td>
    </tr>
    
    
    <tr>
      <td colSpan={4}>
        <h6 className="float-right font-weight-bold">
          Totall Day and climate allowance
        </h6>
      </td>
      <td>
        <h6 className="float-right font-weight-bold">
          {deduction.day_amount}
        </h6>
      </td>
      <td>
        <h6 className="float-right font-weight-bold">
          {deduction.climate_amount}
        </h6>
      </td>
      </tr>
      <tr>
        <td colSpan={5}>
          <h6 className="float-right font-weight-bold">
          petrol and gas spending
          </h6>
        </td>
        <td>
        <h6 className="float-right font-weight-bold">
          {deduction.petrol}
          </h6>   
        </td>
        </tr>
        <tr>
        <td colSpan={5}>
          <h6 className="float-right font-weight-bold">
          Maintainance and repair spending
          </h6>
        </td>
        <td>
        <h6 className="float-right font-weight-bold">
          {deduction.maintainace}
          </h6>   
        </td>
        </tr>
        <tr>
        <td colSpan={5}>
          <h6 className="float-right font-weight-bold">
          other spendings
          </h6>
        </td>
        <td>
        <h6 className="float-right font-weight-bold">
          {deduction.other}
          </h6>   
        </td>
        </tr>
        <tr>
        <td colSpan={5}>
          <h6 className="float-right font-weight-bold">
          Totall
          </h6>
        </td>
        <td>
        <h6 className="float-right font-weight-bold">
          {deduction.totall_amount}
          </h6>   
        </td>
        </tr>
        <tr>
        <td colSpan={5}>
          <h6 className="float-right font-weight-bold text-danger">
          prepaid amount
          </h6>
        </td>
        <td>
        <h6 className="float-right font-weight-bold text-danger">
          -{prePaid}
          </h6>   
        </td>
        </tr>
        <tr>
        <td colSpan={5}>
          {
            deduction.difference_amount<0?
            <h6 className="float-right font-weight-bold text-info">
         Refundable amount
          </h6>:
          deduction.difference_amount>0?
          <h6 className="float-right font-weight-bold text-info">
          Additional amount
          </h6>:
          <p></p>
          }
          
        </td>
        <td>
        <h6 className="float-right font-weight-bold text-info">
          {Math.abs(deduction.difference_amount)}
          </h6>   
        </td>
        </tr>    
       </MDBTableBody>
       </MDBTable>
        </div>
      {/**Approval */}  
      <div className="col-lg-6">
<p className="font-weight-bold">
    Employee name- {Calculation.Name(deduction.creater)}
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
            <div className="col-lg-6">
<p className="font-weight-bold">
    Manager name- {Calculation.Name(deduction.approval_manager.emp_id)}
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
         <div className="col-lg-6">
            <h6 className="text-center font-weight-bold">
      Fianance employee who has done the calculation
      name- {Calculation.Name(deduction.f_employee.emp_id)}  
            </h6>
          <div className="input-group input-container">
				<span className="input-group-addon">
                 Signature
                    </span>
    <input type="text" className="input-field form-control"  disabled={true} />
            </div>    
             </div> 
           <div className="col-lg-6">
           <p className="font-weight-bold">
    calculation approval Manager-{Calculation.Name(deduction.f_tl_pending.emp_id)}  
             </p>
             <div className="input-group input-container">
				<span className="input-group-addon">
                 Signature
                    </span>
    <input type="text" className="input-field form-control"
     disabled={true}/>
            </div>        
               </div>
             <div className="col-lg-6 text-center small font-weight-bold font-italic">
             Allowance system developed by metrix technologies
              </div>
               </div>   
            </div>
        </div>
        );
    }
}

export default PrintUserDeduction;
