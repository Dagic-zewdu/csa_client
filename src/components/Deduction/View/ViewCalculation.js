import { faCalendar, faCalendarCheck, faMap, faMapMarked, faPaperPlane, faSun, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact'
import React, { useContext } from 'react'
import { climateClass } from '../../../controllers/climatePlaces'
import { TellDay, ToEthiopianDateSting } from '../../../controllers/Date'
import { DeductionCalculate } from '../../../controllers/DeductionCalculate'
import { FieldAllowance } from '../../../controllers/FieldAllowance'
import { PlaceClass } from '../../../controllers/Places'
import { StoreContext } from '../../contexts/contexts'

const ViewCalculation=(props)=> {
  /**view calculation */
    const {deduction}=props
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

  const {breakfast:iBreakfast,lunch:iLunch,dinner:iDinner,bed:iBed}=deduction.c_initial_day
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
           Is Employe project allowance?-{isFieldEmployee?'yes':'no'}
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
      <p className="text-center">
          place {iBreakfast.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center">
          name : {Places.placeName(iBreakfast.place_id)} <br/>
          Region: {Places.placeName(iBreakfast.place_id)} <br/>
          scale:{Calculation.scale(iBreakfast.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center">
         general name: {climate.climateGenralName(iBreakfast.climate_id)}
         name: {climate.climateName(iBreakfast.cliate_id)}
         level: {climate.climateLevel(iBreakfast.climate_id)}
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
      <p className="text-center">
          place {iLunch.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center">
          name : {Places.placeName(iLunch.place_id)} <br/>
          Region: {Places.placeName(iLunch.place_id)} <br/>
          scale:{Calculation.scale(iLunch.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center">
         general name: {climate.climateGenralName(iLunch.climate_id)}
         name: {climate.climateName(iLunch.cliate_id)}
         level: {climate.climateLevel(iLunch.climate_id)}
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
      <p className="text-center">
          place {iDinner.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center">
          name : {Places.placeName(iDinner.place_id)} <br/>
          Region: {Places.placeName(iDinner.place_id)} <br/>
          scale:{Calculation.scale(iDinner.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center">
         general name: {climate.climateGenralName(iDinner.climate_id)}
         name: {climate.climateName(iDinner.cliate_id)}
         level: {climate.climateLevel(iDinner.climate_id)}
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
      <p className="text-center">
          place {iBed.project_allowance} Addis Ababa
      </p>
      :
      <p className="text-center">
          name : {Places.placeName(iBed.place_id)} <br/>
          Region: {Places.placeName(iBed.place_id)} <br/>
          scale:{Calculation.scale(iBed.place_id)}
      </p>
         }
        </td>
 <td>
     <p className="text-center">
         general name: {climate.climateGenralName(iBed.climate_id)}
         name: {climate.climateName(iBed.cliate_id)}
         level: {climate.climateLevel(iBed.climate_id)}
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
            </div>
        </div>
    )
}

export default ViewCalculation
