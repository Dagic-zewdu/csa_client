
/**set initial place for project allowance 
@param place=>string that is 'Outside' or 'Inside' addis ababa
@param type=>string that tells 'breakfast,lunch,dinner,bed' 
@param scale=>Scale of the Allowance to calculate
@param prevState=>refers to previous state to keep
*/
export const initialFieldEmployee=(place,type,scale,prevState)=>{
    let c_initial_day={
breakfast: type==='breakfast'?{...prevState.breakfast,place_id:'',project_allowance:place,scale}:prevState.breakfast,
lunch:type==='lunch'?{...prevState.lunch,place_id:'',project_allowance:place,scale}:prevState.lunch,
dinner:type==='dinner'?{...prevState.dinner,place_id:'',project_allowance:place,scale}:prevState.dinner,
bed:type==='bed'?{...prevState.bed,place_id:'',project_allowance:place,scale}:prevState.bed
         }
        return c_initial_day
        }
/**returns an object of information about calculated initial climate Place
 * @param id=>refers to climate place id
 * @param type=>refers whether the type is breakfast,lunch,dinner,bed
 * @param prevState=>refers to previous state to keep
 */
export const dropInitialClimatePlace=(id,type,prevState)=>{
    let climate={
    breakfast:type==='breakfast'?{...prevState.breakfast,climate_place:id}:prevState.breakfast,
    lunch:type==='lunch'?{...prevState.lunch,climate_place:id}:prevState.lunch,
    dinner:type==='dinner'?{...prevState.dinner,climate_place:id}:prevState.dinner,
    bed:type==='bed'?{...prevState.bed,climate_place:id}:prevState.bed
           }
        return climate   
             }
/**returns an object of information about calculated initial climate Place
 * @param type=>refers whether the type is breakfast,lunch,dinner,bed
 * @param prevState=>refers to previous state to keep
 */             
export const removeInitialPlaces=(type,prevState)=>{
    let place={
        breakfast:type==='breakfast'?{...prevState.breakfast,place_id:'',project_allowance:'',scale:0}:prevState.breakfast,
        lunch:type==='lunch'?{...prevState.lunch,place_id:'',project_allowance:'',scale:0}:prevState.lunch,
        dinner:type==='dinner'?{...prevState.dinner,place_id:'',project_allowance:'',scale:0}:prevState.dinner,
        bed:type==='bed'?{...prevState.bed,place_id:'',project_allowance:'',scale:0}:prevState.bed
        }
        return place
} 
/**returns an object of information about calculated climate Place
 * @param type=>refers whether the type is breakfast,lunch,dinner,bed
 * @param prevState=>refers to previous state to keep
 */
