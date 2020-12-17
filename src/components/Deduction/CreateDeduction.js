import {  faCalendar, faCalendarAlt, faCoffee, faGasPump, faMoneyBill, faPizzaSlice, faPlus, faProcedures, faSave, faSuitcase, faTrash, faWindowClose, faWineBottle, faWineGlass, faWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext, useEffect, useState } from 'react'
import { checkDate, convertToEuropean, durationDays, getDate, toEthiopianDate, ToEthiopianDateSting } from '../../controllers/Date'
import { DeductionClass } from '../../controllers/Deductions'
import { randomId, saveProcess } from '../../controllers/saveProcess'
import { StoreContext } from '../contexts/contexts'
import { DotLoading } from '../layout/Loading'
import {decrptObject, encryptObject} from '../auth/encrypt'
import axios from 'axios'
import { userInfo } from '../users/userInfo'
import { host } from '../config/config'
const CreateDeduction=(props)=> {
    const {allowance}=props
    const [state,setState]=useState({
        initial_time:{hour:12,min:0},
        initial_day:{breakfast:'',lunch:'',dinner:'',bed:''}, //initial date breakfast,lunch,dinner
        return_time:{hour:12,min:0},
        return_day:{breakfast:'',lunch:'',dinner:''},  //return date breakfast,lunch and dinner
        spending_days:[],
        spending_day:{breakfast:'',lunch:'',dinner:'',bed:''},
        spending_from:{day:'',month:'',year:''},
        spending_upto:{day:'',month:'',year:''},
        initial_date:{day:'',month:'',year:''},
        return_date:{day:'',month:'',year:''},
        spending_error:'',
        maintainance:0,
        petrol:0,
        other:0,    
        save_options:'approve',
        approval_manager:{emp_id:''},
        ...saveProcess('default')
     })
     useEffect(()=>{
          setState({...state,initial_date:{...state.initial_date,
         day: toEthiopianDate(allowance.initial_date).date,
         month: toEthiopianDate(allowance.initial_date).month,
         year: toEthiopianDate(allowance.initial_date).year
        },
       return_date:{...state.return_date,
      day: durationDays(allowance.initial_date,allowance.destination_date)!==0? 
      toEthiopianDate(allowance.destination_date).date:'',
      month: durationDays(allowance.initial_date,allowance.destination_date)!==0?
      toEthiopianDate(allowance.destination_date).month:'',
      year: durationDays(allowance.initial_date,allowance.destination_date)!==0?
      toEthiopianDate(allowance.destination_date).year:''
    }
    })
     },[allowance])
   const { allowances,employees,users}=useContext(StoreContext)
   const {state:Allowances,loading}=allowances
   const {state:Employees}=employees
   const {state:Users}=users
const Deduction=new DeductionClass([],Allowances,Employees,Users)
const DurationMonths=Deduction.durationMonths(allowance._id)
const durationYears=Deduction.durationYears(allowance._id) 
const emp_id=Deduction.getEmp_id()
const department=Deduction.Department(emp_id)
const Managers=Deduction.avaliableManager(department)
const DoNothing=()=>{}
   /**from date is the spending days initial date
    * uptodate is the final day
    */
   const Dates=()=>{
    const  {day:iday,month:imonth,year:iyear}=state.spending_from
    const  {day:rday,month:rmonth,year:ryear}=state.spending_upto
    const  {day:Iday,month:Imonth,year:Iyear}=state.initial_date
    const  {day:Rday,month:Rmonth,year:Ryear}=state.return_date
    try{

        const fromDate=convertToEuropean(iday,imonth,iyear)  //spending dates
        const uptoDate=convertToEuropean(rday,rmonth,ryear) //spending dates
        const initial_date=convertToEuropean(Iday,Imonth,Iyear)  //initial dates
        const  return_date=convertToEuropean(Rday,Rmonth,Ryear)
        return {fromDate,uptoDate,initial_date,return_date}
    }
    catch(err){
   setState({...state,spending_error:'You entered invalid date please Enter date carefully'})
    return {fromDate:null,uptoDate:null,initial_date:null,return_date:null}    
}   
   }  
/**check if the date is btn the initial date and the arrival date */
const checkUnderDate=()=>{
    const {fromDate,uptoDate,initial_date,return_date}=Dates()
   checkDate(initial_date,fromDate)?
         checkDate(uptoDate,return_date)?
DoNothing():setState({...state,spending_error:'Invalid date duration please insert Upto date properly'}):
setState({...state,spending_error:'Invalid date duration please insert From date properly'})
     return (checkDate(initial_date,fromDate)?
         checkDate(uptoDate,return_date)?
          true:false:false)
} 
/** returns an object of {days,check:Boolean}
 *  check missing date btn that need to be deducted 
 * */
const missingDate=()=>{
    const {fromDate,uptoDate,initial_date,return_date}=Dates()
    var sum=0
    state.spending_days.map(m=>{
     sum=sum+(durationDays(m.fromDate,m.uptoDate)+1)
    })
    const duration=(durationDays(initial_date,return_date)+1)
    const Duration=duration===1?1:2
    const days=duration-sum-Duration
    const check=days!==0?true:false
   return {days,check}       
    }
/**check the date is btn the previous entered(array of objects) data if it is
 * between return false
*/
const checkBetweenDate=()=>{
    const {fromDate}=Dates()
   state.spending_days.map(s=>{
    durationDays(s.fromDate,s.uptoDate)>=durationDays(s.fromDate,fromDate)?
    setState({...state,spending_error:'Invalid date the date you entered is between two dates you previously entered please enter date again'})
    :DoNothing()  
   })
   let check=state.spending_days.find(s=>{
  return durationDays(s.fromDate,s.uptoDate)>=durationDays(s.fromDate,fromDate)
   })
   return check?false:true
}
/**add spending days to the state spending_day array */
     const addSpendingDay=()=>{
    const {fromDate,uptoDate,initial_date,return_date}=Dates()
    const {breakfast,lunch,dinner,bed}=state.spending_day
    /**spending day validation show error if empty enterance and invalid date*/
    breakfast===''?setState({...state,spending_error:'please enter breakfast place'}):
 lunch===''?setState({...state,spending_error:'please enter lunch place'}):
 dinner===''?setState({...state,spending_error:'please enter Dinner place'}):
bed===''?setState({...state,spending_error:'please enter sleeping place'}):
 !checkDate(fromDate,uptoDate)?setState({...state,
 spending_error:'Invalid duration between from date and upto date'}):
 durationDays(initial_date,fromDate)===0?setState({...state,spending_error:
ToEthiopianDateSting(fromDate)+' is the initial date. Initial date information is saved in the above input box please fill out the information accordingly'})
: durationDays(uptoDate,return_date)===0?setState({...state,spending_error:
ToEthiopianDateSting(uptoDate)+' is the return date. Return date information is saved in the below input box please fill out the information accordingly'})
: DoNothing()
   
  let check = checkDate(fromDate,uptoDate)&&checkUnderDate()&&
  checkBetweenDate()&&durationDays(initial_date,fromDate)!==0&&
  durationDays(uptoDate,return_date)!==0?true:false    // check date duration
              
   let Check= breakfast===''||lunch===''||dinner===''?false:true  //check empty enterance
              
    check&&Check&&fromDate&&uptoDate?
    setState(s=>({...s,spending_error:'',spending_days:
        [...s.spending_days,{ id:randomId(),fromDate,uptoDate,
            breakfast,lunch,dinner,bed}]
        })):DoNothing()          
      }
      /**removes an onbject of spending day from the array lsit */
      const removeSpendingDay=id=>setState(s=>({...s,
        spending_days:[...s.spending_days.filter(s=>s.id !== id)]}))
   /**list spending inforamtion */
   const listSpendingDays=state.spending_days.length?
   state.spending_days.map(s=>{
       return(
<tr key={s.id}>
       <td className="text-center">
           {ToEthiopianDateSting(s.fromDate)}
       </td>
       <td className="text-center">
           {ToEthiopianDateSting(s.uptoDate)}
       </td>
       <td className="text-center">
         {durationDays(s.fromDate,s.uptoDate)+1}
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
       <td className="text-center" onClick={()=>removeSpendingDay(s.id)}>
           <FontAwesomeIcon icon={faWindowClose} className='text-danger fa-2x' />
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
/**save data */
const handleSubmit=async (e)=>{
  e.preventDefault()
  setState({...state,...saveProcess('initial','Saving please wait...')})
  const date=await getDate()
  const spending_days=[...state.spending_days.map(s=>{
    return {from_date:s.fromDate,upto_date:s.uptoDate,
        breakfast:s.breakfast,lunch:s.lunch,dinner:s.dinner,
         bed:s.bed}
  })]
  const {_id:allowance_id}=allowance
  const {initial_time,initial_day,return_time,petrol,maintainance,
      other,save_options,approval_manager,return_day}=state
      const  {initial_date,return_date}=Dates()
    if(initial_date===null||return_date===null){
    setState({...state,...saveProcess('error',
    'Invalid return or initial date')})
    } 
    else if(!checkDate(initial_date,return_date)){
    setState({...state,...saveProcess('error','Invalid date duration between initial date and return date')})    
    }
    else if(missingDate().check){
setState({...state,...saveProcess('error','Missing '+missingDate().days+' days of deduction.Please add days to deduct')})
    }
    else{
const Data={allowance_id,initial_time,initial_day,initial_date,
       spending_days,return_time,return_date,petrol,maintainace:maintainance,
       other,save_options,approval_manager,creater:Deduction.getEmp_id(),
       ...userInfo(),return_day
    }
 try{
    const data=encryptObject(Data)    
    const req= await axios.post(host+'/deductions',{data})
    const res=decrptObject(req.data)
    if(res.error){
  setState({...state,...saveProcess('error',
  'Error while saving... Internal server error please try again later'
    )})
    }
   else if(!res.error&&res.created){
    setState({...state,...saveProcess('success','deduction created successfully')})   
   }    
 }
 catch(err){
    setState({...state,...saveProcess('error',
'Error while saving... server is not active or responding please contact admin'
      )})
 }
     
} 
}


return (
    <form onSubmit={e=>handleSubmit(e)}>
        <div className="container">
            <div className="row">
                {/**information display */}
            
      {/**Initial day info */}
<div className="col-lg-12">
<h4 className="font-weight-bold text-center mx-2">
         Initial Day inforamtion
     </h4>
    <div className="row">
        <div className="col-lg-6">
           <div className="card">
           <p className="font-weight-bold text-center mx-2">
         Initial day 
     </p>
           <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30}   onChange={e=>
     setState({...state,...saveProcess('default'),spending_error:'',
     initial_date:{...state.initial_date,day:parseInt(e.target.value)}
     })}   value={state.initial_date.day}
      required={true}/>
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
      initial_date:{...state.initial_date,month:parseInt(e.target.value)}
       })}  value={state.initial_date.month}
       required={true}>
        <option value="">Enter month</option>
     {
   DurationMonths.map(m=>{
       return(
        <option value={m.number} key={m.number}>
            {m.month}
        </option>
       )
   })  
     }
      </select> 
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
      initial_date:{...state.initial_date,year:parseInt(e.target.value)}
       })}   value={state.initial_date.year}
       required={true}>
        <option value="">Enter year</option>
     {
   durationYears.map(m=>{
       return(
        <option value={m} key={m}>
            {m}
        </option>
       )
   })  
     }
      </select> 
      
     <p className="my-auto font-weight-bold">
         E.C
         </p>
         
 </div>
 <p className="font-weight-bold text-center mx-2">
         Initial time
     </p> 
  <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} className='text-info fa-2x mx-2 my-auto '/>
