import React, { useEffect, useContext, useState } from 'react'
import { userInfo } from '../../users/userInfo'
import { host } from '../../config/config'
import axios from 'axios'
import {encryptObject, decrptObject} from '../../auth/encrypt'
import { StoreContext } from '../../contexts/contexts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faMoneyBill, faPen, faFlag, faCity, faUserCircle, faMapMarked, faObjectGroup, faPlusCircle, faPlus, faMoneyCheck, faPizzaSlice, faCoffee, faWineBottle, faProjectDiagram, faWineGlass, faProcedures, faSave, faLevelUpAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Calculation } from '../../../controllers/Calculation'
import { PlaceClass } from '../../../controllers/Places'
import { FieldAllowance } from '../../../controllers/FieldAllowance'
import { MDBTableHead, MDBTable, MDBTableBody } from 'mdbreact'
import { DotLoading } from '../../layout/Loading'
import {  getDate, TellDay, ToEthiopianDateSting } from '../../../controllers/Date'
import { climateClass } from '../../../controllers/climatePlaces'
   const StartCalculations=(props)=> {
    const [state,setState]=useState({
        place_id:'',
        Place_Name:'',
        region:'',
        place_type:'',
        scale:0,
        reserve:0,
        petrol:0,
        changeOption:false,
        placeFound:[],
        living_days:0,
        day_allowance:0,
        breakfast:0,
        lunch:0,
        dinner:0,
        bed:0,
        climate_allowance:0,
        totall:0,
         type:'living',
         calculated:'approve',  
        check:{
          faA_A:false,faO_A:false,living:true,
          day:false,petrol:false,reserve:false,
          pre_paid:false,draft:false,approve:true,
          climate:false
        },
        climate_id:'',     //climate id for climate allowance places  
        climate_name:'',  //climate name fokr climate allowance places
        climate_places:[],
        level:'',     //climate allowance level  
        process:'',error:'',loading:false,disable:false,success:'' 
    })
    const {allowance}=props
       const {_id:id,creater:emp_id,destination_place}=allowance
       const {allowances,users,employees,config,
        place,fieldEmployees,climatePlaces}=useContext(StoreContext)
        /**calculation class */
const calculation=new Calculation(place.state,allowances.state,
                  employees.state,users.state,config.state[0],
                  climatePlaces.state)
   const Places=new PlaceClass(place.state)               
   const fa=new FieldAllowance(fieldEmployees.state)
   /**climate places class */
   const climate=new climateClass(climatePlaces.state) 
   //totall date duration
       const durationDays=calculation.durationDate(id) 
    
       //place
      const Place=calculation.isOfficial(emp_id)?
       Places.findByName(destination_place,'official'):
       Places.findByName(destination_place,'employee')

   
       //getscale
   const scale=fa.faCheck(emp_id)? //check if the user is field allowance
   destination_place.toLowerCase().includes('ababa')? //check the destination place is in addis or outside
    fa.faIn_A_A(emp_id):fa.faOut_A_A(emp_id)
   :calculation.scale(emp_id,Place?Place._id:'')
       /**save allowance as a seen */
       const data=encryptObject({
        ...userInfo(),_id:allowance._id,
        f_pending_emp:{
          ...allowance.f_pending_emp,
          seen:true,
          seen_date:Date.now()
        }
      })
      useEffect(()=>{
        const saveSeen=async ()=>{
          const req=await axios.put(host+'/allowances',{data})
      }
      saveSeen()
   setState({...state,
    place_id:Place?Place._id:'',Place_Name:Place?Place.name:'',
    region:Place?Place.region:'',place_type:Place?Place.type:'',
    scale,changeOption:Place?true:false,
    check:{
      ...state.check,
       faA_A: fa.faCheck(emp_id)? 
       destination_place.toLowerCase().includes('ababa')?true:false:false,
       faO_A : fa.faCheck(emp_id)?
       destination_place.toLowerCase().includes('ababa')?false:true:true,
       climate:climate.searchByName(allowance.destination_place)?true:false
    },
    climate_id:climate.searchByName(allowance.destination_place)?
     climate.searchByName(destination_place)._id:'',
     climate_name:climate.searchByName(allowance.destination_place)?
     climate.searchByName(allowance.destination_place).name:'',
     climate_places:climate.findBy_Name(allowance.destination_place),
     level:climate.searchByName(allowance.destination_place)?
     climate.searchByName(allowance.destination_place).level:''
      })
    },[Place])

    /**HandleSubmit */
    const handleSubmit=async (e)=>{
      e.preventDefault()
   const GetDate=await getDate() // get date from the server
  if(state.scale<=0){
  setState({...state,error:'Error-can not identify any scale of day allowance please enter appropriate one ',
    success:'',process:''})
  }
  else{
    try{
      setState({...state,loading:true,disable:true,error:'',
          success:'',process:'saving...'})
      let Data=encryptObject({
         ...userInfo(),_id:id,
         f_pending_emp:{
          ...allowance.f_pending_emp, 
          calculated:state.calculated,
          calculated_date:GetDate,
          redone:calculation.progress(id)===16?true:false,
          redone_director:calculation.progress(id)===20?true:false
               },
        totall_amount:state.type==='living'?
        calculation.totallLivingAllowance
        (id,state.scale,state.climate_id,state.petrol,
          state.reserve):
          calculation.totallDayAllowance(
            id,state.breakfast,state.lunch,state.dinner,state.bed,state.scal.climate_idstate.place_id,state.petrolstate.pre_paid),
            reserve_amount:state.reserve,
            living_allowance:state.type==='living'?
            calculation.livingAllowance(id,state.scale):0,
            day_allowance:state.type==='day'?
            calculation.dayAllowance(state.breakfast,state.lunch,
              state.dinner,state.bed,state.scale):0,
            petrol_allowance:state.petrol,
            climate_allowance:calculation.climateAllowance(id,state.scale,state.climate_id),
            place_id:state.place_id,
            type:state.type,
            breakfast:state.breakfast,
            lunch:state.lunch,
            dinner:state.dinner,
            bed:state.bed,
            region:state.region,
            scale:state.scale,
            place_type:state.place_type,
            climate_id:state.climate_id
              })
      const req=await axios.put(host+'/allowances',{data:Data})
const res=decrptObject(req.data)
if(res.error){
  setState({...state,error:'can not save please try again later',
    success:'',process:'',disable:false,loading:false})
}
else if(!res.error&&res.updated){
  setState({...state,error:'',success:'saving success',process:'',disable:false,loading:false})
}
    }
    catch(err){
      console.log(err)
      setState({...state,error:'can not save server is not responding',
      success:'',process:'',disable:false,loading:false})
   
    }
    
  }
  
    }
    /**official allowances */
    /**employee allowances based on places */
    const handleEmployeePlace=(type,value)=>{
     /**if rural is set by any means set day allowance to 100 birr */ 
        if((value==='rural_kebele'||state.place_type==='rural_kebele')
          &&type==='region'||value==='rural_kebele')
           {
  setState(s=>({...state,scale:100,place_type:'rural_kebele',place_id:'',
  region:type==='region'?value:s.region,error:'',success:'',process:''}))        
           }
      else{           
        if(type==='region'){
     let findPlace=Places.findByRegionAndType(value,state.place_type) 
    let scale=findPlace?calculation.scale(emp_id,findPlace._id):0
     setState({
         ...state,scale,region:value,place_id:findPlace?findPlace._id:'',
        Place_Name:findPlace?findPlace.name:'',
        error:'',success:'',process:''
           })
    }
  else if(type==='place_type'){
     
    let findPlace=Places.findByRegionAndType(state.region,value) 
   let scale=findPlace?calculation.scale(emp_id,findPlace._id):0
 setState({...state,scale,place_type:value,
      Place_Name:findPlace?findPlace.name:'',
        error:'',success:'',place_id:findPlace?findPlace._id:'',
         process:''})
      }
       }  
    } 
    /**selects places from official  */
    const handleOfficialPlaces=(index)=>{
        const placeFound=index===''?[]:Places.searchPlaceOfficial(index)
           setState({...state,placeFound,})
    } 
    const addPlace=(place,scale)=>{
        let {name:Place_Name,region,type:place_type,_id,name}=place
        setState({...state,Place_Name,region,place_type,scale,place_id:_id,
          climate_id:climate.searchByName(name)?
          climate.searchByName(name)._id:'',
          climate_name:climate.searchByName(name)?
          climate.searchByName(name).name:'',
          climate_places:climate.findBy_Name(name),
          level:climate.searchByName(name)?
          climate.searchByName(name).level:'',
         check: {
      ...state.check,climate:climate.searchByName(name)?true:false
             }
        })
    }
    /**list place found for officials */
    const listOfficialPlaces=state.placeFound.map(o=>{
        return(
     <tr key={o._id}>
         <td className="text-center">
             {o.name}
         </td>
        <td>
            {calculation.scale(emp_id,o._id)}
        </td>
        <td onClick={()=>addPlace(o,calculation.scale(emp_id,o._id))}
            className='btn-outline-info btn'
            >
       <FontAwesomeIcon icon={faPlusCircle} className='fa-2x'/>
        </td>
     </tr>
        )
    })  
    /**it search places for climate allowance places and change the
     * state by found climate places
     * @param index-refers to index of climate allowance to be searched
     */
    const searchClimate=index=>setState({...state,
      climate_places:index===''?[]:climate.searchPlace(index)
          })
    
    /**set the climate place id and name which is selected
     * @param place-an object that contains information of the Climate place
     */
    const selectClimatePlace=place=>setState({...state,
      climate_id:place._id,climate_name:place.name,level:place.level
            })

/**list avaliable climate places that are in the state */
 const listClimatePlaces=state.climate_places.length?
 state.climate_places.map(p=>{
   return(
     <tr key={p._id}>
       <td className="text-center">
         {p.general_name}
       </td>
       <td className="text-center">
         {p.name}
       </td>
         <td className="text-center">
           {p.level}
         </td>
    <td className="btn btn-outline-info" onClick={()=>selectClimatePlace(p)}>
         <FontAwesomeIcon icon={faCheck} />
         </td>  
     </tr>
   )
 })
 :
 <tr>
   <td colSpan={3} className='text-danger font-weight-bold'>
   No climate allowance places found 
   </td>
 </tr>
    //render
    return (
        <form onSubmit={e=>handleSubmit(e)} >
    <div className="container">
        <div className="row">
    <div className="col-lg-4">
        <div className="card">
            <h3 className="text-center">
        Employee Info        
            </h3>
            <h5 className="text-center font-weight-bold">
     <FontAwesomeIcon icon={faUserCircle} className='mx-2 fa-2x text-light' />
         {calculation.Name(allowance.creater)}  
     </h5>
     <h5 className="text-center font-weight-bold">
     salary-{calculation.Salary(allowance.creater)}  
     </h5>
     <h5 className="text-center font-weight-bold">
      Employee is official-{calculation.isOfficial(emp_id)?
      'yes':'No'
      }   
         </h5> 
       {
           fa.faCheck(emp_id)?
           <h5 className="text-center font-weight-bold">
     Employee is project Allowance -yes          
           </h5>:
          <h5 className="text-center font-weight-bold">
          Employee is project Allowance -No  
              </h5> 
        }   
        </div>
     
    <div className="card mt-2">
    <h4 className="text-center">
        Allowance Info        
            </h4>
      <p className="text-center font-weight-bold">
        Letter id - {allowance.letter_id} 
          </p>
          <p className="text-center font-weight-bold">
         program- {allowance.program} 
           </p>
           <p className="text-center font-weight-bold">
         project Name and code- {allowance.project_name} 
           </p>
           <p className="text-center font-weight-bold">
          objective- {allowance.program} 
           </p>
           <p className="text-center font-weight-bold">
          Initial place- {allowance.initial_place} 
           </p>
           <p className="text-center font-weight-bold">
          Destination place- {allowance.destination_place} 
           </p>
           <div className="text-center font-weight-bold">
           Initial Date -{ToEthiopianDateSting(allowance.initial_date)} E.C <br/>
           <p className="font-italic small">
             {TellDay(allowance.initial_date)} G.C
             </p>   
            </div>
            <div className="text-center font-weight-bold">
            Return Date -{ToEthiopianDateSting(allowance.destination_date)} 
            <p className="font-italic small font-weight-bold">
             {TellDay(allowance.destination_date)} G.C
             </p>
             </div>
      </div>
      
     </div>
     <div className="col-lg-4">
     <h3 className="text-center">
         Data detected
     </h3>
      <h4 className="text-center font-weight-bold">
              Duration Date totall -{durationDays}
          </h4>
     <p className="text-center font-weight-bold">
      Destination place name- {state.Place_Name}
      </p>
     {
      state.place_type===''?
      <p className="text-center font-weight-bold">
        Place type-Can not detect place type please enter place type    
          </p>:
          <p className="text-center font-weight-bold">
            Place type-{state.place_type}
              </p>    
     }
     {
         state.region===''?
         <p className="text-center font-weight-bold">
      Region-can not detect place region enter region
      </p>:
      <p className="text-center font-weight-bold">
          Region-{state.region}
      </p>
     }
<p className="text-center font-weight-bold">
  climate Allowance place name: {state.climate_name}
</p>
     <p className="text-center font-weight-bold">
     climate allowance :{calculation.climateAllowanceLevel(state.climate_id)} %
            </p>
     {
         state.scale===0?
         <p className="text-center font-weight-bold font-italic text-danger">
        Day Allowance-can not detect Day allowance      
         </p>:
        <p className="text-center font-weight-bold font-italic">
            Day Allowance-{state.scale} birr
            </p> 
     }
     <div className="row">
         <div className="col-lg-6"></div>
         <div className="col-lg-6">
           {
           state.changeOption?
           <div className="btn btn-info" onClick={()=>
           setState(s=>({...state,changeOption:!s.changeOption}))    
           }>
           <FontAwesomeIcon icon={faPen} className='mx-2'  />
           change   
            </div>:
               <p></p>    
           }     
         </div>
     </div>
     {
         
      !state.changeOption?
        fa.faCheck(emp_id)? /**finance allowance employee check */
        <div className="input-container">
 <FontAwesomeIcon icon={faCity} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto">
        inside Addis ababa
    </p>
    <input type="checkbox" checked={state.check.faA_A}
     className="input-field my-auto"
     onChange={e=>setState(s=>({...state,scale:fa.faIn_A_A(emp_id),
      process:'',error:'',success:'',
      check:{
        ...state.check,faA_A:true,faO_A:false 
      }
       }))}
     />
     <p className="my-auto">
        outside Addis ababa
    </p>
    <input type="checkbox" checked={state.check.faO_A}
     className="input-field my-auto"
     onChange={e=>setState(s=>(
     {...state,scale:fa.faOut_A_A(emp_id),
      process:'',error:'',success:'',
      check:{
        ...state.check,faA_A:false,faO_A:true 
      }
       }))}
     />
</div>
        :
         calculation.isOfficial(emp_id)?
         <div className="mt-2">
         <div className="search-wrapper active">
                        <div className="input-holder">
  <input type="text" className="search-input" placeholder="Input name of the place"
  onChange={e=>handleOfficialPlaces(e.target.value)}
  />
<button className="search-icon">
                                <span></span>
                                </button>
                        </div>
    </div> 
{
    state.placeFound.length?
    <MDBTable hover>
         <MDBTableHead>
                          <tr>
                              <th>
             <FontAwesomeIcon icon={faMapMarked} className='mx-2'/>                            
                Place name                               
                              </th>
                <th>
          <FontAwesomeIcon icon={faMoneyBill} className='mx-2' />                        
                Day allowance
                </th>
              <th>
         <FontAwesomeIcon icon={faPlus} className='mx-2' />
         Select         
            </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                          {listOfficialPlaces}
                      </MDBTableBody>
                  </MDBTable>
                  :
    <p className="text-center text-danger font-weight-bold">
                      input Place name to search
        </p>
}

    </div>
         :
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
    </div>:
           <p></p>  
     }
     <p className="font-weight-bold text-center mt-3">
       climate allowance
       </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faMoneyCheck} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto mx-2">Add place of climate allowance</p>
    <input className="my-auto" type="checkbox" 
onChange={e=>setState(s=>({...state,process:'',error:'',success:'',
       check:{...state.check,climate:!s.check.climate},
     climate_id:state.check.climate?'':s.climate_id,
     climate_name:state.check.climate?'':s.climate_name
      }))} 
checked={state.check.climate} />


 </div>
 
     </div>
     <div className="col-lg-4">
    {/**Days */}
  <h3 className="text-center font-weight-bold">
      Calculate
  </h3>
  <div className="input-container">
    <FontAwesomeIcon icon={faCity} className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto">
    Living allowance
    </p>
    <input type="checkbox" className="input-field my-auto"
     onChange={e=>setState({...state,process:'',error:'',success:'',
       type:'living',check:{...state.check,living:true,day:false,both:false }})}
      checked={state.check.living}
     />
     <p className="my-auto">
        Day allowance
    </p>
    <input type="checkbox" className="input-field my-auto"
     onChange={e=>setState({...state,process:'',error:'',success:'',
      type:'day',check:{...state.check,day:true,living:false,both:false }})}
       checked={state.check.day}
     />
    
</div>
<hr/>
{ /**if day allowance in calculation*/}
     
{
      state.check.day?
      <div className="card text-center font-weight-bold">
        <hr/>
        Breakfast amount ={calculation.breakfastAmount(state.breakfast,state.scale)} <br/>
        Lunch amount={calculation.lunchAmount(state.lunch,state.scale)} <br/>
        Dinner amount={calculation.dinnerAmount(state.dinner,state.scale)} <br/>
        Bed amount={calculation.bedAmount(state.bed,state.scale)} <br/>
        climate allowance={calculation.climateAllowance(id,state.scale,state.climate_id)} <br/>
        petrol and oil amount={state.petrol} <br/>
        reserve amount={state.reserve} <br/>
  Totall Day allowance:{calculation.dayAllowance(state.breakfast,state.lunch,state.bed,state.dinner,state.scale)}
                <hr/>
     <h5 className="font-weight-bold">
       Totall:{calculation.totallDayAllowance(
   id,state.breakfast,state.lunch,state.dinner,state.bed,state.scale,
   state.climate_id,state.petrol,state.reserve      
       )}
       </h5>   
        </div>:
      <p></p>
    }
{
     state.check.living?
         <div className="text-center font-weight-bold card">
            Day allowance:{state.scale} <br/>
            Duration days:{durationDays} <br/>
            living allowance : {calculation.livingAllowance(id,state.scale)} <br/>
            climate Allowance:{calculation.climateAllowance(id,state.scale,state.climate_id)} <br/>
            petrol and oil amount:{state.petrol} <br/>
            reserve amount:{state.reserve} <br/>
            <hr/>
            <h5 className="font-weight-bold">
            Totall:{calculation.totallLivingAllowance
            (id,state.scale,state.climate_id,state.petrol,
state.reserve)}
        </h5>
     <hr/>
         </div>:
         state.check.day?
         <div className="mt-2">
         <p className="font-weight-bold text-center">
           Breakfast amount days
         </p>
         <div className="input-container"> 
         <FontAwesomeIcon icon={faCoffee} 
    className='text-info fa-2x mx-2 my-auto '/>
         <input className="input-field form-control my-auto" type="number"
 placeholder="input days" min={0} max={durationDays} onChange={e=>{
     setState({...state,breakfast:e.target.value===''?0:parseFloat(e.target.value),process:'',
     error:'',success:''
     })}}
     />
     </div>
     <p className="font-weight-bold text-center">
           Lunch amount days
         </p>
         <div className="input-container"> 
         <FontAwesomeIcon icon={faPizzaSlice} 
    className='text-info fa-2x mx-2 my-auto '/> 
         <input className="input-field form-control my-auto" type="number"
 placeholder="input days" min={0} max={durationDays} onChange={e=>{
     setState({...state,lunch:e.target.value===''?0:parseFloat(e.target.value),process:'',
     error:'',success:''
     })}}
     />  
     </div> 
     <p className="font-weight-bold text-center">
           Dinner amount days
         </p>
         <div className="input-container"> 
         <FontAwesomeIcon icon={faWineGlass} 
    className='text-info fa-2x mx-2 my-auto '/> 
         <input className="input-field form-control my-auto" type="number"
 placeholder="input days" min={0} max={durationDays} onChange={e=>{
     setState({...state,dinner:e.target.value===''?0:parseFloat(e.target.value),process:'',
     error:'',success:''
     })}}
     />  
     </div>
     <p className="font-weight-bold text-center">
           Bed amount days
         </p>
         <div className="input-container"> 
         <FontAwesomeIcon icon={faProcedures} 
    className='text-info fa-2x mx-2 my-auto '/> 
         <input className="input-field form-control my-auto" type="number"
 placeholder="input days" min={0} max={durationDays} onChange={e=>{
     setState({...state,bed:e.target.value===''?0:parseFloat(e.target.value),process:'',
     error:'',success:''
     })}}
     />  
     </div>          
           </div>:
         <p></p>
     }

{/**add petrol amount */}
<p className="font-weight-bold text-center mt-3">Petrol and oil</p>
 <div className="input-container">
 <FontAwesomeIcon icon={faMoneyCheck} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto mx-2">Add petrol and oil amount?</p>
    <input className="my-auto" type="checkbox" 
onChange={e=>setState(s=>({...state,process:'',error:'',success:'',
       check:{...state.check,petrol:!s.check.petrol},
     petrol:s.check.petrol?0:s.petrol
      }))} 
checked={state.check.petrol} />
{ 
   state.check.petrol?
  <input className="input-field form-control my-auto" type="number"
 placeholder="input amount" min={0} onChange={e=>{
     setState({...state,petrol:e.target.value===''?0:parseFloat(e.target.value),process:'',
     error:'',success:''
     })}}
     />:
     <p></p>
}
 </div>
 {/**add reserve amount */}
<p className="font-weight-bold text-center mt-3">
  Reserve amount
  </p>
 <div className="input-container">
 <FontAwesomeIcon icon={faMoneyCheck} 
    className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto mx-2">Add reserve amount?</p>
    <input className="my-auto" type="checkbox"
onChange={e=>setState(s=>({...state,process:'',error:'',success:'',
       check:{...state.check,reserve:!s.check.reserve},
       reserve:s.check.reserve?0:s.reserve
      }))} 
checked={state.check.reserve} />
{ 
   state.check.reserve?
  <input className="input-field form-control my-auto" type="number"
 placeholder='input amount' min={0} onChange={e=>{
     setState({...state,reserve:e.target.value===''?0:parseFloat(e.target.value),process:'',
     error:'',success:''})}}
     />:
     <p></p>
}


 </div>
     </div>
     <div className="col-lg-12 mt-2">
       <div className="card text-center">
       {
       state.check.climate?
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
    </div>:
    <p></p>   
     }
     {state.check.climate?
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
         <FontAwesomeIcon icon={faPlus} className='mx-2' />
         Select         
            </th>  
                 </tr>
                      </MDBTableHead>
                    <MDBTableBody>
                          {listClimatePlaces}
                      </MDBTableBody>
                  </MDBTable>:
                  <p></p>
 }
       </div>
     </div>
     <div className="col-lg-12">
       <div className="card text-center">
         
       <h3 className="text-center font-weight-bold mt-2">
        Save options
  </h3>
  <div className="input-container">
    <FontAwesomeIcon icon={faSave} className='text-info fa-2x mx-2 my-auto '/>
    <p className="my-auto">
    save as draft
    </p>
    <input type="checkbox" className="input-field my-auto"
     onChange={e=>setState({...state,process:'',error:'',success:'',
       calculated:'draft',check:{...state.check,approve:false,draft:true }})}
      checked={state.check.draft}
     />
     <p className="my-auto">
        save and start approving
    </p>
    <input type="checkbox" className="input-field my-auto"
     onChange={e=>setState({...state,process:'',error:'',success:'',
      calculated:'approve',check:{...state.check,approve:true,draft:false }})}
       checked={state.check.approve}
     />
</div>
<div className="text-center">
  <p className="text-danger text-center font-weight-bold">{state.error}</p>
 <p className="text-success text-center font-weight-bold">{state.success}</p>
 <p className="text-info text-center font-weight-bold">{state.process}</p>
 {
   state.loading?<DotLoading/>:<p></p>
  }
 </div>
{
     state.check.draft?
     <button type="submit" disabled={state.disable} className="btn btn-outline-primary  mx-5">
       save as draft
     </button>:
     <button type="submit" disabled={state.disable} className="btn btn-outline-primary mx-5">
       save and approve 
     </button>
   } 
       </div>
     </div>
        </div>
    </div>
    </form>
    )
}

export default StartCalculations
