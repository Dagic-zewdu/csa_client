
export class FieldAllowance {
    constructor(employees){
     this.employees=employees   
    }
    /**accepts emp_id of the field employee and returns info of the employee
     * as an object
      */
   findEmployee=(id)=>{
     const employee=this.employees.find(f=>{
       return f.emp_id === id  
     })
     return employee
   }
   /**accepts emp_id and returns field allowance in addis ababa if user is not
    * found it return 0
    */
   faIn_A_A=(id)=>this.findEmployee(id)?this.findEmployee(id).inside_addis_ababa:0  
   
     /**accepts emp_id and returns field allowance outside addis ababa if user is not
    * found it return 0
    */
   faOut_A_A=(id)=>this.findEmployee(id)?this.findEmployee(id).outside_addis_ababa:0  
    
/**accepts emp_id and returns field allowance position of the employee
 *  if employee is not found returns empty string
*/
   faPosition=(id)=> this.findEmployee(id)?this.findEmployee(id).postion:''  
   /**accepts emp_id and return whether the the employee have field allowance
    * or not
    *  */  
   faCheck=(id)=>this.findEmployee(id)?true:false
   
}