<input className="input-field form-control my-auto" type="number"
 placeholder="hr" min={1} max={12}   onChange={e=>setState({...state,
   ...saveProcess('default'),
    initial_time:{...state.initial_time,hour:e.target.value}})}
      required={true}  />
<h4 className="text-center font-weight-bold my-auto mx-2">
    :
</h4>
<input className="input-field form-control my-auto" type="number"
 placeholder="min" min={0} max={60}   onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
    initial_time:{...state.initial_time,min:e.target.value}})}
      required={true} />     
      </div>         
               </div> 
        </div>
        <div className="col-lg-6">
            <div className="card">
            <p className="font-weight-bold text-center mx-2">
         Breakfast place
            </p>
            <div className="input-container">
     <FontAwesomeIcon icon={faCoffee} className='text-info fa-2x mx-2 my-auto' />
     <input className="input-field form-control my-auto" type="text"
 placeholder="input place"  onChange={e=>setState({...state,...saveProcess('default'),
spending_error:'',initial_day:{...state.initial_day,breakfast:e.target.value}
       })}
      required={state.spending_days.length?true:false} 
      />
            </div>
             
      <p className="font-weight-bold text-center mx-2">
         Lunch place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faPizzaSlice} className='text-info fa-2x mx-2 my-auto' />
     <input className="input-field form-control my-auto" type="text"
 placeholder="input place"  onChange={e=>setState({...state,
       ...saveProcess('default'),spending_error:'',
       initial_day:{...state.initial_day,lunch:e.target.value}
       })}
      required={true} 
      />    
     </div>
     
     <p className="font-weight-bold text-center mx-2">
         Dinner place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faWineGlass} className='text-info fa-2x mx-2 my-auto' />
     <input className="input-field form-control my-auto" type="text"
      placeholder="input place"  onChange={e=>setState({...state,
        ...saveProcess('default'),spending_error:'',
       initial_day:{...state.initial_day,dinner:e.target.value}
       })}
      required={state.spending_days.length?true:false} 
      /> 
      
     </div>
     <p className="font-weight-bold text-center mx-2">
         sleeping place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faProcedures} className='text-info fa-2x mx-2 my-auto' />
     <input className="input-field form-control my-auto" type="text"
      placeholder="input place"  onChange={e=>setState({...state,
        ...saveProcess('default'),spending_error:'',
       initial_day:{...state.initial_day,bed:e.target.value}
       })}
      required={state.spending_days.length?true:false} 
      /> 
      
     </div>
            </div>
        </div>
    </div>
 
