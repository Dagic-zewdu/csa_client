import { UsersClass } from "./Users"
import { removeDuplicates } from "./removeRedudant"

export class LettersClass extends UsersClass{
     constructor(letters,employees,users){
         super(users,employees)
         this.letters=letters
     }
   
}