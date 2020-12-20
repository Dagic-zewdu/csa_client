import { faPrint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'
import { getDate } from '../../../controllers/Date'
import { DeductionCalculate } from '../../../controllers/DeductionCalculate'
import { FieldAllowance } from '../../../controllers/FieldAllowance'
import { Donothing } from '../../../controllers/saveProcess'
import { encryptObject } from '../../auth/encrypt'
import { host } from '../../config/config'
import { StoreContext } from '../../contexts/contexts'
import { userInfo } from '../../users/userInfo'
import PrintUserDeduction from './PrintUserDeduction'

export const ViewCompleted=(props)=> {
    const {deduction,user}=props
    const [date,setDate]=useState('')
    const { allowances,deductions,employees,users, place,fieldEmployees,climatePlaces,config, company }=useContext(StoreContext)
const {state:Allowances}=allowances
const {state:Employees}=employees
const {state:Users}=users
const {state:Deductions}=deductions
const Calculation=new DeductionCalculate(Deductions,Allowances,Employees,Users,place.state,climatePlaces.state,config.state[0])  
const fieldEmployee=new FieldAllowance(fieldEmployees.state)
const emp_id=deduction.creater
const isOfficial=Calculation.isOfficial(emp_id) //check the deduction creater is official
const isFieldEmployee=fieldEmployee.faCheck(emp_id)
const allowance=Calculation.findAllowance(deduction.allowance_id)
const prePaid=allowance?allowance.totall_amount:0

useEffect(()=>{
    const setSeen=async ()=>deduction.c_seen&&user?Donothing():
    await axios.put(host+'/deductions',{data:encryptObject({
        ...userInfo(),...deduction,c_seen:true
    })})
    const date=async ()=>await getDate()
    const fecthDate=async ()=>{
        let date=await getDate()
        setDate(date)
      }
       setSeen()
      fecthDate()
      document.title='Allowance system developed by metrix technologies'
},[])
/**return an object of state.c_spending_days
 * @param id -spending day id
 * @param type-string 'breakfast','lunch','dinner','bed'
    */
   const findSpendingDay=(id,type)=>deduction.c_spending_days.find(d=>d.s_id === id && d.type === type)
   const componentRef = useRef();
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
      <PrintUserDeduction ref={componentRef} deduction={deduction}  isOfficial={isOfficial} 
     isFieldEmployee={isFieldEmployee} Calculation={Calculation} date={date}
     findSpendingDay={findSpendingDay} company={company.state[0].name} prePaid={prePaid}/> 
   </div>
    )
}