</div>
   {/**spending day info */}
   <div className="col-lg-12 mt-3">
       <div className="card">
           
       <h4 className="font-weight-bold text-center mx-2">
         spending day info
     </h4>
       
           <div className="row">
               <div className="col-lg-6">
               <p className="font-weight-bold text-center mx-2">
         From day 
     </p>
     <div className="input-container">
 <FontAwesomeIcon icon={faCalendar} className='text-info fa-2x mx-2 my-auto '/>
 
<input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30}   onChange={e=>
    parseInt(e.target.value)>30&&parseInt(e.target.value)<0?
   setState({...state,spending_error:'Invalid date duration'})
     :setState({...state,...saveProcess('default'),spending_error:'',
     spending_from:{...state.spending_from,day:parseInt(e.target.value)} })}
     />
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
       spending_from:{...state.spending_from,month:parseInt(e.target.value)}})} 
       >
        <option value="">Enter month</option>
     {
   DurationMonths.map(m=>{
       return(
        <option value={m.number} key={m.number}>
            {m.month}
        </option>
       )
   })  
     }
      </select> 
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
       spending_from:{...state.spending_from,year:parseInt(e.target.value)},
       })} 
       >
        <option value="">Enter year</option>
     {
   durationYears.map(m=>{
       return(
        <option value={m} key={m}>
            {m}
        </option>
       )
   })  
     }
      </select> 
      
     <p className="my-auto font-weight-bold">
         E.C
         </p>
        
 </div>
 <p className="font-weight-bold my-2  text-center">
         Upto day
         </p>
         <div className="input-container">
         <FontAwesomeIcon icon={faCalendar} className='text-info fa-2x mx-2 my-auto '/>
       <input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30}   onChange={e=>
    parseInt(e.target.value)>30&&parseInt(e.target.value)<0?
   setState({...state,spending_error:'Invalid date duration'})
     :setState({...state,...saveProcess('default'),spending_error:'',
     spending_upto:{...state.spending_upto,day:parseInt(e.target.value)}})}
    />
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
       spending_upto:{...state.spending_upto,month:parseInt(e.target.value)}})} 
       >
        <option value="">Enter month</option>
     {
   DurationMonths.map(m=>{
       return(
        <option value={m.number} key={m.number}>
            {m.month}
        </option>
       )
   })  
     }
      </select> 
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
       spending_upto:{...state.spending_upto,year:parseInt(e.target.value)}})} 
       >
        <option value="">Enter year</option>
     {
   durationYears.map(m=>{
       return(
        <option value={m} key={m}>
            {m}
        </option>
       )
   })  
     }
      </select> 
         
     <p className="my-auto font-weight-bold">
         E.C
         </p>
         </div>
   </div>
               <div className="col-lg-6">
               <p className="font-weight-bold text-center mx-2">
         Breakfast place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faCoffee} className='text-info fa-2x mx-2 my-auto '/>
  <input className="input-field form-control my-auto" type="text"
 placeholder="input place"   onChange={e=>setState({
      ...state,...saveProcess('default'),spending_error:'',
       spending_day:{...state.spending_day,breakfast:e.target.value}
       })} />  
   </div>

   <p className="font-weight-bold text-center mx-2">
         Lunch place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faPizzaSlice} className='text-info fa-2x mx-2 my-auto '/>
     <input className="input-field form-control my-auto" type="text"
 placeholder="input place"   onChange={e=>setState({...state,
 ...saveProcess('default'),spending_error:'',
 spending_day:{...state.spending_day,lunch:e.target.value}
       })}
      />
     </div>

     <p className="font-weight-bold text-center mx-2">
         Dinner place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faWineGlass} className='text-info fa-2x mx-2 my-auto '/>
     <input className="input-field form-control my-auto" type="text"
 placeholder="input place"    onChange={e=>setState({...state,
 ...saveProcess('default'),spending_error:'',
 spending_day:{...state.spending_day,dinner:e.target.value}
       })}
      /> 
     </div>
     <p className="font-weight-bold text-center mx-2">
         sleeping place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faProcedures} className='text-info fa-2x mx-2 my-auto '/>
     <input className="input-field form-control my-auto" type="text"
 placeholder="input place"    onChange={e=>setState({...state,
 ...saveProcess('default'),spending_error:'',
 spending_day:{...state.spending_day,bed:e.target.value}
       })}
      /> 
     </div>
               </div>
           </div>
  
    <p className="text-center text-danger font-weight-bold">
        {state.spending_error}
    </p>
    <div className="row">
        <div className="col-lg-12 mt-3">
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
                <th>
          <FontAwesomeIcon icon={faTrash} className='mx-2' />                        
                Remove
                </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                          {listSpendingDays}
                      </MDBTableBody>
                  </MDBTable>


        </div>
        <div className="col-lg-4"></div>
        <div className="col-lg-4 mb-3">
