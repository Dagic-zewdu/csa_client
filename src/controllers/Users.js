import { EmployeeClass } from "./Employees";
import { removeDuplicates } from "./removeRedudant";

export class UsersClass extends EmployeeClass {
    constructor(users,employees){
         super(employees)
        this.users=users
    }
    //get _id from employee with emp_id
     getId=(Id)=>{
         let id=Id?Id:localStorage.id
    let user=this.users.find(u=>{
        return u._id === id
    })
    let User=user?user:{emp_id:''}
    let employee=this.Find(User.emp_id)
    return employee?employee._id:''
    }
    getEmp_id=(Id)=>{
        let id=Id?Id:localStorage.id
        let user=this.users.find(u=>{
            return u._id === id
        })
        let User=user?user:{emp_id:''}
       return User.emp_id
        }
     isApproval_Manager =()=>{
       let emp_id=this.getEmp_id()
       let userType=this.UserRole(emp_id)
       let approve=userType==='director'||
       userType==='senior_officer'||
       userType==='f_director'||
       userType==='f_sector_leader'||
       userType==='sector_leader'?
       true:false
       return approve    
     }
     /**check if the current user is Finance Director */
     isFinanceDirector=()=>{
        let emp_id=this.getEmp_id()
      let userType=this.UserRole(emp_id)
      let director=userType==='f_director'?true:false
         return director
     }
     /**check if the user is Finance team leader */
     isFinanceTeamLeader=()=>{
        let emp_id=this.getEmp_id()
        let userType=this.UserRole(emp_id)
        let tl=userType==='f_team_leader'?true:false
           return tl
     }
     /**check if the user is Finance employee */
     isFinanceEmployee=()=>{
        let emp_id=this.getEmp_id()
        let userType=this.UserRole(emp_id)
        let check=userType==='f_employee'?true:false
           return check
     }  
     /**Boolean that return's true when the employee is finance director or false if not
      * @param {*} emp_id String of employee id 
      */
isF_director=emp_id=>this.Find(emp_id)?this.Find(emp_id).type === 'f_director'?true:false:false
/**retun's boolean if the user can not employee which means it it somewhere Manager 
 * @param {*} emp_id String of employee id
*/
canApprove=emp_id=>this.Find(emp_id)?this.Find(emp_id).type !== 'employee'?true:false:false
/**return's an array of object availiable finance director's  */  
getF_director=()=>this.employees.filter(e=> e.type === 'f_director')     
/**return's array of employee with filtered employee type
       @param {*} type =>String which used filter 'director' ,'sector leader'...
      */
    Type=type=>this.employees.filter(e=> e.type === type && this.getEmp_id() !== e.emp_id)
  /**
   * retun's an array of employee based on given array and employee type
   * @param {*} employees =>array of employees to search 
   @param {*} type =>String which used filter 'director' ,'sector leader'...
   */
    employeeSearch=(employees,type)=>employees.filter(e=> e.type === type && this.getEmp_id() !== e.emp_id)
   /**
   * return's array of contacts searched
   * @param {*} Index=>string to search 
   */
   ContactSearch=Index=>{
       let index=Index.toString().toLowerCase()
     let emp_id=this.employees.filter(e=> e.emp_id.toString().toLowerCase().includes(index,0) )
     let name=this.employees.filter(e=> this.Name(e.emp_id).toString().toLowerCase().includes(index,0))
     let department=this.employees.filter(e=> e.department.toString().toLowerCase().includes(index,0))
     let users=removeDuplicates([...emp_id,...name,...department],'_id')
     return{
        employees:removeDuplicates([...this.employeeSearch(users,'employee'),...this.employeeSearch(users,'f_employee')],'_id'),
         directors: this.employeeSearch(users,'director'),
         f_director:this.employeeSearch(users,'f_director'),
         team_leaders:removeDuplicates([...this.employeeSearch(users,'f_team_leader'),...this.employeeSearch(users,'team_leader')],'_id'),
         sector_leaders:this.employeeSearch(users,'sector_leader'),
        f_sector_leader:this.employeeSearch(users,'f_sector_leader'),
         commisioner:this.employeeSearch(users,'senior_officer')  
     }
   }     
    
   
}