import { faArrowLeft, faBackward, faCalendar, faCalendarCheck, faCheck, faCity, faFlag, faLevelUpAlt, faMap, faMapMarked, faMoneyBill, faPaperPlane, faPlus, faSave, faSun, faTrash, faUser, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { climateClass } from '../../../../controllers/climatePlaces'
import { getDate, ToEthiopianDateSting } from '../../../../controllers/Date'
import { DeductionCalculate } from '../../../../controllers/DeductionCalculate'
import { FieldAllowance } from '../../../../controllers/FieldAllowance'
import { PlaceClass } from '../../../../controllers/Places'
import { Donothing, randomId, saveProcess } from '../../../../controllers/saveProcess'
import { DeductionDnd, StoreContext } from '../../../contexts/contexts'
import { dropInitialClimatePlace, dropPlace_id, fieldSpendingDay, initialFieldEmployee, removeClimatePlace, removeInitialPlaces ,climateSpendingDays, removeSpendingDay, removeClimateSpending, dropSpendingDays } from './HandleFunctions'
import { DotLoading } from '../../../layout/Loading'
import { decrptObject, encryptObject } from '../../../auth/encrypt'
import { userInfo } from '../../../users/userInfo'
import axios from 'axios'
import { host } from '../../../config/config'
import DataLoading from '../../../layout/DataLoading'
import ErrorLoading from '../../../layout/ErrorLoading'
import { fetchData_Deductions } from '../../../fetchers/Functions/FerchDeductions'
import { Link, withRouter } from 'react-router-dom'
import { UsersClass } from '../../../../controllers/Users'

const DeductionCalculation=({_id:id})=> {
    const [state,setState]=useState({
        places:[],
        official_places:[],
        check:{inAA:false,outAA:true},
        place_id:'',
        place_type:'',
        region:'',
        climate_places:[],
   c_initial_day:{ 
   breakfast:{place_id:'',climate_place:'',project_allowance:'',scale:0},
   lunch:{place_id:'',climate_place:'',project_allowance:'',scale:0},
   dinner:{place_id:'',climate_place:'',project_allowance:'',scale:0},
   bed:{place_id:'',climate_place:'',project_allowance:'',scale:0}
       },
       c_spending_days:[],
       c_return_day:{
        breakfast:{place_id:'',climate_place:'',project_allowance:'',scale:0},
        lunch:{place_id:'',climate_place:'',project_allowance:'',scale:0},
        dinner:{place_id:'',climate_place:'',project_allowance:'',scale:0}
       },
       save_options:'Approve',
        ...saveProcess('default'),
        /**new calculation */
       day_Places:[],    //day allowance places
       Climate_Places:[]  //climate places to set
      })
    const {breakfast:iBreakfast,lunch:iLunch,dinner:iDinner,bed:iBed}=state.c_initial_day
    const {breakfast:rBreakfast,lunch:rLunch,dinner:rDinner}=state.c_return_day
    const { allowances,deductions,employees,users, place,
            fieldEmployees,climatePlaces,config ,dispatchDeductions}=useContext(StoreContext)
    const {state:Allowances,loading,error}=allowances
    const {state:Employees,loading:empLoading,error:empError}=employees
    const {state:Users,loading:userLoading,error:userError}=users
    const {loading:configLoading}=config
    const {state:Deductions,loading:deductionsLoading,error:deductionError}=deductions
  const Calculation=new DeductionCalculate(Deductions,Allowances,Employees,Users,place.state,
    climatePlaces.state,config.length||!configLoading?config.state[0]:{breakfast:0,lunch:0,dinner:0,bed:0})  
  const fieldEmployee=new FieldAllowance(fieldEmployees.state)
  const Places=new PlaceClass(place.state)
  const climate=new climateClass(climatePlaces.state)
  const deduction=Calculation.findDeductions(id)?Calculation.findDeductions(id):
  {
    creater:'',
    spending_days:[],
    initial_day:{breakfast:'',lunch:'',dinner:'',bed:''},
    return_day:{breakfast:'',lunch:'',dinner:''},
    initial_time:{min:0,hour:0},
    return_time:{min:0,hour:0}                    
}
  const emp_id=deduction.creater
  const isOfficial=Calculation.isOfficial(emp_id) //check the deduction creater is official
  const salary=Calculation.Salary(emp_id)   //salary of the employee
  const isFieldEmployee=fieldEmployee.faCheck(emp_id) //checks if the Employee is on project allowance
  const insideAA=fieldEmployee.faIn_A_A(emp_id)
  const outAA=fieldEmployee.faOut_A_A(emp_id)
  const fescale=state.check.inAA?fieldEmployee.faIn_A_A(emp_id):
               state.check.outAA?fieldEmployee.faOut_A_A(emp_id):0
const places=isOfficial?Places.officialPlaces():Places.employeePlaces()

/**returns String id that is detect through
 * @param index-string name to detect
 *  */ 
const place_idDetect=index=>isFieldEmployee?'':
isOfficial?Places.findByName(index,'official')?Places.findByName(index,'official')._id:'':
Places.findByName(index,'employee')?Places.findByName(index,'employee')._id:''
/**returns number scale that is detect through the place
 * @param index-string name to detect
 *  */ 
const place_scaleDetect=index=>isFieldEmployee?index!==''?fieldEmployee.faOut_A_A(emp_id):0:
isOfficial?Places.findByName(index,'official')?Calculation.scale(emp_id,Places.findByName(index,'official')._id):0:
Places.findByName(index,'employee')?Calculation.scale(emp_id,Places.findByName(index,'employee')._id):0
/**returns String of 'inside' 'outside' addis ababa for project allowance employee
 * @param index-name to search and set
 *  */  
const projectDetect=index=>isFieldEmployee?index!==''?'Outside':'':''
/** returns string id that is detect on climate place
 * @param index-String name to detect
*/
const detectClimatePlace=index=>climate.findSinglePlace(index)?climate.findSinglePlace(index)._id:''
const User=new UsersClass(Users,Employees)
const fetch=()=>fetchData_Deductions(dispatchDeductions)
    useEffect(()=>{
      deductionsLoading?Donothing():
      User.isFinanceEmployee()?Donothing():Donothing()/*props.history.push('/login')*/
      fetchData_Deductions(dispatchDeductions)
    document.title='Do deduction'
    
      let c_spending_days=[]
      /**auto detect */
      deduction.spending_days.map(d=>{
        c_spending_days.push(
      {
      _id:d._id,type:'breakfast',duration:Calculation.sDuration(id,d._id),
      place_id:place_idDetect(d.breakfast),
      climate_place:detectClimatePlace(d.breakfast),
      project_allowance:projectDetect(d.breakfast),
      scale:place_scaleDetect(d.breakfast)
      },
      {
      _id:d._id,type:'lunch',duration:Calculation.sDuration(id,d._id),
      place_id:place_idDetect(d.lunch),
      climate_place:detectClimatePlace(d.lunch),
      project_allowance:projectDetect(d.lunch),
      scale:place_scaleDetect(d.lunch)
     },
      {
      _id:d._id,type:'dinner',duration:Calculation.sDuration(id,d._id),
      place_id:place_idDetect(d.dinner),
      climate_place:detectClimatePlace(d.dinner),
      project_allowance:projectDetect(d.dinner),
      scale:place_scaleDetect(d.dinner)
      },
      {
      _id:d._id,type:'bed',duration:Calculation.sDuration(id,d._id),
      place_id:place_idDetect(d.bed),
      climate_place:detectClimatePlace(d.bed),
      project_allowance:projectDetect(d.bed),
      scale:place_scaleDetect(d.bed)
     }
     )
      })
      let c_initial_day={ 
        breakfast:{
        place_id:place_idDetect(deduction.initial_day.breakfast),
        climate_place:detectClimatePlace(deduction.initial_day.breakfast),
        project_allowance:projectDetect(deduction.initial_day.breakfast),
        scale:place_scaleDetect(deduction.initial_day.breakfast)
              },
        lunch:{
        place_id:place_idDetect(deduction.initial_day.lunch),
        climate_place:detectClimatePlace(deduction.initial_day.lunch),
        project_allowance:projectDetect(deduction.initial_day.lunch),
        scale:place_scaleDetect(deduction.initial_day.lunch)
            },
        dinner:{
          place_id:place_idDetect(deduction.initial_day.dinner),
          climate_place:detectClimatePlace(deduction.initial_day.dinner),
          project_allowance:projectDetect(deduction.initial_day.dinner),
          scale:place_scaleDetect(deduction.initial_day.dinner)
         },
        bed:{
          place_id:place_idDetect(deduction.initial_day.bed),
          climate_place:detectClimatePlace(deduction.initial_day.bed),
          project_allowance:projectDetect(deduction.initial_day.bed),
          scale:place_scaleDetect(deduction.initial_day.bed)
          }
            }
      let c_return_day={ 
        breakfast:{
          place_id:place_idDetect(deduction.return_day.breakfast),
          climate_place:detectClimatePlace(deduction.return_day.breakfast),
          project_allowance:projectDetect(deduction.return_day.breakfast),
          scale:place_scaleDetect(deduction.return_day.breakfast)
                },
        lunch:{
          place_id:place_idDetect(deduction.return_day.lunch),
          climate_place:detectClimatePlace(deduction.return_day.lunch),
          project_allowance:projectDetect(deduction.return_day.lunch),
          scale:place_scaleDetect(deduction.return_day.lunch)
           },
        dinner:{
          place_id:place_idDetect(deduction.return_day.dinner),
          climate_place:detectClimatePlace(deduction.return_day.dinner),
          project_allowance:projectDetect(deduction.return_day.dinner),
          scale:place_scaleDetect(deduction.return_day.dinner)
         }
         }      
      setState({...state,c_spending_days,c_initial_day,c_return_day})
    },[deductionsLoading,place.loading,climatePlaces.loading])
  const handleOfficialSearch=(index)=>index===''?
  setState({...state,official_places:[]}):
  setState({...state,official_places:Places.searchPlaceOfficial(index)})
/**employee allowances based on places */
    const handleEmployeePlace=(type,value)=>{
      /**if rural is set by any means set day allowance to 100 birr */ 
         if((value==='rural_kebele'||state.place_type==='rural_kebele')
           &&type==='region'||value==='rural_kebele')
            {
   setState(s=>({...state,scale:100,place_type:'rural_kebele',place_id:'',
   region:type==='region'?value:s.region,...saveProcess('default')}))        
            }
       else{           
         if(type==='region'){
      let findPlace=Places.findByRegionAndType(value,state.place_type) 
     let scale=findPlace?Calculation.scale(emp_id,findPlace._id):0
      setState({
          ...state,scale,region:value,place_id:findPlace?findPlace._id:'',
         Place_Name:findPlace?findPlace.name:'',
         error:'',success:'',process:''
            })
     }
   else if(type==='place_type'){
      
     let findPlace=Places.findByRegionAndType(state.region,value) 
    let scale=findPlace?Calculation.scale(emp_id,findPlace._id):0
  setState({...state,scale,place_type:value,
       Place_Name:findPlace?findPlace.name:'',place_id:findPlace?
       findPlace._id:'',...saveProcess('default')})
       }
        }  
     }
     /**seacrh climate place */
     const searchClimate=index=>setState({...state,
      climate_places:index===''?[]:climate.searchPlace(index)
          })
         /**list avaliable climate places that are in the state */
 const listClimatePlaces=state.climate_places.length?
 state.climate_places.map(p=>{
   return(
         <tr place={p} key={p._id}>
       <td>{p.general_name}</td>
       <td>{p.name}</td>
         <td>{p.level}</td>
         <td>
         <button className="btn btn-info" onClick={()=>setClimatePlaces(p._id)}>
        <FontAwesomeIcon icon={faPlus} /> 
        set  
           </button>  
         </td>
      </tr> 
      ) 
 }):
 <tr>
   <td colSpan={3} className='text-danger font-weight-bold text-center'>
   No climate allowance places found 
   </td>
 </tr>
const listOfficialPlaces=state.official_places.length?
state.official_places.map(p=>{
  return(
     <tr key={p._id}>
          <td>{p.name}</td>
          <td>{p.region}</td>
          <td>{p.type}</td>
          <td>{Calculation.scale(emp_id,p._id)}</td>
          <td>
     <button className="btn btn-info"
      onClick={()=>setPlaces(p._id,Calculation.scale(emp_id,p._id))}>
       <FontAwesomeIcon icon={faPlus}/>
       set
       </button>       
          </td>
      </tr>
 )
}):
<td colSpan={4} className='text-danger font-weight-bold text-center'>
  No official places found
</td>
/**Drops places about intial official places
 * @param place=>place id
 * @param type=>breakfast,lunch,dinner,bed
 * @param scale=>scale of day allowance
 * @param date=>String that tell whether it is initiall date or return date
 */
const initialOfficial=(place,type,scale)=>setState({...state,
  c_initial_day:dropPlace_id(place,type,scale,state.c_initial_day),
  ...saveProcess('default')
})
 /**initial place for project allowance employee
 @param place=>string that is 'Outside' or 'Inside' addis ababa
@param type=>string that tells 'breakfast,lunch,dinner,bed' 
    */
 const initialProject=(place,type,scale)=>setState({...state,
              c_initial_day:initialFieldEmployee(place,type,scale,state.c_initial_day),
              ...saveProcess('default')})
   /**add palce object based on type
    * @param id=>refers to climate place id
    * @param type=>string that tells 'breakfast,lunch,dinner,bed' 
    */

   const BreakfastClimatePlace=(id,type)=>setState({...state,
    c_initial_day:dropInitialClimatePlace(id,type,state.c_initial_day),
    ...saveProcess('default')
     })  
   /**remove Initial place
    * @param type=>string that tells 'breakfast,lunch,dinner,bed' 
    */
   const removeInitialPlace=type=>setState({...state,
    c_initial_day:removeInitialPlaces(type,state.c_initial_day),
    ...saveProcess('default')
     })   
   
   /**remove Initial climate place
    * @param type=>string that tells 'breakfast,lunch,dinner,bed' 
    */
   const RemoveClimatePlace=type=>setState({...state,
    c_initial_day:removeClimatePlace(type,state.c_initial_day),
    ...saveProcess('default')
  })
   /**return an object of state.c_spending_days
    */
   const findSpendingDay=(id,type)=>state.c_spending_days.find(d=>d._id === id && d.type === type)
   /**
  * returns an object to set to the state for project allowance employee
  * @param {*} _id=>is string of spending day id 
  * @param {*} project_allowance => string that tails inside or outside Addis Ababa
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  * @param {*} scale => Scale of the Allowance to calculate 
  */
 const addFieldSpending=(_id,project_allowance,type,scale)=>setState({...state,
     c_spending_days:fieldSpendingDay(_id,project_allowance,type,scale,state.c_spending_days),
     ...saveProcess('default')
 }) 
 /**
  * returns an object to set to the state for project allowance employee
  * @param {*} _id=>is string of spending day id 
  * @param {*} climate_place => climate place id
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  */
 const addSpendingClimate=(_id,climate_place,type)=>setState({...state,
   c_spending_days:climateSpendingDays(_id,climate_place,type,state.c_spending_days),
   ...saveProcess('default')
 })
 /**
  * returns an object to set to the state for project allowance employee
  * @param {*} id=>is string of spending day id 
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  */
 const RemoveSpendingDay=(id,type)=>setState({...state,
  c_spending_days:removeSpendingDay(id,type,state.c_spending_days),
  ...saveProcess('default')
})
/**
  * returns an object to set to the state for project allowance employee
  * @param {*} id=>is string of spending day id 
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  */
 const RemoveClimateSpending=(id,type)=>setState({...state,
c_spending_days:removeClimateSpending(id,type,state.c_spending_days),
...saveProcess('default')
})
/**
 * set state.c_spending_day for officilal employee and normal employee
 * @param {*} id spending day id
 * @param {*} place_id  place id to calculate
 * @param {*} type  string that tells 'breakfast,lunch,dinner,bed'
 * @param {*} scale Number scale  of allowance to calculate 
 */
  const DropSpendingDays=(id,place_id,type,scale)=>setState({...state,
    c_spending_days:dropSpendingDays(id,place_id,type,scale,state.c_spending_days),
    ...saveProcess('default')
  })
/**return day functions */
/**Drops places about return official places
 * @param place=>place id
 * @param type=>breakfast,lunch,dinner,bed
 * @param scale=>scale of day allowance
 */
const returnOfficial=(place,type,scale)=>setState({...state,
  c_return_day:dropPlace_id(place,type,scale,state.c_return_day),
  ...saveProcess('default')
})
 /**return place for project allowance employee
 @param place=>string that is 'Outside' or 'Inside' addis ababa
@param type=>string that tells 'breakfast,lunch,dinner,bed' 
    */
 const returnProject=(place,type,scale)=>setState({...state,
              c_return_day:initialFieldEmployee(place,type,scale,state.c_return_day),
              ...saveProcess('default')
            })
   /**add palce object based on type for return day
    * @param id=>refers to climate place id
    * @param type=>string that tells 'breakfast,lunch,dinner,bed' 
    */

   const returnClimatePlace=(id,type)=>setState({...state,
    c_return_day:dropInitialClimatePlace(id,type,state.c_return_day),
    ...saveProcess('default')
     })  
   /**remove return place
    * @param type=>string that tells 'breakfast,lunch,dinner,bed' 
    */
   const removeReturnPlace=type=>setState({...state,
    c_return_day:removeInitialPlaces(type,state.c_return_day),
    ...saveProcess('default')
  })   
   
   /**remove return climate place
    * @param type=>string that tells 'breakfast,lunch,dinner,bed' 
    */
   const removeReturnClimate=type=>setState({...state,
    c_return_day:removeClimatePlace(type,state.c_return_day),
    ...saveProcess('default')
  })
/**totall sum calculation */
/**initial day totall scale */
const initialSum=Calculation.singleBreakfast(iBreakfast.scale)+Calculation.singleLunch(iLunch.scale)+Calculation.singleDinner(iDinner.scale)+Calculation.singleBed(iBed.scale)
/**return day totall sum */
const returnSum=Calculation.singleBreakfast(rBreakfast.scale)+Calculation.singleLunch(rLunch.scale)+Calculation.singleDinner(rDinner.scale)
/**spending day breakfast,lunch,dinner,bedSpending */
var bSpending=0,lSpending=0,dSpending=0,bedSpending=0
  deduction.spending_days.map(s=>{
bSpending=bSpending+Calculation.spendingBreakfast(id,s._id,findSpendingDay(s._id,'breakfast')?findSpendingDay(s._id,'breakfast').scale:0)
lSpending=lSpending+Calculation.spendingLunch(id,s._id,findSpendingDay(s._id,'lunch')?findSpendingDay(s._id,'lunch').scale:0)
dSpending=dSpending+Calculation.spendingDinner(id,s._id,findSpendingDay(s._id,'dinner')?findSpendingDay(s._id,'dinner').scale:0)
bedSpending=bedSpending+Calculation.spendingBed(id,s._id,findSpendingDay(s._id,'bed')?findSpendingDay(s._id,'bed').scale:0)
})
  /**totall sum of spending day */
const spendingSum=bSpending+lSpending+dSpending+bedSpending
/**totall sum of days to deducduct */
 const totallDay=Math.round((spendingSum+initialSum+returnSum)*100)/100
/**climate allowance */
/**initial climate day sum */
const initialClimateSum=Calculation.breakFastClimate(iBreakfast.climate_place,iBreakfast.scale)+
                        Calculation.lunchClimate(iLunch.climate_place,iLunch.scale)+
                        Calculation.dinnerClimate(iDinner.climate_place,iDinner.scale)+
                        Calculation.bedClimate(iBed.climate_place,iBed.scale)  
/**return climate day sum */
const returnClimateSum=Calculation.breakFastClimate(rBreakfast.climate_place,rBreakfast.scale)+
                        Calculation.lunchClimate(rLunch.climate_place,rLunch.scale)+
                        Calculation.dinnerClimate(rDinner.climate_place,rDinner.scale)   
 /**spending day climate sum */  
 var breakfastClimate=0,lunchClimate=0,dinnerClimate=0,bedClimate=0      
 deduction.spending_days.map(d=>{
 breakfastClimate=breakfastClimate+Calculation.sBreakFastClimate(id,
findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').climate_place:'',d._id,
findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').scale:0
    )
 lunchClimate=lunchClimate+Calculation.sLunchClimate(id,
findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').climate_place:'',d._id,
findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').scale:0
    ) 
dinnerClimate=dinnerClimate+Calculation.sDinnerClimate(id,
findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').climate_place:'',d._id,
findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').scale:0
    )
bedClimate=bedClimate+Calculation.sBedClimate(id,
findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').climate_place:'',d._id,
findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').scale:0
    )           
 })                  

const spendingClimateSum=breakfastClimate+lunchClimate+dinnerClimate+bedClimate
const totallClimateSum=Math.round((initialClimateSum+returnClimateSum+spendingClimateSum)*100)/100
//totall spending
const Totall=Math.round((parseFloat(deduction.petrol+deduction.maintainace+deduction.other)+totallClimateSum+totallDay)*100)/100
const allowance=Calculation.findAllowance(deduction.allowance_id)
const prePaid=allowance?allowance.totall_amount:0
const addPayment=Math.round((Totall-prePaid)*100)/100
/**error handling */
/**is an array of objects where the value is not set */
const ERROR=[]
state.c_spending_days.map(err=>{
  isFieldEmployee?err.project_allowance===''?ERROR.push(err):Donothing():
  err.place_id===''?ERROR.push(err):Donothing()
})
/**returns Boolean whether the spending day is not set or set
 * @param id=>string of spending day id
 * @param type=>string of breakfast,lunch,
 */
const errorHandle=(id,type)=>ERROR.find(e=>e._id===id && e.type===type)?true:false
  

  const handleSubmit=async (e)=>{
       e.preventDefault()
       try{
        setState({...state,...saveProcess('initial','saving please wait...')})
        let c_initial_day={ 
          breakfast:{
          place_id:iBreakfast.place_id,
          climate_place:iBreakfast.climate_place,
          project_allowance:iBreakfast.project_allowance,
          scale:Calculation.singleBreakfast(iBreakfast.scale),
          c_scale:Calculation.breakFastClimate(iBreakfast.climate_place,iBreakfast.scale)
                },
          lunch:{
          place_id:iLunch.place_id,
          climate_place:iLunch.climate_place,
          project_allowance:iLunch.project_allowance,
          scale:Calculation.singleLunch(iLunch.scale),
          c_scale:Calculation.lunchClimate(iLunch.climate_place,iLunch.scale)
              },
          dinner:{
          place_id:iDinner.place_id,
          climate_place:iDinner.climate_place,
          project_allowance:iDinner.project_allowance,
          scale:Calculation.singleDinner(iDinner.scale),
          c_scale:Calculation.dinnerClimate(iDinner.climate_place,iDinner.scale)
           },
          bed:{
          place_id:iBed.place_id,
          climate_place:iBed.climate_place,
          project_allowance:iBed.project_allowance,
          scale:Calculation.singleBed(iBed.scale),
          c_scale:Calculation.bedClimate(iBed.climate_place,iBed.scale)
            }
              }
              let c_return_day={ 
                breakfast:{
                place_id:rBreakfast.place_id,
                climate_place:rBreakfast.climate_place,
                project_allowance:rBreakfast.project_allowance,
                scale:Calculation.singleBreakfast(rBreakfast.scale),
                c_scale:Calculation.breakFastClimate(rBreakfast.climate_place,rBreakfast.scale)
                      },
                lunch:{
                place_id:rLunch.place_id,
                climate_place:rLunch.climate_place,
                project_allowance:rLunch.project_allowance,
                scale:Calculation.singleLunch(rLunch.scale),
                c_scale:Calculation.lunchClimate(rLunch.climate_place,rLunch.scale)
                    },
                dinner:{
                place_id:rDinner.place_id,
                climate_place:rDinner.climate_place,
                project_allowance:rDinner.project_allowance,
                scale:Calculation.singleDinner(rDinner.scale),
                c_scale:Calculation.dinnerClimate(rDinner.climate_place,rDinner.scale)
                 }
                    }      
            let c_spending_days=[]
         state.c_spending_days.map(d=>{
    c_spending_days.push({
      s_id:d._id,type:d.type,duration:d.duration,
      place_id:d.place_id,
      climate_place:d.climate_place,
      project_allowance:d.project_allowance,
      scale:d.type==='breakfast'?Calculation.spendingBreakfast(id,d._id,findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).scale:0):
             d.type==='lunch'?Calculation.spendingLunch(id,d._id,findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).scale:0):
             d.type==='dinner'?Calculation.spendingDinner(id,d._id,findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).scale:0):
            d.type==='bed'?Calculation.spendingBed(id,d._id,findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).scale:0):0 ,
            c_scale:d.type==='breakfast'?Calculation.sBreakFastClimate(id,
              findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).climate_place:'',d._id,
              findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).scale:0):
            d.type==='lunch'?Calculation.sLunchClimate(id,
              findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).climate_place:'',d._id,
              findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).scale:0):
             d.type==='dinner'?Calculation.sDinnerClimate(id,
              findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).climate_place:'',d._id,
              findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).scale:0):
              d.type==='bed'?Calculation.sBedClimate(id,
                findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).climate_place:'',d._id,
                findSpendingDay(d._id,d.type)?findSpendingDay(d._id,d.type).scale:0):0 
      }
      )      
         }) 
           
        const calculated_date=await getDate()   
        const data=encryptObject({
            _id:deduction._id,...userInfo(),
          f_employee:{...deduction.f_employee,calculated:true,calculated_date,save_options:state.save_options},
          c_initial_day,c_return_day,c_spending_days, 
          difference_amount:addPayment,
          climate_amount:totallClimateSum,
          day_amount:totallDay,
          totall_amount:Totall
        }) 
        const req=await axios.put(host+'/deductions',{data})
        const res=decrptObject(req.data) 
        if(res.error){
         setState({...state,...saveProcess('error',
         'Error while saving... Internal server error please try again later'
           )})
           }
          else if(!res.error&&res.updated){
           setState({...state,...saveProcess('success','deduction save success')})  
           fetch() 
          }
       }
       catch(err){
        setState({...state,...saveProcess('error',
        'Error while saving... server is not active or responding please contact admin'
              )})
       }
       
  }
  /**************Multiple set *****************/