<div className="btn btn-info" onClick={()=>addSpendingDay()}>
        <FontAwesomeIcon icon={faPlus}  className='mx-2 fa-2x'/>
        Add to deduct
    </div>
        </div>
        
    </div>
   </div>
   </div>
   {/**Return day info */}
   <div className="col-lg-12 mt-3">
    <div className="card">
    <h4 className="font-weight-bold text-center mx-2">
         Return Day inforamtion
     </h4>
         <div className="row">
             <div className="col-lg-6">
             <p className="font-weight-bold text-center mx-2">
         Return Date 
             </p>
             <div className="input-container">
             <FontAwesomeIcon icon={faCalendar} className='text-info fa-2x mx-2 my-auto '/>
             <input className="input-field form-control my-auto" type="number"
 placeholder="dd" min={1} max={30}   onChange={e=>
     setState({...state,...saveProcess('default'),spending_error:'',
     return_date:{...state.return_date,day:parseInt(e.target.value)}
     })}  value={state.return_date.day}
      required={true}/>
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
      return_date:{...state.return_date,month:parseInt(e.target.value)}
       })}   value={state.return_date.month}
       required={true}
       >
        <option value="">Enter month</option>
     {
   DurationMonths.map(m=>{
       return(
        <option value={m.number} key={m.number}>
            {m.month}
        </option>
       )
   })  
     }
      </select> 
  <select  className="input-field form-control my-auto"
      onChange={e=>setState({...state,...saveProcess('default'),spending_error:'',
      return_date:{...state.return_date,year:parseInt(e.target.value)}
       })}  value={state.return_date.year}
       required={true}>
        <option value="">Enter year</option>
     {
   durationYears.map(m=>{
       return(
        <option value={m} key={m}>
            {m}
        </option>
       )
   })  
     }
      </select> 
      
     <p className="my-auto font-weight-bold">
         E.C
         </p>

             </div>
             <p className="font-weight-bold text-center mx-2">
         Return time
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faCalendar} className='text-info fa-2x mx-2 my-auto '/>
  <input className="input-field form-control my-auto" type="number"
 placeholder="hr" min={1} max={12}   onChange={e=>setState({...state,
 ...saveProcess('default'),spending_error:'',
    return_time:{...state.return_time,hour:e.target.value}})}
      required={true}  />
