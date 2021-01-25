import { UsersClass } from "./Users"
import { removeDuplicates } from "./removeRedudant"
import { Donothing } from "./saveProcess"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"

export class LettersClass extends UsersClass{
     constructor(letters,users,employees){
         super(users,employees)
         this.letters=letters
     }
     /**find letter based on given _id
      * @param {*} id - string of letter of letter id
      */
   find_letter=id=>this.letters.find(l=>l._id === id)  
  /**return's object of editorState for react-wywisgy description of the letter
   * @param {*} id - string of letter of letter id
   */
   description=id=>this.find_letter(id)?JSON.parse(this.find_letter(id).description):''
   /**retun's an object for react-wyiswgy editor
     * @param {*} id - string of letter id
    */
   editorState=id=>this.description(id)?EditorState.createWithContent(
    convertFromRaw(this.description(id))):EditorState.createEmpty()
   /**retun's string description text of the letter
     * @param {*} id - string of letter id
   */
 description_text=id=>this.description(id)?
   this.description(id).blocks[0]?this.description(id).blocks[0].text:''+
  '<br/>'+ this.description(id).blocks[1]?this.description(id).blocks[1].text:''
   :''
   /**returns title of the letter
     * @param {*} id - string of letter id
   */
  title=id=>this.find_letter(id)?this.find_letter(id).title:''
  /**return's array of approval managers of the letter
     * @param {*} id - string of letter id 
   */
  approval_managers=id=>this.find_letter(id)?this.find_letter(id).approval_manager:[]
  /**return's of object about the information of the approval manager
   * @param {*} id - string of letter id 
   * @param {*} emp_id - string of employee id
   */
  manager_info=(id,emp_id)=>this.approval_managers(id).find(m=> m.emp_id === emp_id)
  /**return's participants of the letter 
   * @param {*} id - string of letter id 
   */
  participants=id=>this.find_letter(id)?this.find_letter(id).participants:[]
  /**return's object information about the letter participant
   * @param {*} id - string of letter id 
   * @param {*} emp_id - string of employee id
   */
  particpant_info=(id,emp_id)=>this.participants(id).find(p=> p.emp_id === emp_id)
  /**return's array of approval managers that their status is waiting
   * @param {*} id - string of letter id
   */
  need_approval=id=>this.approval_managers(id).filter(l=> l.staus === 'waiting') 
  /**return's array of least approval manager's that approve first
   * @param {*} id - string of letter id 
   */
first_manager=id=>{
  let min=Math.min.apply(null,this.approval_managers(id).map(a=> a.step))
return this.approval_managers(id).filter(m=> m.step === min )
}
   
}