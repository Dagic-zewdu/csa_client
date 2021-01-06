import { config } from "@fortawesome/fontawesome-svg-core";
import { Calculation } from "./Calculation";
import { DeductionClass } from "./Deductions";
import { Round } from "./saveProcess";

export class DeductionCalculate extends DeductionClass {
  constructor(deductions, allowances, employees, users, places, climatePlaces, config) {
    super(deductions, allowances, employees, users)
    this.places = places
    this.climatePlaces = climatePlaces
    this.config = config
    this.Calculation = new Calculation(places, allowances, employees, users, config, climatePlaces)
  }
  /**recieves two parameters and return scale of the employee
   * @param emp_id=>refers to employee emp_id
   * @param place_id=>refers to place _id
   */
  scale = (emp_id, place_id) => Round(this.Calculation.scale(emp_id, place_id))
  /**returns single day breakfast calculation 
   * @param scale=>scale to calculte
  */
  singleBreakfast = (scale) => Round(this.Calculation.breakfastAmount(1, scale))
  /**returns single day lunch calculation 
   * @param scale=>scale to calculte
  */
  singleLunch = (scale) => Round(this.Calculation.lunchAmount(1, scale))
  /**returns single day Dinner calculation 
  * @param scale=>scale to calculte
 */
  singleDinner = (scale) => Round(this.Calculation.dinnerAmount(1, scale))
  /**returns single day bed calculation 
   * @param scale=>scale to calculte
  */
  singleBed = (scale) => Round(this.Calculation.bedAmount(1, scale))
  /**returns climate level by percent
   * @param id=>refers to climate place _id
   */
  climateLevel = (id) => this.Calculation.climateAllowanceLevel(id)
  /**return single day climate allowance calculation of breakfast
   * @param id=>refers to place _id
   *  @param scale=>refers scale to calculate
   */
  breakFastClimate = (id, scale) => Round(parseFloat((this.climateLevel(id) / 100) * this.singleBreakfast(scale)))
  /**return single day climate allowance calculation of lunch
  * @param id=>refers to place _id
  *  @param scale=>refers scale to calculate
  */
  lunchClimate = (id, scale) => Round(parseFloat((this.climateLevel(id) / 100) * this.singleLunch(scale)))
  /**return single day climate allowance calculation bed
  * @param id=>refers to place _id
  *  @param scale=>refers scale to calculate
  */
  bedClimate = (id, scale) => Round(parseFloat((this.climateLevel(id) / 100) * this.singleBed(scale)))
  /**return single day climate allowance calculation bed
   * @param id=>refers to place _id
   *  @param scale=>refers scale to calculate
   */
  dinnerClimate = (id, scale) => Round(parseFloat((this.climateLevel(id) / 100) * this.singleDinner(scale)))
  /**returns spending day breakfast calculation
   *  @param {*} id deduction id
   * @param {*}  sid spending day id
   * @param {*} scale scale to calculate
    */
  spendingBreakfast = (id, sid, scale) => Round(this.Calculation.breakfastAmount(this.sDuration(id, sid), scale))
  /**returns spending day lunch calculation
 *  @param {*} id deduction id
 * @param {*}  sid spending day id
 * @param {*} scale scale to calculate
  */
  spendingLunch = (id, sid, scale) => Round(this.Calculation.lunchAmount(this.sDuration(id, sid), scale))
  /**returns spending day Dinner calculation
 *  @param {*} id deduction id
 * @param {*}  sid spending day id
 * @param {*} scale scale to calculate
  */
  spendingDinner = (id, sid, scale) => Round(this.Calculation.dinnerAmount(this.sDuration(id, sid), scale))
  /**returns spending day Dinner calculation
   *  @param {*} id deduction id
   * @param {*}  sid spending day id
   * @param {*} scale scale to calculate
    */
  spendingBed = (id, sid, scale) => Round(this.Calculation.bedAmount(this.sDuration(id, sid), scale))
  /**returns spending day breakfast climate allowance calculation
   * @param {*} id deduction id
   * @param {*} c_id climate place id
   * @param {*} sid spending day id
   * @param {*} scale scale amount to calculate
   */
  sBreakFastClimate = (id, c_id, sid, scale) => Round(parseFloat((this.climateLevel(c_id) / 100) * this.spendingBreakfast(id, sid, scale)))
  /**returns spending day lunch climate allowance calculation
   * @param {*} id deduction id
   * @param {*} c_id climate place id
   * @param {*} sid spending day id
   * @param {*} scale scale amount to calculate
   */
  sLunchClimate = (id, c_id, sid, scale) => Round(parseFloat((this.climateLevel(c_id) / 100) * this.spendingLunch(id, sid, scale)))
  /**returns spending day dinner climate allowance calculation
   * @param {*} id deduction id
   * @param {*} c_id climate place id
   * @param {*} sid spending day id
   * @param {*} scale scale amount to calculate
   */
  sDinnerClimate = (id, c_id, sid, scale) => Round(parseFloat((this.climateLevel(c_id) / 100) * this.spendingDinner(id, sid, scale)))
  /**returns spending day bed climate allowance calculation
   * @param {*} id deduction id
   * @param {*} c_id climate place id
   * @param {*} sid spending day id
   * @param {*} scale scale amount to calculate
   */
  sBedClimate = (id, c_id, sid, scale) => Round(parseFloat((this.climateLevel(c_id) / 100) * this.spendingBed(id, sid, scale)))

}