<h4 className="text-center font-weight-bold my-auto mx-2">
    :
</h4>
<input className="input-field form-control my-auto" type="number"
 placeholder="min" min={0} max={60}   onChange={e=>setState({...state,
 ...saveProcess('default'),spending_error:'',
    return_time:{...state.return_time,min:e.target.value}})}
      required={true} 
      />
     </div>
       
             </div>
             <div className="col-lg-6">
                 
      <p className="font-weight-bold text-center mx-2">
         Breakfast place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faCoffee} className='text-info fa-2x mx-2 my-auto '/>     
     <input className="input-field form-control my-auto" type="text"
 placeholder="input place"   onChange={e=>setState({...state,
 ...saveProcess('default'),spending_error:'',
       return_day:{...state.return_day,breakfast:e.target.value}
       })}
      />
     </div>
     
     <p className="font-weight-bold text-center mx-2">
         Lunch place
     </p>
     <div className="input-container">
     <FontAwesomeIcon icon={faPizzaSlice} className='text-info fa-2x mx-2 my-auto '/>     
     <input className="input-field form-control my-auto" type="text"
 placeholder="input place"   onChange={e=>setState({...state,
   ...saveProcess('default'),spending_error:'',
       return_day:{...state.return_day,lunch:e.target.value}
       })}
      />
     </div>
     
     <p className="font-weight-bold text-center mx-2">
         Dinner place
     </p>
     
 <div className="input-container">
 <FontAwesomeIcon icon={faWineBottle} className='text-info fa-2x mx-2 my-auto '/>     
 <input className="input-field form-control my-auto" type="text"
