import { tellTime } from "./Date";
import { LettersClass } from "./Letters";
import { removeDuplicates } from "./removeRedudant";
import { Donothing } from "./saveProcess";

export class Message extends LettersClass {
  /**
   * @param {*} users=>list of users in the system
   * @param {*} Users => array of objects connected and disconnected users
   */
  constructor(message, Users, letters, users, employees) {
    super(letters, users, employees);
    this.message = message;
    this.Users = Users;
  }
  /** return an object of active or inactive users 
     @param {*} emp_id => emp_id of the users
    */
  findConnected = (emp_id) => this.Users.find((a) => a.emp_id === emp_id);
  /**returns an array of online users */
  onlineUsers = () => this.Users.filter((a) => a.status === "connected");
  /** returns true if the user connected to the system  false if it is disconnected
      @param {*} emp_id =>emp_id of the user
     */
  isOnline = (emp_id) =>
    this.onlineUsers().find((a) => a.emp_id === emp_id) ? true : false;
  /**retuns time of disconnected user if the user is new don't use the system before returns
   * empty string
   * @param {*} emp_id => employee id of the user
   */
  lastSeen = (emp_id) =>
    this.findConnected(emp_id)
      ? this.findConnected(emp_id).disconnected_time
      : "";
  /**return's array of messages of the current user */
  myMessage = () =>
    this.message.filter(
      (m) => m.sender === this.getEmp_id() || m.reciever === this.getEmp_id()
    );
  /* return's array of employee contacted recently*/
  contactedUsers = () => {
    var u = [];
    this.myMessage().map((m) => {
      m.sender !== this.getEmp_id()
        ? u.push(m.sender)
        : m.reciever !== this.getEmp_id()
        ? u.push(m.reciever)
        : Donothing();
    });
    let contact = new Set(u);
    return [...contact];
  };
  /**retun's array of contacted user emp_id that is searched using search string
   * @param {*} index string - String to search
   */
  searchContacted = (Index) => {
    let index = Index.toString().toLowerCase();
    return this.contactedUsers().filter((c) =>
      this.messageName(c).toString().toLowerCase().includes(index, 0)
    );
  };
  /**return's array of messages of the current user and provided emp_id
   * @param {*} emp_id => emp_id of the the user that contact the current user
   */
  chatRoom = (emp_id) =>
    this.myMessage().filter(
      (m) => m.sender === emp_id || m.reciever === emp_id
    );
  /**returns new message of the the current user and the provided id
   * @param {*} emp_id => emp_id of the the user that contact the current user
   */
  newMessages = (emp_id) =>
    this.chatRoom(emp_id).filter(
      (m) => !m.seen && m.reciever === this.getEmp_id()
    );
  /**return's object of last chat contacted with the current user
   * @param {*} emp_id => emp_id of the the user that contact the current user
   */
  last_message = (emp_id) =>
    this.chatRoom(emp_id).length
      ? this.chatRoom(emp_id)[0]
      : { message: "", file_name: "", letter_id: "", created_date: "" };
  /* return's number of all new messages recieved */
  notifiaction = () => {
    var i = 0;
    this.contactedUsers().map((m) => {
      i = i + this.newMessages(m).length;
    });
    return i;
  };
  /** return's an array of inbox letters that the user recieves*/
  InboxLetters = () => {
    //inbox messages with letter
    let inbox = this.message.filter(
      (m) => m.reciever === this.getEmp_id() && m.letter_id !== ""
    );
    return inbox.map((m) => this.find_letter(m.letter_id));
  };
  /**return's array of objects that included on the index search string
   * for Inbox letters
   * @param {*} Index-search string
   */
  SearchLetters = (Index) => {
    let index = Index.toString().toLowerCase();
    let id = this.InboxLetters().filter((l) =>
      l.id.toString().toLowerCase().includes(index, 0)
    );
    let title = this.InboxLetters().filter((l) =>
      l.title.toString().toLowerCase().includes(index, 0)
    );
    let type = this.InboxLetters().filter((l) =>
      l.type.toString().toLowerCase().includes(index, 0)
    );
    let letters = removeDuplicates([...id, ...title, ...type], "_id");
    return {
      newLetters: letters.filter((m) =>
        this.manager_info(m ? m._id : "")
          ? !this.manager_info(m._id).seen
          : false || this.particpant_info(m ? m._id : "")
          ? !this.particpant_info(m._id).seen
          : false
      ),
      seenLetters: letters.filter((m) =>
        this.manager_info(m ? m._id : "")
          ? this.manager_info(m._id).seen
          : false || this.particpant_info(m ? m._id : "")
          ? this.particpant_info(m._id).seen
          : false
      ),
    };
  };
  newInboxLetters = () =>
    this.InboxLetters().filter((m) =>
      this.manager_info(m ? m._id : "")
        ? !this.manager_info(m ? m._id : "").seen
        : false || this.particpant_info(m ? m._id : "")
        ? !this.particpant_info(m ? m._id : "").seen
        : false
    );
  seenInboxLetters = () =>
    this.InboxLetters().filter((m) =>
      this.manager_info(m ? m._id : "")
        ? this.manager_info(m ? m._id : "").seen
        : false || this.particpant_info(m ? m._id : "")
        ? this.particpant_info(m ? m._id : "").seen
        : false
    );
  /**return's allowance letter of the user*/
  allowanceLetter = () =>
    this.InboxLetters().filter((a) => a.type === "allowance");
}
