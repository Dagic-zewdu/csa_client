import { AllowanceClass } from "./Allowance";
import { climateClass } from "./climatePlaces";
import { PlaceClass } from "./Places";

export class Calculation extends AllowanceClass{

  constructor(places,allowances,employees,users,config,climatePlaces)
  {
    super(allowances,employees,users)  
    this.places=places
    this.config=config
    this.climatePlaces=climatePlaces    
  }
        /**calculation it accepts letter id and returns duration date btn initial date 
         destination date */
         durationDate=(id)=>{
            const DateNow=Date.now()
            let Initial_date=this.findAllowance(id)?
                this.findAllowance(id).initial_date:DateNow
            let destination_date=this.findAllowance(id)?
            this.findAllowance(id).destination_date:DateNow
             let i_date=new Date(Initial_date) 
             let d_date=new Date(destination_date)
             let duration=d_date.getTime()-i_date.getTime()
             let Duration=duration/(1000*3600*24)
             return Duration+1   
          }
/**accepts emp_id and place_id of and returns day allowance with appropriate 
 * scale
 * */ 
scale=(emp_id,place_id)=>{
  let salary=this.Salary(emp_id)
  let placeClass=new PlaceClass(this.places)
    let place=placeClass.findPlace(place_id)
          //get position
     const postion=this.officialPosition(emp_id)
     if(salary===0&&!this.isOfficial(emp_id)){
      return 0
    }
    else{
        //scale of official employees
      if(this.isOfficial(emp_id)&&postion!=='medium_manager') {
   let scale=place?
      postion==='superintendent'?place.superintendent_allowance:
       postion==='commissioner'?place.higher_officer_allowance :
       postion==='spr_member_1'?place.spr_members_1:
       postion==='spr_member_2'?place.spr_members_2:
       postion==='others'?place.other_allowances:
       place.type==='rural_kebele'?100:0:0
       return scale  
      }
      else if(!this.isOfficial(emp_id)||postion==='medium_manager'){
    let scale=place?salary<3933?place.normal_scale_1:
      salary<9055&&salary>=3933?place.normal_scale_2:
      salary>=9055?place.normal_scale_3:
      place.type==='rural_kebele'?100:0:0
      return scale  
      } 
    }
  }
  /**returns cliamte allowance based on configuration 
  * @param id=>refers to place _id
  * */ 
 climateAllowanceLevel=(id)=>{
    let place=new climateClass(this.climatePlaces)
    let cp=place.findClimatePlace(id)
    
    let climate=cp?
    parseFloat(cp.level==='level_1'?
    this.config.climate_1:cp.level==='level_2'?
    this.config.climate_2:cp.level==='level_3'?
    this.config.climate_3:0):0
    return climate 
 }
 /**calculates climate allowance 
  * @param id=>refers to allowance id
  * @param scale=>refers to day allowance
  * @param place_id=>refers to climate place _id
 */
   climateAllowance=(id,scale,place_id)=>{
    let duration=parseFloat(this.durationDate(id))
    let climate=parseFloat(this.climateAllowanceLevel(place_id))
   let totall_day_allowance=parseFloat(duration*scale)
     return totall_day_allowance*(climate/100)
     }
 /**calculates living allowance 
  * @param id=>refers to allowance _id
  * @param scale=>refers to day allowance
  * */ 
   livingAllowance=(id,scale)=>{
    let duration=parseFloat(this.durationDate(id))
    return parseFloat(duration*scale)
    }
    /**calculates totall allowance id,scale and place_id is required fields 
  * @param id=>refers to allowance id
  * @param scale=>refers to day allowance
  * @param place_id=>refers to climate place id
  * @param petrol=>petrol allowance amount
  * @param reserve=>reserve allowance amount
  * 
 */
    totallLivingAllowance=(id,scale,place_id,petrol,reserve)=>{
      let Petrol=petrol?petrol:0
      let Reserve=reserve?reserve:0 
      let living_allowance=this.livingAllowance(id,scale)
      let climate_allowance=this.climateAllowance(id,scale,place_id)
     return parseFloat(living_allowance+climate_allowance+Petrol+Reserve) 
    }
    /**calculates breakfast amount days
     * @param breakfast=>refers to breakfast ammount days
     */
    breakfastAmount=(breakfast,scale)=>{
      let bk=parseFloat(scale*(this.config.breakfast/100))
     return parseFloat(bk*breakfast) 
    }
    /**calculates lunch amount days
     * @param lunch=>refers to  lunch ammount days
     */
    lunchAmount=(lunch,scale)=>{
      let Lunch=parseFloat(scale*(this.config.lunch/100))
     return parseFloat(lunch*Lunch) 
    }
    /**calculates dinner amount days
     * @param dinner=>refers to dinner ammount days
     */
    dinnerAmount=(dinner,scale)=>{
      let Dinner=parseFloat(scale*(this.config.dinner/100))
     return parseFloat(Dinner*dinner) 
    }
     /**calculates bed amount days
     * @param bed=>refers to break bed ammount days
     */
    bedAmount=(bed,scale)=>{
      let Bed=parseFloat(scale*(this.config.bed/100))
     return parseFloat(bed*Bed) 
    }
  /**calculates day allowance
   *  @param breakfast=>refers to breakfast ammount days
   *  @param lunch=>refers to lunch ammount days
   * @param dinner=>refers to dinner ammount days
   * @param bed=>refers to bed amount days
   */
    dayAllowance=(breakfast,lunch,dinner,bed,scale)=>{
      let Scale=scale?scale:0
      let Breakfast=breakfast?this.breakfastAmount(breakfast,Scale):0
      let Lunch=lunch?this.lunchAmount(lunch,Scale):0
      let Dinner=dinner?this.dinnerAmount(dinner,Scale):0
      let Bed=bed?this.bedAmount(bed,Scale):0
     return parseFloat(Breakfast+Lunch+Dinner+Bed)  
    }
    /**calculates totall day allowance
     * @param id=>refers to allowance id
     *  @param breakfast=>refers to breakfast ammount days
   *  @param lunch=>refers to lunch ammount days
   * @param dinner=>refers to dinner ammount days
   * @param bed=>refers to bed amount days
   * * @param place_id=>refers to climate place _id
  * @param petrol=>petrol allowance amount
  * @param reserve=>reserve allowance amount
  * @param prePaid=> pre paid amount
     */
   totallDayAllowance=(id,breakfast,lunch,dinner,bed,scale,place_id,petrol,reserve)=>{
  let dayAllowance=this.dayAllowance(breakfast,lunch,dinner,bed,scale)
  let climate=this.climateAllowance(id,scale,place_id)
   return parseFloat(dayAllowance+climate+reserve+petrol)
   }          
}