/**
 * set the array of  state.day_place with data
 * @param {*} day_time -string('breakfast'||'lunch'.....)
 * @param {*} day_type -string('initial' || 'spending' || 'return')
 */
  const setInitialDay=(day_time,day_type)=>setState(s=>({...s,
    day_Places:s.day_Places.find(i=> i.day_time === day_time && i.day_type === day_type)?
    s.day_Places:[...s.day_Places,{id:randomId(),day_time,day_type,s_id:null}]
  }))
/**
 * unset the array of  state.day_place with data
 * @param {*} day_time -string('breakfast'||'lunch'.....)
 * @param {*} day_type -string('initial' || 'spending' || 'return')
 */
  const unSetInitialDay=(day_time,day_type)=>setState(s=>({...s,
  day_Places:s.day_Places.filter(i=> 
    (i.day_time === day_time && i.day_type!==day_type) ||
    (i.day_time !== day_time && i.day_type!==day_type ) ||
    (i.day_time !== day_time && i.day_type===day_type)
    )}))
  /**
 * set the array of  state.day_place with data
 * @param {*} day_time -string('breakfast'||'lunch'.....)
 * @param {*} day_type -string('initial' || 'spending' || 'return')
 */
const setInitialClimate=(day_time,day_type)=>setState(s=>({...s,
  Climate_Places:s.Climate_Places.find(i=>i.day_time === day_time && i.day_type === day_type)?
  s.Climate_Places:[...s.Climate_Places,{id:randomId(),day_time,day_type,s_id:null}]
   }))
