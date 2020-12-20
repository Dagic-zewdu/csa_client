import { faCalendar, faCalendarCheck, faMap, faMapMarked, faPaperPlane, faSun, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext, useEffect } from 'react'
import { climateClass } from '../../../controllers/climatePlaces'
import { TellDay, ToEthiopianDateSting } from '../../../controllers/Date'
import { DeductionCalculate } from '../../../controllers/DeductionCalculate'
import { FieldAllowance } from '../../../controllers/FieldAllowance'
import { PlaceClass } from '../../../controllers/Places'
import { Donothing } from '../../../controllers/saveProcess'
import { encryptObject } from '../../auth/encrypt'
import { host } from '../../config/config'
import { StoreContext } from '../../contexts/contexts'
import { userInfo } from '../../users/userInfo'

const ViewCalculation=(props)=> {
  /**view calculation */
    const {deduction,ftl}=props
    const {_id:id}=deduction
    const { allowances,deductions,employees,users, place,
        fieldEmployees,climatePlaces,config }=useContext(StoreContext)
const {state:Allowances,loading,error}=allowances
const {state:Employees,loading:empLoading,error:empError}=employees
const {state:Users,loading:userLoading,error:userError}=users
const {state:Deductions,loading:deductionsLoading,error:deductionError}=deductions
const Calculation=new DeductionCalculate(Deductions,Allowances,Employees,Users,place.state,climatePlaces.state,config.state[0])  
const fieldEmployee=new FieldAllowance(fieldEmployees.state)
const Places=new PlaceClass(place.state)
const climate=new climateClass(climatePlaces.state)
const emp_id=deduction.creater
const isOfficial=Calculation.isOfficial(emp_id) //check the deduction creater is official
const salary=Calculation.Salary(emp_id)   //salary of the employee
const isFieldEmployee=fieldEmployee.faCheck(emp_id)
/**return an object of state.c_spending_days
 * @param id -spending day id
 * @param type-string 'breakfast','lunch','dinner','bed'
    */
   const findSpendingDay=(id,type)=>deduction.c_spending_days.find(d=>d.s_id === id && d.type === type)
   

  const {breakfast:iBreakfast,lunch:iLunch,dinner:iDinner,bed:iBed}=deduction.c_initial_day
  const {breakfast:rBreakfast,lunch:rLunch,dinner:rDinner}=deduction.c_return_day
  const allowance=Calculation.findAllowance(deduction.allowance_id)
const prePaid=allowance?allowance.totall_amount:0

useEffect(()=>{
  let data=encryptObject({
       ...deduction,
       _id:deduction._id,
       f_tl_approve:{...deduction.f_tl_approve,seen:true},...userInfo() 
  })
  const setSeen=async ()=>ftl&&!deduction.f_tl_approve.seen?
  await axios.put(host+'/deductions',{data}):Donothing()
setSeen()
},[])

  return (
        <div className="container">
            <div className="row">
           <div className="col-lg-6">
               <h5 className="text-center">
               <FontAwesomeIcon icon={faUser} className='fa-2x mx-2 ' />
               User info    
               </h5>
            <p className="text-center font-weight-bold">
            <p className="text-center font-weight-bold">
           From- {Calculation.Name(emp_id)} <br/>
           Department -{Calculation.Department(emp_id)} <br/>
           Is Employee official?-{isOfficial?'yes':'No'} <br/>
           Is Employe project allowance?-{isFieldEmployee?'yes':'no'} <br/>
           salary-{salary}
           </p>  
                </p>   
           </div> 
           <div className="col-lg-6">
               <p className="float-right font-italic">
              # Deduction id-{deduction.id} <br/>
              # created date -{TellDay(deduction.created_date)}   
               </p>
               </div>    
                <div className="col-lg-12 my-2">
                    <h5 className="text-center font-weight-bold">
                        Initial days
                    </h5>
                    <div className="card">
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
        {
      isFieldEmployee?
      <p className="text-center font-weight-bold">
          place {iBreakfast.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center font-weight-bold">
          name : {Places.placeName(iBreakfast.place_id)} <br/>
          Region: {Places.placeRegion(iBreakfast.place_id)} <br/>
          scale:{Calculation.scale(emp_id,iBreakfast.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center font-weight-bold">
         general name: {climate.climateGenralName(iBreakfast.climate_place)} <br/>
         name: {climate.climateName(iBreakfast.climate_place)}  <br/>
         level: {climate.climateLevel(iBreakfast.climate_place)}
     </p>
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
        {
      isFieldEmployee?
      <p className="text-center font-weight-bold">
          place {iLunch.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center font-weight-bold">
          name : {Places.placeName(iLunch.place_id)} <br/>
          Region: {Places.placeRegion(iLunch.place_id)} <br/>
          scale:{Calculation.scale(emp_id,iLunch.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center font-weight-bold">
         general name: {climate.climateGenralName(iLunch.climate_place)} <br/>
         name: {climate.climateName(iLunch.climate_place)} <br/>
         level: {climate.climateLevel(iLunch.climate_place)}
     </p>
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
        {
      isFieldEmployee?
      <p className="text-center font-weight-bold">
          place {iDinner.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center font-weight-bold">
          name : {Places.placeName(iDinner.place_id)} <br/>
          Region: {Places.placeRegion(iDinner.place_id)} <br/>
          scale:{Calculation.scale(emp_id,iDinner.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center font-weight-bold">
         general name: {climate.climateGenralName(iDinner.climate_place)} <br/>
         name: {climate.climateName(iDinner.climate_place)}  <br/>
         level: {climate.climateLevel(emp_id,iDinner.climate_place)} 
     </p>
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
        {
      isFieldEmployee?
      <p className="text-center font-weight-bold">
          place {iBed.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center font-weight-bold">
          name : {Places.placeName(iBed.place_id)} <br/>
          Region: {Places.placeRegion(iBed.place_id)} <br/>
          scale:{Calculation.scale(emp_id,iBed.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center font-weight-bold">
         general name: {climate.climateGenralName(iBed.climate_place)} <br/>
         name: {climate.climateName(iBed.climate_place)}  <br/>
         level: {climate.climateLevel(iBed.climate_place)}
     </p>
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
                </div>
             <div className="col-lg-12">
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
      {
        isFieldEmployee?
      <p className="text-center font-weight-bold">
place {findSpendingDay(d._id,'breakfast')?
findSpendingDay(d._id,'breakfast').project_allowance:''} Addis Ababa
      </p>:
      <p className="text-center font-weight-bold">
name : {Places.placeName(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').place_id:'')} <br/>
Region: {Places.placeRegion(findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').place_id:'')} <br/>
scale:{Calculation.scale(emp_id,findSpendingDay(d._id,'breakfast')?findSpendingDay(d._id,'breakfast').place_id:'')}
      </p>
      }    
       
             </td>
             <td>
             <p className="text-center font-weight-bold">
general name: {climate.climateGenralName(findSpendingDay(d._id,'breakfast')?
            findSpendingDay(d._id,'breakfast').climate_place:'')} <br/>
name: {climate.climateName(findSpendingDay(d._id,'breakfast')?
       findSpendingDay(d._id,'breakfast').climate_place:'')}  <br/>
level: {climate.climateLevel(findSpendingDay(d._id,'breakfast')?
        findSpendingDay(d._id,'breakfast').climate_place:'')}
     </p>           
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
      {
        isFieldEmployee?
      <p className="text-center font-weight-bold">
place {findSpendingDay(d._id,'lunch')?findSpendingDay(d._id,'lunch').project_allowance:''
          } Addis Ababa
      </p>:
      <p className="text-center font-weight-bold">
name : {Places.placeName(findSpendingDay(d._id,'lunch')?
        findSpendingDay(d._id,'lunch').place_id:'')} <br/>
Region: {Places.placeRegion(findSpendingDay(d._id,'lunch')?
          findSpendingDay(d._id,'lunch').place_id:'')} <br/>
scale:{Calculation.scale(emp_id,findSpendingDay(d._id,'lunch')?
          findSpendingDay(d._id,'lunch').place_id:'')}
      </p>
      }    
       
             </td>
             <td>
             <p className="text-center font-weight-bold">
general name: {climate.climateGenralName(findSpendingDay(d._id,'lunch')?
            findSpendingDay(d._id,'lunch').climate_place:'')} <br/>
name: {climate.climateName(findSpendingDay(d._id,'lunch')?
       findSpendingDay(d._id,'lunch').climate_place:'')}  <br/>
level: {climate.climateLevel(findSpendingDay(d._id,'lunch')?
        findSpendingDay(d._id,'lunch').climate_place:'')}
     </p>           
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
      {
        isFieldEmployee?
      <p className="text-center font-weight-bold">
place {findSpendingDay(d._id,'dinner')?findSpendingDay(d._id,'dinner').project_allowance:''
          } Addis Ababa
      </p>:
      <p className="text-center font-weight-bold">
name : {Places.placeName(findSpendingDay(d._id,'dinner')?
        findSpendingDay(d._id,'dinner').place_id:'')} <br/>
Region: {Places.placeRegion(findSpendingDay(d._id,'dinner')?
          findSpendingDay(d._id,'dinner').place_id:'')} <br/>
scale:{Calculation.scale(emp_id,findSpendingDay(d._id,'dinner')?
          findSpendingDay(d._id,'dinner').place_id:'')}
      </p>
      }    
       
             </td>
             <td>
             <p className="text-center font-weight-bold">
general name: {climate.climateGenralName(findSpendingDay(d._id,'dinner')?
            findSpendingDay(d._id,'dinner').climate_place:'')} <br/>
name: {climate.climateName(findSpendingDay(d._id,'dinner')?
       findSpendingDay(d._id,'dinner').climate_place:'')}  <br/>
level: {climate.climateLevel(findSpendingDay(d._id,'dinner')?
        findSpendingDay(d._id,'dinner').climate_place:'')}
     </p>           
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
      {
        isFieldEmployee?
      <p className="text-center font-weight-bold">
place {findSpendingDay(d._id,'bed')?findSpendingDay(d._id,'bed').project_allowance:''
          } Addis Ababa
      </p>:
      <p className="text-center font-weight-bold">
name : {Places.placeName(findSpendingDay(d._id,'bed')?
        findSpendingDay(d._id,'bed').place_id:'')} <br/>
Region: {Places.placeRegion(findSpendingDay(d._id,'bed')?
          findSpendingDay(d._id,'bed').place_id:'')} <br/>
scale:{Calculation.scale(emp_id,findSpendingDay(d._id,'bed')?
          findSpendingDay(d._id,'bed').place_id:'')}
      </p>
      }    
       
             </td>
             <td>
             <p className="text-center font-weight-bold">
general name: {climate.climateGenralName(findSpendingDay(d._id,'bed')?
            findSpendingDay(d._id,'bed').climate_place:'')} <br/>
name: {climate.climateName(findSpendingDay(d._id,'bed')?
       findSpendingDay(d._id,'bed').climate_place:'')}  <br/>
level: {climate.climateLevel(findSpendingDay(d._id,'bed')?
        findSpendingDay(d._id,'bed').climate_place:'')}
     </p>           
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
        {
      isFieldEmployee?
      <p className="text-center font-weight-bold">
          place {rBreakfast.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center font-weight-bold">
          name : {Places.placeName(rBreakfast.place_id)} <br/>
          Region: {Places.placeRegion(rBreakfast.place_id)} <br/>
          scale:{Calculation.scale(emp_id,rBreakfast.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center font-weight-bold">
         general name: {climate.climateGenralName(rBreakfast.climate_place)} <br/>
         name: {climate.climateName(rBreakfast.climate_palce)}  <br/>
         level: {climate.climateLevel(rBreakfast.climate_place)}
     </p>
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
        {
      isFieldEmployee?
      <p className="text-center font-weight-bold">
          place {rLunch.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center font-weight-bold">
          name : {Places.placeName(rLunch.place_id)} <br/>
          Region: {Places.placeRegion(rLunch.place_id)} <br/>
          scale:{Calculation.scale(emp_id,rLunch.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center font-weight-bold">
         general name: {climate.climateGenralName(rLunch.climate_place)} <br/>
         name: {climate.climateName(rLunch.climate_place)} <br/>
         level: {climate.climateLevel(rLunch.climate_place)}
     </p>
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
        {
      isFieldEmployee?
      <p className="text-center font-weight-bold">
          place {rDinner.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center font-weight-bold">
          name : {Places.placeName(rDinner.place_id)} <br/>
          Region: {Places.placeRegion(rDinner.place_id)} <br/>
          scale:{Calculation.scale(emp_id,rDinner.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center font-weight-bold">
         general name: {climate.climateGenralName(rDinner.climate_place)} <br/>
         name: {climate.climateName(rDinner.climate_place)}  <br/>
         level: {climate.climateLevel(emp_id,rDinner.climate_place)} 
     </p>
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
      <td colSpan={6}>
        <h4 className="float-right font-weight-bold">
          Totall Day and climate allowance
        </h4>
      </td>
      <td>
        <h5 className="float-right font-weight-bold">
          {deduction.day_amount}
        </h5>
      </td>
      <td>
        <h5 className="float-right font-weight-bold">
          {deduction.climate_amount}
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
          {deduction.totall_amount}
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
            deduction.difference_amount<0?
            <h4 className="float-right font-weight-bold text-info">
         Refundable amount
          </h4>:
          deduction.difference_amount>0?
          <h4 className="float-right font-weight-bold text-info">
          Additional amount
          </h4>:
          <p></p>
          }
          
        </td>
        <td>
        <h5 className="float-right font-weight-bold text-info">
          {Math.abs(deduction.difference_amount)}
          </h5>   
        </td>
        </tr>    
       </MDBTableBody>
       </MDBTable>          
          </div>
        </div>
      {/** */}  
               </div>   
            </div>
        </div>
    )
}

export default ViewCalculation
