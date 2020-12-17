import { faCalendar, faCalendarAlt, faCalendarCheck, faCoffee, faGem, faPizzaSlice, faProcedures, faWineBottle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { durationDays, getDate, TellDay, tellTime, toEthiopianDate, ToEthiopianDateSting } from '../../../controllers/Date'
import { DeductionClass } from '../../../controllers/Deductions'
import { decrptObject, encryptObject } from '../../auth/encrypt'
import { StoreContext } from '../../contexts/contexts'
import {host} from '../../config/config'
import { userInfo } from '../../users/userInfo'
const ViewDetails=(props)=> {
    const {deduction,am,ftli,fe}=props
    const { allowances,employees,users,deductions}=useContext(StoreContext)
    const {state:Allowances,loading}=allowances
    const {state:Employees}=employees
    const {state:Users}=users
    const {state:Deductions}=deductions
const Deduction=new DeductionClass(Deductions,Allowances,Employees,Users)
/**set seen:false to seen:true for deduction approval manager */
const setManagerSeen=async ()=>{
   const date=await getDate()
   const req=await axios.put(host+'/deductions',{
       data:encryptObject({...deduction,approval_manager:{
     ...deduction.approval_manager,seen:true,seen_date:date,
         },
         ...userInfo()  
       })
   })
  
}
/**set seen for finance team leader incoming deductions */
const setFtl_Incoming=async ()=>{
    const date=await getDate()
    const req=await axios.put(host+'/deductions',{
        data:encryptObject({...deduction,f_tl_pending:{
      ...deduction.f_tl_pending,seen:true,seen_date:date,
          },
          ...userInfo()  
        })
    })
}
const setFemployee=async ()=>{
  const date=await getDate()
  const req=await axios.put(host+'/deductions',{
    data:encryptObject({...deduction,f_employee:{
      ...deduction.f_employee,seen:true,seen_date:date,
          },
          ...userInfo()  
        })
  })
}
const Donothing=()=>{}
useEffect(()=>{
  !deduction.approval_manager.seen&&am?setManagerSeen():Donothing()
  !deduction.f_tl_pending.seen && ftli?setFtl_Incoming():Donothing()
  !deduction.f_employee.seen&&fe?setFemployee():Donothing()
},[])
const listSpendingDays=deduction.spending_days.length?
deduction.spending_days.map(s=>{
    return(
<tr key={s._id}>
    <td className="text-center">
        {ToEthiopianDateSting(s.from_date)}
    </td>
    <td className="text-center">
        {ToEthiopianDateSting(s.upto_date)}
    </td>
    <td className="text-center">
      {durationDays(s.from_date,s.upto_date)+1}
    </td>
    <td className="text-center">
        {s.breakfast}
    </td>
    <td className="text-center">
        {s.lunch}
    </td>
    <td className="text-center">
        {s.dinner}
    </td>
    <td>
      {s.bed}  
    </td>
    
</tr>
    )
})
:<tr>
    <td colSpan={8}>
        <p className="text-center text-danger font-weight-bold">
            No spending days added yet
        </p>
    </td>
</tr>
    return (
        <div className="container">
            <div className="row">
            <div className="col-lg-6">
    <p className="text-center font-weight-bold">
      From- {Deduction.Name(deduction.creater)}  <br/>
      Department-{Deduction.Department(deduction.creater)}
        </p>      
            </div>
          <div className="col-lg-6">
      <p className="text-center font-italic">
       # Deduction id:{deduction.id} <br/>
        # Allowance id:{Deduction.findAllowance(deduction.allowance_id)?
            Deduction.findAllowance(deduction.allowance_id).id:''
        } <br/>
         created-{TellDay(deduction.created_date)} <br/>
         {tellTime(deduction.created_date)}
          </p>        
          </div>
          <div className="col-lg-12">
          <h5 className="text-center font-weight-bold">
              Initial day
              </h5>
              <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                         <th>
             <FontAwesomeIcon icon={faCalendar} className='mx-2'/>                            
                Initial day                                
                              </th>
            <th>
          <FontAwesomeIcon icon={faCalendarCheck} className='mx-2' />                        
                Initial time
                </th>  
                <th>
          <FontAwesomeIcon icon={faCoffee} className='mx-2' />                        
            Breakfast
                </th> 
                <th>
          <FontAwesomeIcon icon={faPizzaSlice} className='mx-2' />                        
            Lunch
                </th> 
                <th>
          <FontAwesomeIcon icon={faWineBottle} className='mx-2' />                        
            Dinner
                </th>
                <th>
          <FontAwesomeIcon icon={faProcedures} className='mx-2' />                        
            Bed
                </th>
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                    {
        <tr>
            <td className="text-center">
       {ToEthiopianDateSting(deduction.initial_date)}         
            </td>
           <td>
       {deduction.initial_time.hour} : {deduction.initial_time.min<10?
       '0'+deduction.initial_time.min:deduction.initial_time.min
       }        
               </td> 
             <td>
         {deduction.initial_day.breakfast}        
                 </td> 
                 <td>
         {deduction.initial_day.lunch}        
                 </td>
                 <td>
         {deduction.initial_day.dinner}        
                 </td> 
                 <td>
         {deduction.initial_day.bed}        
                 </td>                  
            </tr>                
                    }
                      </MDBTableBody>
                  </MDBTable> 
        <h5 className="text-center font-weight-bold my-2">
              spending days
              </h5>
              <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                          <th>
             <FontAwesomeIcon icon={faCalendar} className='mx-2'/>                            
                From-date                                
                              </th>   
                              <th>
             <FontAwesomeIcon icon={faCalendar} className='mx-2'/>                            
                Upto-date                                
                              </th>
                              <th>
             <FontAwesomeIcon icon={faCalendarAlt} className='mx-2'/>                            
                Duration                                
                              </th>
                              <th>
          <FontAwesomeIcon icon={faCoffee} className='mx-2' />                        
                Breakfast
                </th>
              
                <th>
          <FontAwesomeIcon icon={faPizzaSlice} className='mx-2' />                        
                Lunch
                </th>
                <th>
          <FontAwesomeIcon icon={faWineBottle} className='mx-2' />                        
                Dinner
                </th>
                <th>
          <FontAwesomeIcon icon={faProcedures} className='mx-2' />                        
                Bed
                </th>        
                 
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                          {listSpendingDays}
                      </MDBTableBody>
                  </MDBTable>
           {/**return date */}
           <h5 className="text-center font-weight-bold">
              Return day
              </h5>
              <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                         <th>
             <FontAwesomeIcon icon={faCalendar} className='mx-2'/>                            
                Return date                                
                              </th>
            <th>
          <FontAwesomeIcon icon={faCalendarCheck} className='mx-2' />                        
                Return time
                </th>  
                <th>
          <FontAwesomeIcon icon={faCoffee} className='mx-2' />                        
            Breakfast
                </th> 
                <th>
          <FontAwesomeIcon icon={faPizzaSlice} className='mx-2' />                        
            Lunch
                </th> 
                <th>
          <FontAwesomeIcon icon={faWineBottle} className='mx-2' />                        
            Dinner
                </th>
                <th>
          <FontAwesomeIcon icon={faProcedures} className='mx-2' />                        
            Bed
                </th>
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                    {
        <tr>
            <td className="text-center">
       {ToEthiopianDateSting(deduction.return_date)}         
            </td>
           <td>
       {deduction.return_time.hour} : {deduction.return_time.min<10?
        '0'+deduction.return_time.min:deduction.return_time.min
       }        
               </td> 
             <td>
         {deduction.return_day.breakfast}        
                 </td> 
                 <td>
         {deduction.return_day.lunch}        
                 </td>
                 <td>
         {deduction.return_day.dinner}        
                 </td> 
                 <td>
         {deduction.return_day.bed}        
                 </td>                  
            </tr>                
                    }
                      </MDBTableBody>
                  </MDBTable>
            <h5 className="text-center font-weight-bold">
           petrol and gas spending:{deduction.petrol} <br/>
           maintainance and repair spending:{deduction.maintainace} <br/>
           other spendings :{deduction.other}    
                </h5>      
          </div>
            </div>
        </div>
    )
}

export default ViewDetails