/**
 * unset the array of  state.day_place with data
 * @param {*} day_time -string('breakfast'||'lunch'.....)
 * @param {*} day_type -string('initial' || 'spending' || 'return')
 */
  const unSetInitialClimate=(day_time,day_type)=>setState(s=>({...s,
Climate_Places:s.Climate_Places.filter(i=> 
  (i.day_time === day_time && i.day_type!==day_type) ||
  (i.day_time !== day_time && i.day_type!==day_type ) ||
  (i.day_time !== day_time && i.day_type===day_type)
  )}))
  /**
   * set spending day's to the array of day place
 * @param {*} day_time -string('breakfast'||'lunch'.....)
 * @param {*} day_type -string('initial' || 'spending' || 'return')
   * @param {*} s_id -spending day _id
   */
const setSpendingDay=(day_time,day_type,s_id)=>setState(s=>({...s,
  day_Places:s.day_Places.find(i=> i.day_time === day_time && i.day_type === day_type && i.s_id===s_id)?
  s.day_Places:[...s.day_Places,{id:randomId(),day_time,day_type,s_id}]
}))
 /**
   * set spending day's to the array of Climate_places
 * @param {*} day_time -string('breakfast'||'lunch'.....)
 * @param {*} day_type -string('initial' || 'spending' || 'return')
   * @param {*} s_id -spending day _id
   */
  const setSpendingClimate=(day_time,day_type,s_id)=>setState(s=>({...s,
    Climate_Places:s.Climate_Places.find(i=> i.day_time === day_time && i.day_type === day_type && i.s_id===s_id)?
    s.Climate_Places:[...s.Climate_Places,{id:randomId(),day_time,day_type,s_id}]
  }))  
  /**
   * unset spending day's to the array of day place
 * @param {*} day_time -string('breakfast'||'lunch'.....)
 * @param {*} day_type -string('initial' || 'spending' || 'return')
   * @param {*} s_id -spending day _id
   */
