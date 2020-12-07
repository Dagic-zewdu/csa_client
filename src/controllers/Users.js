import { EmployeeClass } from "./Employees";

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
     /**check if the user is Finance Director */
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
}