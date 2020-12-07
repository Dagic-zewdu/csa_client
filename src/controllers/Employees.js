export class EmployeeClass{
     constructor(employees){
         this.employees=employees
     }
     Filter=(id)=>{
        let employee=this.employees.filter(e=>{
            return  e.emp_id === id
        })
        return employee  
     }
     UnFilter=(id)=>{
        let employee=this.employees.filter(e=>{
            return  e.emp_id !== id
        })
        return employee
     }
     /**accepts emp_id and return employee object */
     Find=(id)=>{
        let employee=this.employees.find(e=>{
            return  e.emp_id === id
        })
        return employee  
     }
     getUserInfo=(id)=>{
        let employee=this.employees.find(e=>{
            return  e._id === id
        })
        return employee
     }
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
    F_Employee=()=>{ 

        let employees=this.employees.filter(f=>{
            return f.type === 'f_employee'
        })
        return employees     
      }
      /**accepts emp_id and returns employee salary */
      Salary=(id)=>{
        return this.Find(id)?this.Find(id).salary:0
      }
      /**accepts emp_id and returns whether the employee is official or not */
      isOfficial=(id)=>{
       return this.Find(id)?this.Find(id).official?true:false:false
      }
      /**Accepts emp_id and returns position of  the official if it is official
       * employee.... returns empty string if the user is not found and
       * not official employee
       */
     officialPosition=(id)=>this.isOfficial(id)?this.Find(id).position:''      
     
   
    }