placeholder="input place"    onChange={e=>setState({...state,
...saveProcess('default'),spending_error:'',
   return_day:{...state.return_day,dinner:e.target.value}
   })}
  /> 
</div> 

             </div>
         </div>
     </div>
               
   </div>
   <div className="col-lg-6">
   <p className="font-weight-bold text-center mx-2">
         Maintainance and repair amount
     </p>
     <div className="input-container">
 <FontAwesomeIcon icon={faWrench} className='text-info fa-2x mx-2 my-auto '/>     
 <input className="input-field form-control my-auto" type="number"
placeholder="input amount" min={0}   onChange={e=>setState({...state,
...saveProcess('default'),maintainance:e.target.value
   })}
  /> 
</div>
<p className="font-weight-bold text-center mx-2">
         Oil and petrol spendings
     </p>
     <div className="input-container">
 <FontAwesomeIcon icon={faGasPump} className='text-info fa-2x mx-2 my-auto '/>     
 <input className="input-field form-control my-auto" type="number"
placeholder="input amount"  min={0}  onChange={e=>setState({...state,
...saveProcess('default'),petrol:e.target.value
   })}
  /> 
</div> 

<p className="font-weight-bold text-center mx-2">
         Other spendings
     </p>
     <div className="input-container">
 <FontAwesomeIcon icon={faMoneyBill} className='text-info fa-2x mx-2 my-auto '/>     
 <input className="input-field form-control my-auto" type="number"
placeholder="input amount"  min={0}  onChange={e=>setState({...state,
...saveProcess('default'),other:e.target.value
   })}
  /> 
</div> 
   </div>
   <div className="col-lg-12">
   <div className="text-center">
  <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
 {
   state.loading?<DotLoading/>:<p></p>
  }
 </div>
   </div>
   <div className="col-lg-4">
       <p className="text-center font-weight-bold">
 Save options
       </p>
       <div className="input-container">
 <FontAwesomeIcon icon={faSave} className=' fa-2x mx-2 my-auto '/>
<select  className="input-field form-control my-auto"
onChange={e=>e.target.value==='draft'?
   setState({...state,save_options:e.target.value,
    approval_manager:{emp_id:''}}):
   setState({...state,save_options:e.target.value})}
   >
    <option value="approve">Save and start approving</option>
    <option value="draft">Save as draft</option>
</select>

 </div>
   </div>
   <div className="col-lg-4">
   <p className="font-weight-bold text-center">
        Approve to manager
      </p>
           <div className="input-container">
 <FontAwesomeIcon icon={faSuitcase} className=' fa-2x mx-2 my-auto '/>
<select  className="input-field form-control my-auto" 
onChange={e=>setState({...state,approval_manager:{emp_id:e.target.value},
    ...saveProcess('default')})}
    required={true} 
    >
    <option value="">Enter Approving Manager</option>
    {
        Managers.length?
        Managers.map(e=>{
          return(
              <option value={e.emp_id} key={e._id}>
                  {Deduction.Name(e.emp_id)} ({Deduction.UserRole(e.emp_id)})
                  </option>
          )  
        }):
        <option value="" className='text-danger font-weight-bold'>
            No available Manager registered
        </option>
    }
</select>

 </div>
   </div>
   <div className="col-lg-4">
   {
     state.save_options==='draft'?
     <button type='submit' className="btn btn-large btn-outline-primary ml-4 my-auto"
  disabled={state.disable}>
     Save as Draft
 </button>:
    state.save_options==='approve'?
 <button type='submit' className="btn btn-large btn-outline-primary ml-4 mx-2 my-auto"
  disabled={state.disable}>
     Save and start approving
 </button>:
 <p></p>
 }
   </div>
            </div>

        </div>
        </form>
    )
}

export default CreateDeduction