const unSetSpendingDay=(day_time,day_type,s_id)=>setState(s=>({...s,
day_Places: s.day_Places.find(i=> i.day_time === day_time && i.day_type === day_type && i.s_id === s_id)?
     s.day_Places.filter(S=>S.id  !== s.day_Places.find(i=> 
      i.day_time === day_time && i.day_type === day_type && i.s_id === s_id).id):
      s.day_Places
}))
/**
   * unset spending day's to the array of day place
 * @param {*} day_time -string('breakfast'||'lunch'.....)
 * @param {*} day_type -string('initial' || 'spending' || 'return')
   * @param {*} s_id -spending day _id
   */
  const unSetSpendingClimate=(day_time,day_type,s_id)=>setState(s=>({...s,
    Climate_Places: s.Climate_Places.find(i=> i.day_time === day_time && i.day_type === day_type && i.s_id === s_id)?
         s.Climate_Places.filter(S=>S.id  !== s.Climate_Places.find(i=> 
          i.day_time === day_time && i.day_type === day_type && i.s_id === s_id).id):
          s.Climate_Places
    }))
    /**
     * 
     * @param {*} places=>String 'outside' || 'inside' addis ababa 
     * @param {*} scale =>number scale to full fill
     */
const setProjectPlaces=(places,scale)=>state.day_Places.map(p=>{
  setState(s=>({
    ...s,
   c_initial_day:p.day_type==='initial'?initialFieldEmployee(places,p.day_time,scale,s.c_initial_day):
             s.c_initial_day,
   c_spending_days:p.day_type==='spending'?fieldSpendingDay(p.s_id,places,p.day_time,scale,s.c_spending_days):
   s.c_spending_days,
   c_return_day:p.day_type==='return'?initialFieldEmployee(places,p.day_time,scale,s.c_return_day):s.c_return_day,
   ...saveProcess('default')
  }))
    })
  /**
   * set to c_initial_day, c_spending_day,c_return_day of official
   * @param {*} id =>place id 
   * @param {*} scale =>scale to calculate
   */ 
   const setPlaces=(id,scale)=>state.day_Places.map(p=>{
     setState(s=>({
       ...s,
c_initial_day:p.day_type==='initial'?dropPlace_id(id,p.day_time,scale,s.c_initial_day):s.c_initial_day,
c_spending_days:p.day_type==='spending'?dropSpendingDays(p.s_id,id,p.day_time,scale,s.c_spending_days):s.c_spending_days,
c_return_day:p.day_type==='return'?dropPlace_id(id,p.day_time,scale,s.c_return_day):s.c_return_day,
...saveProcess('default')
     }))
   })
  /**add palce object based on day time
    * @param id=>refers to climate place id
    */      
   const setClimatePlaces=id=>state.Climate_Places.map(c=>{
    setState(s=>({
       ...s,
c_initial_day:c.day_type==='initial'?dropInitialClimatePlace(id,c.day_time,s.c_initial_day):s.c_initial_day,
c_spending_days:c.day_type==='spending'? climateSpendingDays(c.s_id,id,c.day_time,s.c_spending_days) :s.c_spending_days, 
c_return_day:c.day_type==='return'?dropInitialClimatePlace(id,c.day_time,s.c_return_day)  :s.c_return_day,
...saveProcess('default')
     }))
   }) 
