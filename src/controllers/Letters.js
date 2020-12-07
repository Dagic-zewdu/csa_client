import { EmployeeClass } from "./Employees"
import { UsersClass } from "./Users"
import { removeDuplicates } from "./removeRedudant"

export class LettersClass extends EmployeeClass{
     constructor(letters,employees,users){
         super(employees)
         this.letters=letters
         this.users=users
     }
     //getting individual info of letter
     lettersInfo=(letterId)=>{
        let LettersInfo=this.letters.find(l=>{
         return  l._id === letterId
        })
        return LettersInfo
     }
    //convert user id to employee id
    convert_id=(id)=>{
        let Id=id?id:localStorage.id
        let user=new UsersClass(this.users,this.employees)
       return   user.getId(Id)
       }
       //participation later
     participationLetter=()=>{
       let _id=this.convert_id()
       //getting user info
       let user=this.getUserInfo(_id)
       //getting  particiaption later that employee have 
       let pl=user?user.participation_letter?user.participation_letter:[]:[]
        let Letters= [...pl.map(p=>{
            return this.lettersInfo(p.id)
        })]
        return Letters.reverse()
     }
     //accepted letters
     acceptedLetter=()=>{
        let _id=this.convert_id()
        //getting user info
        let user=this.getUserInfo(_id)
        //getting  particiaption later that employee have 
        let al=user?user.accepted_letters?user.accepted_letters:[]:[]
         let Letters= [...al.map(a=>{
             return this.lettersInfo(a.id)
         })]
         return Letters.reverse()
      }
     //all letters of employee 
     allLetters=()=>{
        const pl=this.participationLetter()
        const ac=this.acceptedLetter()
        const all=[...pl?pl:[],...ac?ac:[]]
       const All=all.length?all[0]?removeDuplicates(all,'_id'):[]:[]
       return All
     }
     viewLetter=()=>{
       const unseen=this.allLetters().filter(l=>{
                 return !l.seen
         })
        const seen=this.allLetters().filter(l=>{
                return l.seen
        })
        return {unseen,seen} 
     }
     //check if the letter is approved before
      approvedLetters=()=>{
        let _id=this.convert_id()
        //getting user info
        let user=this.getUserInfo(_id)
        //getting  approved later that employee have 
        let pl=user?user.approved_letters?user.approved_letters:[]:[]
         //find the letter
       let Letters= [...pl.map(p=>{
            return this.lettersInfo(p.id)
        })]  
        return Letters.reverse()
      } 
      //check if the letter is accepted
      isAccepted=(id)=>{
         //getting user id and converting to employee _id
         let _id=this.convert_id()
         //getting user info
         let user=this.getUserInfo(_id)
        let Check=user.accepted_letters?
         user.accepted_letters.filter(al=>{
           return al.id === id  
        }):[]
        let check=Check.length?true:false   
       return check
      }
      //check the letter is approved or not
      isApproved=(id)=>{
         //getting user id and converting to employee _id
         let _id=this.convert_id()
         //getting user info
         let user=this.getUserInfo(_id)
        let Check=user.approvedLetters?
           user.approved_letters.filter(ap=>{
              return ap.id === id  
           }):[]
        let check=Check.length?true:false   
       //true-represent letter is approved false-represents letter need approval
       return check
      }
      //check if the letter is participation
      isParticipation=(id)=>{
        //getting user id and converting to employee _id
        let _id=this.convert_id()
       //getting user info
       let user=this.getUserInfo(_id)
        let Check=user.participation_letter?
           user.participation_letter.filter(pl=>{
              return pl.id === id  
           }):[]
        let check=Check.length?true:false   
       //true-represent letter is particpation letter false respresrnts letter is not
       return check
      }   
}