export const removeClimatePlace=(type,prevState)=>{
    let climate={
        breakfast:type==='breakfast'?{...prevState.breakfast,climate_place:''}:prevState.breakfast,
        lunch:type==='lunch'?{...prevState.lunch,climate_place:''}:prevState.lunch,
        dinner:type==='dinner'?{...prevState.dinner,climate_place:''}:prevState.dinner,
        bed:type==='bed'?{...prevState.bed,climate_place:''}:prevState.bed
               }
            return climate 
}       
  /**set initial place for project allowance 
@param place_id=>place id
@param type=>string that tells 'breakfast,lunch,dinner,bed' 
@param scale=>Scale of the Allowance to calculate
@param prevState=>refers to previous state to keep
*/
export const dropPlace_id=(place_id,type,scale,prevState)=>{
    let c_initial_day={
breakfast: type==='breakfast'?{...prevState.breakfast,place_id,project_allowance:'',scale}:prevState.breakfast,
lunch:type==='lunch'?{...prevState.lunch,place_id,project_allowance:'',scale}:prevState.lunch,
dinner:type==='dinner'?{...prevState.dinner,place_id,project_allowance:'',scale}:prevState.dinner,
bed:type==='bed'?{...prevState.bed,place_id,project_allowance:'',scale}:prevState.bed
         }
        return c_initial_day
        }     
 /**returns an array information about spending day that is not equal to the id
  * and an object that is equal to the id
  * @param id=> string spending day id
  * @param type  => string that tells 'breakfast,lunch,dinner,bed'
  * @param prevState=>an array of spending days
  */
 export const filterSpendingDay=(id,type,prevState)=>{
   let spending_days=prevState.filter(d=>(d._id !== id && d.type !== type) || (d._id === id && d.type !== type) || (d._id !== id && d.type === type)) //array of objects that is not equal to the id
   let Spending_day=prevState.find(d=>d._id === id && d.type === type) // an object that is equal to the array
   let spending_day=Spending_day?Spending_day:{_id:'',type:'',duration:'',place_id:'',
                     climate_place:'',project_allowance:'',scale:0}
   return {spending_day,spending_days}
    }
 /**
  * returns an object to set to the state for project allowance employee
  * @param {*} id=>is string of spending day id 
  * @param {*} project_allowance => string that tails inside or outside Addis Ababa
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  * @param {*} scale => Scale of the Allowance to calculate
  * @param {*} prevState =>an array  of spending day 
  */
 export const fieldSpendingDay=(_id,project_allowance,type,scale,prevState)=>{
 let {spending_day,spending_days}=filterSpendingDay(_id,type,prevState)
let sd=[...spending_days,{_id,type,duration:spending_day.duration,place_id:'',
        climate_place:spending_day.climate_place,project_allowance,scale}]
  return sd
}
/**
  * returns an object to set to the state for project allowance employee
  * @param {*} _id=>is string of spending day id 
  * @param {*} place_id => string that tell place _id of the place
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  * @param {*} scale => Scale of the Allowance to calculate
  * @param {*} prevState =>an array  of spending day 
  */
export const dropSpendingDays=(_id,place_id,type,scale,prevState)=>{
let {spending_day,spending_days}=filterSpendingDay(_id,type,prevState)
let sd=[...spending_days,{_id,type,duration:spending_day.duration,place_id,
       climate_place:spending_day.climate_place, project_allowance:'',scale}]
     return sd
   }
/**
  * returns an object to set to the state for project allowance employee
  * @param {*} id=>is string of spending day id 
  * @param {*} climate_place => climate place id
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  * @param {*} prevState =>an array  of spending day 
  */
 export const climateSpendingDays=(_id,climate_place,type,prevState)=>{
   let {spending_day,spending_days}=filterSpendingDay(_id,type,prevState)
    let sd=[...spending_days,{
          _id,type,duration:spending_day.duration,place_id:spending_day.place_id,climate_place,
          project_allowance:spending_day.project_allowance,scale:spending_day.scale}]
         return sd
       }   
 /**return an array with empty string object 
  * * @param {*} _id=>is string of spending day id 
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  * @param {*} prevState =>an array  of spending day 
  * */ 
export const removeSpendingDay=(_id,type,prevState)=>{
  let {spending_day,spending_days}=filterSpendingDay(_id,type,prevState)
  let sd=[...spending_days,{_id,type,duration:spending_day.duration,place_id:'',
    climate_place:spending_day.climate_place, project_allowance:'',scale:0}]
  return sd
}  

       /**
  * returns an object to set to the state for project allowance employee
  * @param {*} id=>is string of spending day id 
  * @param {*} type  => string that tells 'breakfast,lunch,dinner,bed'
  * @param {*} prevState =>an array  of spending day 
  */
 export const removeClimateSpending=(_id,type,prevState)=>{
  let {spending_day,spending_days}=filterSpendingDay(_id,type,prevState)
  let sd=[...spending_days,{
        _id,type,duration:spending_day.duration,place_id:spending_day.place_id,
        climate_place:'',project_allowance:spending_day.project_allowance,
        scale:spending_day.scale
         }
        ]
       return sd
     }   