return (
  loading||empLoading||userLoading||deductionsLoading?
  <DataLoading/>:
  error||empError||userError||deductionError?
  <ErrorLoading/>:
      <DndProvider backend={HTML5Backend} >
       <DeductionDnd.Provider value={{intialPlaceField:initialProject,BreakfastClimatePlace,
    removeInitialPlaces:removeInitialPlace,RemoveClimatePlace,initialOfficial,
    addFieldSpending,addSpendingClimate,RemoveSpendingDay,RemoveClimateSpending,
    DropSpendingDays,returnOfficial,removeReturnClimate,removeReturnPlace,returnClimatePlace,
    returnProject
               }} > 
    <div className="container mt-3">
          <div className="row">
            <div className="col-lg-12">
              <Link to='/deduction' className='float-left'>
              <button className="btn btn-outline-info">
                <FontAwesomeIcon icon={faArrowLeft} className='fa-1x' />
              </button>
              </Link>
            </div>
            <div className="col-lg-4 my-2">
              <div className="card">
                
            <h5 className="text-center font-weight-bold">
           <FontAwesomeIcon icon={faUser} />   user
            </h5>
         <p className="text-center font-weight-bold">
           From- {Calculation.Name(emp_id)} <br/>
           Department -{Calculation.Department(emp_id)} <br/>
           Is Employee official?-{isOfficial?'yes':'No'} <br/>
           Is Employe project allowance?-{isFieldEmployee?'yes':'no'} <br/>
           salary-{salary}
           </p> 
           
           </div>  
            </div>
            <div className="col-lg-4 my-2">
              <div className="card text-center">
            {/**is project allowance  */}
{
  isFieldEmployee?
<div>
<p className="font-weight-bold text-center">
  please select Inside Addis Ababa or outside Addis Ababa
     </p>
 <div className="input-container">
 
 <FontAwesomeIcon icon={faCity}  className='text-info fa-2x mx-2 my-auto '/>
 <input type="checkbox" checked={state.check.inAA} className='my-auto mx-3' 
     onChange={e=>setState(s=>({...state,check:{inAA:true,outAA:false}}))} />
     Inside Addis Ababa
      <input type="checkbox"  checked={state.check.outAA} className='my-auto mx-3' 
     onChange={e=>setState(s=>({...state,check:{inAA:false,outAA:true}}))}/>
     outside Addis Ababa    
 </div>
 <h4 className="text-center font-weight-bold">
Allowance scale: {fescale}
</h4> <br/>
<button className="btn-info  form-control" 
onClick={e=>setProjectPlaces(state.check.inAA?'Inside':state.check.outAA?'Outside':'',fescale)}>
  Set Place
</button>
</div>:
<p></p>
}
            {/**search places for official employee  */} 
            
            <div className="search-wrapper active">
            {isOfficial?    
                        <div className="input-holder">
  <input type="text" className="search-input" placeholder="Type place name"
  onChange={e=>handleOfficialSearch(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>:
                        <p></p>
            }      
          {/*Employee info */}
          <div className="mt-2">
       <p className="font-weight-bold text-center">Region</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faFlag} 
    className='text-info fa-2x mx-2 my-auto '/>
    <select className="input-field form-control my-auto" 
onChange={e=>handleEmployeePlace('region',e.target.value)}>
    <option value="">Enter region</option>
    <option value="Amhara">Amhara</option>
    <option value="Oromia">Oromia</option>
    <option value="Tigrai">Tigrai</option>
    <option value="Somalia">Somalia</option>
    <option value="Benshangul">Benshangul</option>
    <option value="Afar">Afar</option>
    <option value="Gambela">Gambela</option>
    <option value="SPNR">south nation people</option>
    <option value="Sidama">Sidama</option>
    <option value="Harari">Harari</option>
    <option value="DireDewa">DireDewa</option>
    <option value="addis_ababa">Addis Ababa</option>
  </select>
</div>
<p className="font-weight-bold text-center">
   place type
   </p>
   <div className="input-container">
 <FontAwesomeIcon icon={faCity} 
    className='text-info fa-2x mx-2 my-auto '/>
    <select className="input-field form-control my-auto" 
onChange={e=>handleEmployeePlace('place_type',e.target.value)}>
    <option value="">Enter place type</option>
    <option value="state_city">State city</option>
    <option value="zone">Zone</option>
    <option value="woreda">woreda</option>
    <option value="rural_kebele">Rural kebele</option>
  </select>
</div>
    </div> 
    <div className="text-center">
    <p className="font-weight-bold">
        Region:{state.region} <br/>
        type:{state.place_type}   <br/>
        scale:{state.scale}
    </p>
        </div>
    <button className="btn btn-info form-control"
     onClick={()=>setPlaces(state.place_id,state.scale)}>
      <FontAwesomeIcon icon={faPlus} />
     Set 
      </button>    
 </div> 
   
              </div>
            </div>
        {/**climate place */}    
            <div className="col-lg-4 my-2">
              <h4 className="text-center my-2">
                Climate Place search
              </h4>
            <div className="card text-center">
       <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" 
  placeholder="Input name of the climate place"
  onChange={e=>searchClimate(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    </div>
 
                  <p></p>
      </div>
            </div>
            {/** */}
          <div className="col-lg-12 my-2">
      {/**list places for official employee */}
      {
        isOfficial?
      <div>
      <h5 className="text-center font-weight-bold my-2">
    official places  
      </h5>
      <MDBTable hover bordered striped>
         <MDBTableHead>
                          <tr>
                          <th>
             <FontAwesomeIcon icon={faMapMarked} className='mx-2'/>                            
                place name                                
                              </th>   
                              <th>
    <FontAwesomeIcon icon={faMap} className='mx-2'/>                            
                region                               
                              </th>
<FontAwesomeIcon icon={faMap}  className='mx-2'/>
                place type
              <th>
        <FontAwesomeIcon icon={faMoneyBill} className='mx-2'/>
          scale
              </th>
              <th>
          <FontAwesomeIcon icon={faPlus} className='mx-2'/>
        set        
              </th>
                </tr>
                      </MDBTableHead>
                    <MDBTableBody>
               {listOfficialPlaces}                      
                      </MDBTableBody>
                  </MDBTable>  
                  </div>:
                  <p></p>
      }
      {/**climatePlaces show */}  
      <h5 className="text-center font-weight-bold my-2">
    climate places 
    </h5>
    <MDBTable hover>
         <MDBTableHead>
                          <tr>
                              <th>
             <FontAwesomeIcon icon={faMapMarked} className='mx-1'/>                            
                General place name                              
                              </th>
                <th>
          <FontAwesomeIcon icon={faMoneyBill} className='mx-1' />                        
                place name
                </th>
                <th>
        <FontAwesomeIcon icon={faLevelUpAlt} className='mx-1' />
        level          
                </th>
                <th>
              <FontAwesomeIcon icon={faPlus} className='mx-1' />
        set         
                </th>
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                          {listClimatePlaces}
                      </MDBTableBody>
                  </MDBTable>       
            </div>
            {/**initial day */} 
        <div className="col-lg-12 my-2">
          <div className="card">
   <h4 className="text-center">
     Initial day
     </h4>
<MDBTable hover striped bordered>
       <MDBTableHead>
<tr>
  <th>
    <FontAwesomeIcon icon={faCalendar} className='fa-1x text-info mx-2' />
       initial date
  </th>
  <th>
    <FontAwesomeIcon icon={faCalendarCheck} className='fa-1x text-info mx-2' />
       initial Time
    </th>
    <th>
    <FontAwesomeIcon icon={faPaperPlane} className='fa-1x text-info mx-2' />
       Allowance situation
    </th>
    <th>
    <FontAwesomeIcon icon={faMap} className='fa-1x text-info mx-2' />
       User Entered place
    </th>
    <th>
    <FontAwesomeIcon icon={faMapMarked} className='fa-1x text-info mx-2' />
       Place to calculate
    </th>
    <th>
      <FontAwesomeIcon icon={faSun} className='fa-1x text-info mx-2'/>
      Climate place
    </th>
    <th>
    <FontAwesomeIcon icon={faCalendar} className='fa-1x text-info' />
       Day allowance
    </th>
 
    <th>
    <FontAwesomeIcon icon={faSun} className='fa-1x text-info' />
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
    {/**place to calculate drop */}
    <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialDay('breakfast','initial'):
      unSetInitialDay('breakfast','initial')}/>
    {
      isFieldEmployee?
      <p className="text-center font-weight-bold my-auto">
      scale:{iBreakfast.scale} <br/>
      place:{iBreakfast.project_allowance}
      </p>:
    <p className="text-center font-weight-bold my-auto">
    name:{Places.placeName(iBreakfast.place_id)}  <br/>
    region:{Places.placeRegion(iBreakfast.place_id)}  <br/>
    type:{Places.placeType(iBreakfast.place_id)} <br/>
     scale:{iBreakfast.scale}  
    </p>
    }
    
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeInitialPlace('breakfast')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
    
        </td>
    
    {/**climate place drop */}
      <td>
      <input type="checkbox"  className="mx-2"
      onChange={e=>e.currentTarget.checked?setInitialClimate('breakfast','initial'):
      unSetInitialClimate('breakfast','initial')}/>   <br/>   
        <p className="text-center font-weight-bold font-italic">
  name:{climate.findClimatePlace(iBreakfast.climate_place)?
  climate.findClimatePlace(iBreakfast.climate_place).name:''} <br/>
  level:{climate.findClimatePlace(iBreakfast.climate_place)?
  climate.findClimatePlace(iBreakfast.climate_place).level:''} <br/>
  level_percent:{Calculation.climateLevel(iBreakfast.climate_place)} <br/>
       </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveClimatePlace('breakfast')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
      <td>
        {/**Day Allowance show */}
        {Calculation.singleBreakfast(iBreakfast.scale)}
      </td>
      <td>
   {/**climate place to calculate */}     
   {Calculation.breakFastClimate(iBreakfast.climate_place,iBreakfast.scale)}
      </td>
    </tr>
    <tr>
      <td>lunch</td>
      <td>
        {/**user entered place */}
        {deduction.initial_day.lunch}
        </td>
        <td>
    {/**place to calculate drop for initial lunch place*/}
    <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialDay('lunch','initial'):
      unSetInitialDay('lunch','initial')}/>
    {
      isFieldEmployee?
      <p className="text-center font-weight-bold my-auto">
      scale:{iLunch.scale} <br/>
      place:{iLunch.project_allowance}
      </p>:
    <p className="text-center font-weight-bold my-auto">
    name:{Places.placeName(iLunch.place_id)}  <br/>
    region:{Places.placeRegion(iLunch.place_id)}  <br/>
    type:{Places.placeType(iLunch.place_id)} <br/>
     scale:{iLunch.scale}  
    </p>
    }
    
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeInitialPlace('lunch')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
    
        </td>
        {/**climate lunch place set */}
      <td>
      <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialClimate('lunch','initial'):
      unSetInitialClimate('lunch','initial')}/>      
        <p className="text-center font-weight-bold font-italic">
  name:{climate.findClimatePlace(iLunch.climate_place)?
  climate.findClimatePlace(iLunch.climate_place).name:''} <br/>
  level:{climate.findClimatePlace(iLunch.climate_place)?
  climate.findClimatePlace(iLunch.climate_place).level:''} <br/>
  level_percent:{Calculation.climateLevel(iLunch.climate_place)} <br/>
       </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveClimatePlace('lunch')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
      <td>
        {/**Day Allowance of lunch show */}
        {Calculation.singleLunch(iLunch.scale)}
      </td>
      <td>
   {/**climate place to calculate */}     
  { Calculation.lunchClimate(iLunch.climate_place,iLunch.scale)}
       </td>
    </tr>
    <tr>
      <td>Dinner</td>
      <td>
        {/**user entered place */}
        {deduction.initial_day.dinner}
        </td>
        <td>
    {/**place to calculate drop for initial lunch place*/}
    <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialDay('dinner','initial'):
      unSetInitialDay('dinner','initial')}/>
    {
      isFieldEmployee?
      <p className="text-center font-weight-bold my-auto">
      scale:{iDinner.scale} <br/>
      place:{iDinner.project_allowance}
      </p>:
    <p className="text-center font-weight-bold my-auto">
    name:{Places.placeName(iDinner.place_id)}  <br/>
    region:{Places.placeRegion(iDinner.place_id)}  <br/>
    type:{Places.placeType(iDinner.place_id)} <br/>
     scale:{iDinner.scale}  
    </p>
    }
    
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeInitialPlace('dinner')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
    
        </td>
        {/**climate lunch place set */}
      <td>
      <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialClimate('dinner','initial'):
      unSetInitialClimate('dinner','initial')}/>      
        <p className="text-center font-weight-bold font-italic">
  name:{climate.findClimatePlace(iDinner.climate_place)?
  climate.findClimatePlace(iDinner.climate_place).name:''} <br/>
  level:{climate.findClimatePlace(iDinner.climate_place)?
  climate.findClimatePlace(iDinner.climate_place).level:''} <br/>
  level_percent:{Calculation.climateLevel(iDinner.climate_place)} <br/>
       </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveClimatePlace('dinner')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
      <td>
        {/**Day Allowance of Dinner show */}
        { Calculation.singleDinner(iDinner.scale)}
      </td>
      <td>
   {/**climate place to calculate */}     
{Calculation.dinnerClimate(iDinner.climate_place, iDinner.scale)}
      </td>
    </tr>
    <tr>
      <td>Bed</td>
      <td>
        {/**user entered place */}
        {deduction.initial_day.bed}
        </td>
        <td>
    {/**place to calculate drop for initial bed place*/}
    <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialDay('bed','initial'):
      unSetInitialDay('bed','initial')}/>
    {
      isFieldEmployee?
      <p className="text-center font-weight-bold my-auto">
      scale:{iBed.scale} <br/>
      place:{iBed.project_allowance}
      </p>:
    <p className="text-center font-weight-bold my-auto">
    name:{Places.placeName(iBed.place_id)}  <br/>
    region:{Places.placeRegion(iBed.place_id)}  <br/>
    type:{Places.placeType(iBed.place_id)} <br/>
     scale:{iBed.scale}  
    </p>
    }
    
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeInitialPlace('bed')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
    
        </td>
        {/**climate bed place set */}
      <td>
      <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialClimate('bed','initial'):
      unSetInitialClimate('bed','initial')}/>      
        <p className="text-center font-weight-bold font-italic">
  name:{climate.findClimatePlace(iBed.climate_place)?
  climate.findClimatePlace(iBed.climate_place).name:''} <br/>
  level:{climate.findClimatePlace(iBed.climate_place)?
  climate.findClimatePlace(iBed.climate_place).level:''} <br/>
  level_percent:{Calculation.climateLevel(iBed.climate_place)} <br/>
       </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveClimatePlace('bed')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
      <td>
        {/**Day Allowance of bed show */}
        {Calculation.singleBed(iBed.scale)}
      </td>
      <td>
   {/**climate place to calculate */}     
{Calculation.bedClimate(iBed.climate_place, iBed.scale)}
      </td>
    </tr>  
       </MDBTableBody>
       </MDBTable>   
          </div>
        </div>
      {/**spending days */}
        {
          deduction.spending_days.length?
          <div className="col-lg-12 my-2">
          <div className="card">
   <h4 className="text-center">
     spending days
     </h4>
     <MDBTable hover striped bordered >
       <MDBTableHead>
<tr>
  <th>
    <FontAwesomeIcon icon={faCalendar} className='fa-1x text-info mx-2' />
       Duration date
  </th>
  <th>
    <FontAwesomeIcon icon={faCalendarCheck} className='fa-1x text-info mx-2' />
       Duration days
    </th>
    <th>
    <FontAwesomeIcon icon={faPaperPlane} className='fa-1x text-info mx-2' />
       Allowance situation
    </th>
    <th>
    <FontAwesomeIcon icon={faMap} className='fa-1x text-info mx-2' />
       User Entered place
    </th>
    <th>
    <FontAwesomeIcon icon={faMapMarked} className='fa-1x text-info mx-2' />
       Place to calculate
    </th>
    <th>
      <FontAwesomeIcon icon={faSun} className='fa-1x text-info mx-2'/>
      Climate place
    </th>
    <th>
    <FontAwesomeIcon icon={faCalendar} className='fa-1x text-info' />
       Day allowance
    </th>
 
    <th>
    <FontAwesomeIcon icon={faSun} className='fa-1x text-info' />
       Climate Allowance
    </th>
</tr>
       </MDBTableHead>
       {
        deduction.spending_days.map(d=>{
          return(
       <MDBTableBody key={d._id} label={`deduction ${d}`}>
      
         <tr key={d._id}>
           <td rowSpan={4}>
           {ToEthiopianDateSting(Calculation.sFromDate(id,d._id))}- to -
           {ToEthiopianDateSting(Calculation.sUptoDate(id,d._id))}
           </td>
           <td rowSpan={4}>
    <h5 className="font-weight-bold">
    {Calculation.sDuration(id,d._id)}
    </h5>
           </td>
           <td>Breakfast</td>
           <td>
  {Calculation.findSpendingDay(id,d._id)?Calculation.findSpendingDay(id,d._id).breakfast:''}
             </td>
             <td style={{borderColor:errorHandle(d._id,'breakfast')?'red':''}}>
    <input type="checkbox"  className="mx-2 float-left"
onChange={e=>e.currentTarget.checked?setSpendingDay('breakfast','spending',d._id):
unSetSpendingDay('breakfast','spending',d._id)}/>    <br/>       
      {
      isFieldEmployee?
<p className="text-center font-weight-bold my-auto">
scale:{findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').scale:0} <br/>
place:{findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').project_allowance:0}
</p>:
    <p className="text-center font-weight-bold my-auto">
name:{Places.placeName(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').place_id:'')}  <br/>
region:{Places.placeRegion(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').place_id:'')}  <br/>
type:{Places.placeType(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').place_id:'')} <br/>
scale:{findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').scale:0}  
    </p>
    } 
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveSpendingDay(d._id,'breakfast')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>                  
             </td>
             <td>
           {/**climate places */}    
      <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setSpendingClimate('breakfast','spending',d._id):
      unSetSpendingClimate('breakfast','spending',d._id)}/>      
        <p className="text-center font-weight-bold font-italic">
General name:{climate.climateName(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').climate_place:'')} <br/>
name:{climate.climateName(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').climate_place:'')} <br/>
level:{climate.climateLevel(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').climate_place:'')} <br/>
level_percent:{Calculation.climateLevel(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').climate_place:'')} <br/>
      </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveClimateSpending(d._id,'breakfast')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
             <td>
     {Calculation.spendingBreakfast(id,d._id,findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').scale:0)}          
             </td>
             <td>
     {
 Calculation.sBreakFastClimate(id,
 findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').climate_place:'',d._id,
 findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').scale:0
 )      
     }          
             </td>
           </tr>
           <tr>
             <td>Lunch</td>
             <td>
  {Calculation.findSpendingDay(id,d._id)?Calculation.findSpendingDay(id,d._id).lunch:''}
             </td>
             <td style={{borderColor:errorHandle(d._id,'lunch')?'red':''}}>
    <input type="checkbox"  className="mx-2 float-left"
onChange={e=>e.currentTarget.checked?setSpendingDay('lunch','spending',d._id):
unSetSpendingDay('lunch','spending',d._id)}/>    <br/>       
      {
      isFieldEmployee?
<p className="text-center font-weight-bold my-auto">
scale:{findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').scale:0} <br/>
place:{findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').project_allowance:0}
</p>:
    <p className="text-center font-weight-bold my-auto">
name:{Places.placeName(findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').place_id:'')}  <br/>
region:{Places.placeRegion(findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').place_id:'')}  <br/>
type:{Places.placeType(findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').place_id:'')} <br/>
scale:{findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').scale:0}  
    </p>
    } 
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveSpendingDay(d._id,'lunch')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>                  
             </td>
             <td>
           {/**climate places */}    
      <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setSpendingClimate('lunch','spending',d._id):
      unSetSpendingClimate('lunch','spending',d._id)}/>      
        <p className="text-center font-weight-bold font-italic">
General name:{climate.climateName(findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').climate_place:'')} <br/>
name:{climate.climateName(findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').climate_place:'')} <br/>
level:{climate.climateLevel(findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').climate_place:'')} <br/>
level_percent:{Calculation.climateLevel(findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').climate_place:'')} <br/>
      </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveClimateSpending(d._id,'lunch')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
             <td>
{Calculation.spendingLunch(id,d._id,findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').scale:0)}          
                  
             </td>
             <td>
 {
  Calculation.sLunchClimate(id,
 findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').climate_place:'',d._id,
 findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').scale:0
 ) 
 }              
             </td>
           </tr>
           <tr>
             <td>Dinner</td>
             <td>
  {Calculation.findSpendingDay(id,d._id)?Calculation.findSpendingDay(id,d._id).dinner:''}
             </td>
             <td style={{borderColor:errorHandle(d._id,'dinner')?'red':''}}>
    <input type="checkbox"  className="mx-2 float-left"
onChange={e=>e.currentTarget.checked?setSpendingDay('dinner','spending',d._id):
unSetSpendingDay('dinner','spending',d._id)}/>    <br/>       
      {
      isFieldEmployee?
<p className="text-center font-weight-bold my-auto">
scale:{findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').scale:0} <br/>
place:{findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').project_allowance:0}
</p>:
    <p className="text-center font-weight-bold my-auto">
name:{Places.placeName(findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').place_id:'')}  <br/>
region:{Places.placeRegion(findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').place_id:'')}  <br/>
type:{Places.placeType(findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').place_id:'')} <br/>
scale:{findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').scale:0}  
    </p>
    } 
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveSpendingDay(d._id,'dinner')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>                  
             </td>
             <td>
           {/**climate places */}    
      <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setSpendingClimate('dinner','spending',d._id):
      unSetSpendingClimate('dinner','spending',d._id)}/>      
        <p className="text-center font-weight-bold font-italic">
General name:{climate.climateName(findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').climate_place:'')} <br/>
name:{climate.climateName(findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').climate_place:'')} <br/>
level:{climate.climateLevel(findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').climate_place:'')} <br/>
level_percent:{Calculation.climateLevel(findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').climate_place:'')} <br/>
      </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveClimateSpending(d._id,'dinner')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
             <td>
{Calculation.spendingDinner(id,d._id,findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').scale:0)}          
                  
             </td>
             <td>
 {
  Calculation.sDinnerClimate(id,
 findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').climate_place:'',d._id,
 findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').scale:0
 ) 
 }              
             </td>
           </tr>
           <tr>
             <td>Bed</td>
             <td>
  {Calculation.findSpendingDay(id,d._id)?Calculation.findSpendingDay(id,d._id).bed:''}
             </td>
             <td style={{borderColor:errorHandle(d._id,'bed')?'red':''}}>
    <input type="checkbox"  className="mx-2 float-left"
onChange={e=>e.currentTarget.checked?setSpendingDay('bed','spending',d._id):
unSetSpendingDay('bed','spending',d._id)}/>    <br/>       
      {
      isFieldEmployee?
<p className="text-center font-weight-bold my-auto">
scale:{findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').scale:0} <br/>
place:{findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').project_allowance:0}
</p>:
    <p className="text-center font-weight-bold my-auto">
name:{Places.placeName(findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').place_id:'')}  <br/>
region:{Places.placeRegion(findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').place_id:'')}  <br/>
type:{Places.placeType(findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').place_id:'')} <br/>
scale:{findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').scale:0}  
    </p>
    } 
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveSpendingDay(d._id,'bed')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>                  
             </td>
             <td>
           {/**climate places */}    
      <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setSpendingClimate('bed','spending',d._id):
      unSetSpendingClimate('bed','spending',d._id)}/>       
        <p className="text-center font-weight-bold font-italic">
General name:{climate.climateName(findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').climate_place:'')} <br/>
name:{climate.climateName(findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').climate_place:'')} <br/>
level:{climate.climateLevel(findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').climate_place:'')} <br/>
level_percent:{Calculation.climateLevel(findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').climate_place:'')} <br/>
      </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>RemoveClimateSpending(d._id,'bed')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
             <td>
{Calculation.spendingBed(id,d._id,findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').scale:0)}          
                  
             </td>
             <td>
 {
  Calculation.sBedClimate(id,
 findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').climate_place:'',d._id,
 findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').scale:0
 ) 
 }              
             </td>
           </tr> 
           </MDBTableBody>
          )
        })
      }   
     </MDBTable>          
          </div>
        </div>:
    <p></p>
        }
        {/**return day */}   
        <div className="col-lg-12 my-2">
          <div className="card">
   <h4 className="text-center">
     Return Day
     </h4>
     <MDBTable hover striped bordered>
       <MDBTableHead>
<tr>
  <th>
    <FontAwesomeIcon icon={faCalendar} className='fa-1x text-info mx-2' />
       Return date
  </th>
  <th>
    <FontAwesomeIcon icon={faCalendarCheck} className='fa-1x text-info mx-2' />
       Return Time
    </th>
    <th>
    <FontAwesomeIcon icon={faPaperPlane} className='fa-1x text-info mx-2' />
       Allowance situation
    </th>
    <th>
    <FontAwesomeIcon icon={faMap} className='fa-1x text-info mx-2' />
       User Entered place
    </th>
    <th>
    <FontAwesomeIcon icon={faMapMarked} className='fa-1x text-info mx-2' />
       Place to calculate
    </th>
    <th>
      <FontAwesomeIcon icon={faSun} className='fa-1x text-info mx-2'/>
      Climate place
    </th>
    <th>
    <FontAwesomeIcon icon={faCalendar} className='fa-1x text-info' />
       Day allowance
    </th>
 
    <th>
    <FontAwesomeIcon icon={faSun} className='fa-1x text-info' />
       Climate Allowance
    </th>
</tr>
       </MDBTableHead>
       <MDBTableBody>
    <tr>
      <td rowSpan={3}> 
        {/**initial date */}
        {ToEthiopianDateSting(deduction.return_date)}
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
    {/**place to calculate drop */}
    <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialDay('breakfast','return'):
      unSetInitialDay('breakfast','return')}/>
    {
      isFieldEmployee?
      <p className="text-center font-weight-bold my-auto">
      scale:{rBreakfast.scale} <br/>
      place:{rBreakfast.project_allowance}
      </p>:
    <p className="text-center font-weight-bold my-auto">
    name:{Places.placeName(rBreakfast.place_id)}  <br/>
    region:{Places.placeRegion(rBreakfast.place_id)}  <br/>
    type:{Places.placeType(rBreakfast.place_id)} <br/>
     scale:{rBreakfast.scale}  
    </p>
    }
    
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeReturnPlace('breakfast')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
    
        </td>
    
    {/**climate place drop */}
      <td>
      <input type="checkbox"  className="mx-2"
      onChange={e=>e.currentTarget.checked?setInitialClimate('breakfast','return'):
      unSetInitialClimate('breakfast','return')}/>   <br/>   
        <p className="text-center font-weight-bold font-italic">
  name:{climate.findClimatePlace(rBreakfast.climate_place)?
  climate.findClimatePlace(rBreakfast.climate_place).name:''} <br/>
  level:{climate.findClimatePlace(rBreakfast.climate_place)?
  climate.findClimatePlace(rBreakfast.climate_place).level:''} <br/>
  level_percent:{Calculation.climateLevel(rBreakfast.climate_place)} <br/>
       </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeReturnClimate('breakfast')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
      
      <td>
        {/**Day Allowance show */}
        {Calculation.singleBreakfast(rBreakfast.scale)}
      </td>
      <td>
   {/**climate place to calculate */}     
   {Calculation.breakFastClimate(rBreakfast.climate_place,rBreakfast.scale)}
      </td>
    </tr>
    <tr>
      <td>lunch</td>
      <td>
        {/**user entered place */}
        {deduction.return_day.lunch}
        </td>
        <td>
    <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialDay('lunch','return'):
      unSetInitialDay('lunch','return')}/>
    {
      isFieldEmployee?
      <p className="text-center font-weight-bold my-auto">
      scale:{rLunch.scale} <br/>
      place:{rLunch.project_allowance}
      </p>:
    <p className="text-center font-weight-bold my-auto">
    name:{Places.placeName(iLunch.place_id)}  <br/>
    region:{Places.placeRegion(iLunch.place_id)}  <br/>
    type:{Places.placeType(iLunch.place_id)} <br/>
     scale:{iLunch.scale}  
    </p>
    }
    
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeReturnPlace('lunch')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
    
        </td>
    
    {/**climate place  */}
      <td>
      <input type="checkbox"  className="mx-2"
      onChange={e=>e.currentTarget.checked?setInitialClimate('lunch','return'):
      unSetInitialClimate('lunch','return')}/>   <br/>   
        <p className="text-center font-weight-bold font-italic">
  name:{climate.findClimatePlace(rLunch.climate_place)?
  climate.findClimatePlace(rLunch.climate_place).name:''} <br/>
  level:{climate.findClimatePlace(rLunch.climate_place)?
  climate.findClimatePlace(rLunch.climate_place).level:''} <br/>
  level_percent:{Calculation.climateLevel(rLunch.climate_place)} <br/>
       </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeReturnClimate('lunch')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
      
      <td>
        {/**Day Allowance of lunch show */}
        {Calculation.singleLunch(rLunch.scale)}
      </td>
      <td>
   {/**climate place to calculate */}     
  { Calculation.lunchClimate(rLunch.climate_place,rLunch.scale)}
       </td>
    </tr>
    <tr>
      <td>Dinner</td>
      <td>
        {/**user entered place */}
        {deduction.return_day.dinner}
        </td>
        <td>
    <input type="checkbox"  className="mx-2 float-left"
      onChange={e=>e.currentTarget.checked?setInitialDay('dinner','return'):
      unSetInitialDay('dinner','return')}/>
    {
      isFieldEmployee?
      <p className="text-center font-weight-bold my-auto">
      scale:{rDinner.scale} <br/>
      place:{rDinner.project_allowance}
      </p>:
    <p className="text-center font-weight-bold my-auto">
    name:{Places.placeName(rDinner.place_id)}  <br/>
    region:{Places.placeRegion(rDinner.place_id)}  <br/>
    type:{Places.placeType(rDinner.place_id)} <br/>
     scale:{rDinner.scale}  
    </p>
    }
    
    <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeReturnPlace('dinner')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
    
        </td>
    
    {/**climate place  */}
      <td>
      <input type="checkbox"  className="mx-2"
      onChange={e=>e.currentTarget.checked?setInitialClimate('dinner','return'):
      unSetInitialClimate('dinner','return')}/>   <br/>   
        <p className="text-center font-weight-bold font-italic">
  name:{climate.findClimatePlace(rDinner.climate_place)?
  climate.findClimatePlace(rDinner.climate_place).name:''} <br/>
  level:{climate.findClimatePlace(rDinner.climate_place)?
  climate.findClimatePlace(rDinner.climate_place).level:''} <br/>
  level_percent:{Calculation.climateLevel(rDinner.climate_place)} <br/>
       </p>
       <button className="btn btn-outline-danger my-auto float-right"
     onClick={e=>removeReturnClimate('dinner')}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
      </td>
 
      <td>
        {/**Day Allowance of Dinner show */}
        { Calculation.singleDinner(rDinner.scale)}
      </td>
      <td>
   {/**climate place to calculate */}     
{Calculation.dinnerClimate(rDinner.climate_place, rDinner.scale)}
      </td>
    </tr>
    
    <tr>
      <td colSpan={6}>
        <h4 className="float-right font-weight-bold">
          Totall Day and climate allowance
        </h4>
      </td>
      <td>
        <h5 className="float-right font-weight-bold">
          {totallDay}
        </h5>
      </td>
      <td>
        <h5 className="float-right font-weight-bold">
          {totallClimateSum}
        </h5>
      </td>
      </tr>
      <tr>
        <td colSpan={7}>
          <h4 className="float-right font-weight-bold">
          petrol and gas spending
          </h4>
        </td>
        <td>
        <h5 className="float-right font-weight-bold">
          {deduction.petrol}
          </h5>   
        </td>
        </tr>
        <tr>
        <td colSpan={7}>
          <h4 className="float-right font-weight-bold">
          Maintainance and repair spending
          </h4>
        </td>
        <td>
        <h5 className="float-right font-weight-bold">
          {deduction.maintainace}
          </h5>   
        </td>
        </tr>
        <tr>
        <td colSpan={7}>
          <h4 className="float-right font-weight-bold">
          other spendings
          </h4>
        </td>
        <td>
        <h5 className="float-right font-weight-bold">
          {deduction.other}
          </h5>   
        </td>
        </tr>
        <tr>
        <td colSpan={7}>
          <h4 className="float-right font-weight-bold">
          Totall
          </h4>
        </td>
        <td>
        <h5 className="float-right font-weight-bold">
          {Totall}
          </h5>   
        </td>
        </tr>
        <tr>
        <td colSpan={7}>
          <h4 className="float-right font-weight-bold text-danger">
          prepaid amount
          </h4>
        </td>
        <td>
        <h5 className="float-right font-weight-bold text-danger">
          -{prePaid}
          </h5>   
        </td>
        </tr>
        <tr>
        <td colSpan={7}>
          {
            addPayment<0?
            <h4 className="float-right font-weight-bold text-info">
         Refundable amount
          </h4>:
          addPayment>0?
          <h4 className="float-right font-weight-bold text-info">
          Additional amount
          </h4>:
          <p></p>
          }
          
        </td>
        <td>
        <h5 className="float-right font-weight-bold text-info">
          {Math.abs(addPayment)}
          </h5>   
        </td>
        </tr>    
       </MDBTableBody>
       </MDBTable>          
          </div>
        </div> 
        {/**end of return day */}
        {/**save options */}
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
   <div className="col-lg-4 my-auto">
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
   <div className="col-lg-4 my-auto">
     <button className="btn-info form-control" onClick={e=>handleSubmit(e)}>
     <FontAwesomeIcon icon={faSave} className=' fa-2x mx-2 my-auto '/>
        Save
     </button>
     </div>
          </div>
        </div>
       </DeductionDnd.Provider>
        </DndProvider>
    )
}

export default withRouter (DeductionCalculation)
