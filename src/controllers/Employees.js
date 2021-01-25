import { removeDuplicates } from "./removeRedudant"

export class EmployeeClass{
     constructor(employees){
         this.employees=employees
     }
     Filter=id=>this.employees.filter(e=>e.emp_id === id)
     
     UnFilter=(id)=>{
        let employee=this.employees.filter(e=>{
            return  e.emp_id !== id
        })
        return employee
     }
     /**accepts emp_id and return employee object */
     Find=(id)=>this.employees.find(e=>e.emp_id === id)
    /**return's object of employee info
     * @param {*} id -employee _id not emp_id
     */
     getUserInfo=id=>this.employees.find(e=> e._id === id)
       
    Name=(id)=>{
      let first_name=this.Find(id)?this.Find(id).first_name:''
      let middle_name=this.Find(id)?this.Find(id).middle_name:''
      let last_name=this.Find(id)?this.Find(id).last_name:''
      return (first_name+' '+middle_name+' '+last_name)
    }
    
    Emp_id=(id)=>{
      let emp_id=this.Find(id)?this.Find(id).emp_id:'' 
      return emp_id 
    }
    Department=(id)=>{
        let department=this.Find(id)?this.Find(id).department:'' 
        return department
    }
    UserRole=(id)=>{
        let userole=this.Find(id)?this.Find(id).type:'' 
        return userole
    }
    findUser=(id)=>{
       let found=this.Filter(id).length?true:false
       return found
      }
      /**finds avaliable managers from given department */
    avaliableManager=(department)=>{
     let managers=department==='finance'||department==='Finance'?
       this.employees.filter(e=>{
       return  e.department === department &&
( e.type==='f_director' || e.type === 'f_sector_leader')  
       })
     :this.employees.filter(e=>{
         return e.department === department &&
         ( e.type === 'sector_leader' || e.type === 'director')
     })
     return managers
    }
    /**returns availiable finance team leader */
    F_TeamLeader=()=>{ 

      let teamLeaders=this.employees.filter(f=>{
          return f.type === 'f_team_leader'
      })
      return teamLeaders     
    }
    /**returns availiable finance employee */
    F_Employee=()=>this.employees.filter(f=> f.type === 'f_employee')
      /**accepts emp_id and returns employee salary */
      Salary=(id)=> this.Find(id)?this.Find(id).salary:0
      
      /**accepts emp_id and returns whether the employee is official or not */
      isOfficial=(id)=> this.Find(id)?this.Find(id).official?true:false:false
      
      /**Accepts emp_id and returns position of  the official if it is official
       * employee.... returns empty string if the user is not found and
       * not official employee
       */
     officialPosition=(id)=>this.isOfficial(id)?this.Find(id).position:'' 
      /** returns first name and last Name only
     @param {*} emp_id =>string of emp_id
     */
    messageName=emp_id=>this.Name(emp_id).split(' ')[0]+' '+this.Name(emp_id).split(' ')[1]
    /**return's two first letter string of one letter from first name one letter from last name
     * @param {*} emp_id =>emp_id of the user 
     */   
    firstLetters=emp_id=>(this.messageName(emp_id).split(' ')[0].slice(0,1)+
                 this.messageName(emp_id).split(' ')[1].slice(0,1)).toUpperCase()  
      /**return's an array of user resulted from searched
       * @param {*} Index - String to search
       */           
  searchEmployee=Index=>{
  let index=Index.toString().toLowerCase()
//search by emp_id
let emp_id=this.employees.filter(e=> e.emp_id.toString().toLowerCase().includes(index,0))
  //search by name
let name=this.employees.filter(n=> this.Name(n.emp_id).toString().toLowerCase().includes(index,0))
//search department
let department=this.employees.filter(e=> e.department.toString().toLowerCase().includes(index,0))  
//user role
let role=this.employees.filter(e=> e.type.toString().toLowerCase().includes(index,0) )
  return removeDuplicates([...name,...department,...role,...emp_id],'_id') 
}      
    }