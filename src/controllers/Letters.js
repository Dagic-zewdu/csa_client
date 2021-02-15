import { UsersClass } from "./Users";
import { removeDuplicates } from "./removeRedudant";
import { Donothing, Round } from "./saveProcess";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";

export class LettersClass extends UsersClass {
  constructor(letters, users, employees) {
    super(users, employees);
    this.letters = letters;
  }
  /**find letter based on given _id
   * @param {*} id - string of letter of letter id
   */
  find_letter = (id) => this.letters.find((l) => l._id === id);
  /**return's object of editorState for react-wywisgy description of the letter
   * @param {*} id - string of letter of letter id
   */
  description = (id) =>
    this.find_letter(id) ? JSON.parse(this.find_letter(id).description) : "";
  /**retun's an object for react-wyiswgy editor
   * @param {*} id - string of letter id
   */
  editorState = (id) =>
    this.description(id)
      ? EditorState.createWithContent(convertFromRaw(this.description(id)))
      : EditorState.createEmpty();
  /**retun's string description text of the letter
   * @param {*} id - string of letter id
   */
  description_text = (id) =>
    this.description(id)
      ? this.description(id).blocks[0]
        ? this.description(id).blocks[0].text
        : "" + "<br/>" + this.description(id).blocks[1]
        ? this.description(id).blocks[1].text
        : ""
      : "";
  /**returns title of the letter
   * @param {*} id - string of letter id
   */
  title = (id) => (this.find_letter(id) ? this.find_letter(id).title : "");
  /**return's array of approval managers of the letter
   * @param {*} id - string of letter id
   */
  approval_managers = (id) =>
    this.find_letter(id) ? this.find_letter(id).approval_manager : [];
  /**return's of object about the information of the approval manager
   * @param {*} id - string of letter _id
   * @param {*} emp_id - string of employee id
   */
  manager_info = (id, emp_id) =>
    this.approval_managers(id).find((m) => {
      let Emp_id = emp_id ? emp_id : this.getEmp_id();
      return m.emp_id === Emp_id;
    });
  /**return's participants of the letter
   * @param {*} id - string of letter id
   */
  participants = (id) =>
    this.find_letter(id) ? this.find_letter(id).participants : [];
  /**return's object information about the letter participant
   * @param {*} id - string of letter id
   * @param {*} emp_id - string of employee id
   */
  particpant_info = (id, emp_id) =>
    this.participants(id).find((p) => {
      let Emp_id = emp_id ? emp_id : this.getEmp_id();
      return p.emp_id === Emp_id;
    });
  /**return's array of approval managers that their status is waiting
   * @param {*} id - string of letter id
   */
  need_approval = (id) =>
    this.approval_managers(id).filter((l) => l.status === "waiting");
  /**return's array of least approval manager's that approve first
   * @param {*} id - string of letter id
   */
  first_manager = (id) => {
    let min = Math.min.apply(
      null,
      this.approval_managers(id).map((a) => a.step)
    );
    return this.approval_managers(id).filter((m) => m.step === min);
  };
  /**retun's true if the current user is on the approval manager false if the user is npt
   * @param {*} id - string of letter _id
   * @param {*} emp_id- string of emp_id
   */
  isApproval = (id, emp_id) => (this.manager_info(id, emp_id) ? true : false);
  /** retun's true if the current user is on the participants list false if it is not
   * @param {*} id - string of letter _id
   * @param {*} emp_id- string of emp_id
   */
  isParticipant = (id, emp_id) =>
    this.particpant_info(id, emp_id) ? true : false;

  /**return's number approval step of the current user
   * @param {*} id - string of letter _id
   * * @param {*} emp_id- string of emp_id
   */
  approvalStep = (id, emp_id) =>
    this.manager_info(id, emp_id) ? this.manager_info(id, emp_id).step : null;
  /** return's if the true if the letter status is waiting false if it is not
   * @param {*} id - string of letter _id
   * @param {*} emp_id- string of emp_id
   */
  needsApproval = (id, emp_id) =>
    this.need_approval(id).find((m) =>
      m.emp_id === emp_id ? emp_id : this.getEmp_id()
    )
      ? true
      : false;
  /**return's an object array of managers which approved the letter
   * @param {*} id - string of letter _id
   */
  approvedManagers = (id) =>
    this.approval_managers(id).filter((m) => m.status === "Approved");
  /** retun's an array of managers that have the same approval stages with the current employee or given emp_id
   * @param {*} id - string of letter _id
   * @param {*} emp_id- string of emp_id
   */
  sameStage = (id, emp_id) =>
    this.approval_managers(id).filter(
      (m) =>
        m.step === this.approvalStep(id, emp_id) &&
        m.emp_id !== this.getEmp_id()
    );
  /**retun's true if the rest manager in the same step approved the letter and
   * false if the the rest manager in the same step has not approved yet
   * @param {*} id - string of letter _id
   * @param {*} emp_id- string of emp_id
   */
  proceedStage = (id, emp_id) =>
    this.sameStage(id, emp_id).find(
      (m) => m.status === "waiting" || m.status === "unApproved"
    )
      ? false
      : true;
  /**return's array of employee to approve next
   * @param {*} id - string of letter _id
   * @param {*} emp_id- string of emp_id
   */
  nextEmployee = (id, emp_id) => {
    //remove current step employees
    let remove = this.approval_managers(id).filter(
      (m) => m.step !== this.approvalStep(id, emp_id) && m.status !== "Approved"
    );
    //determine the minimum step of employee
    let min = Math.min.apply(
      null,
      remove.map((a) => a.step)
    );
    //return the managers
    return this.approval_managers(id).filter((m) => m.step === min);
  };
  /**retun's an array of outbox letters of the user*/
  outBox = () => this.letters.filter((l) => l.creater === this.getEmp_id());
  /**return's array of objects that included on the index search string
   * for Outbox letters
   * @param {*} Index-search string
   */
  searchLetters = (Index) => {
    let index = Index.toString().toLowerCase();
    let id = this.outBox().filter((l) =>
      l.id.toString().toLowerCase().includes(index, 0)
    );
    let title = this.outBox().filter((l) =>
      l.title.toString().toLowerCase().includes(index, 0)
    );
    let type = this.outBox().filter((l) =>
      l.type.toString().toLowerCase().includes(index, 0)
    );
    return removeDuplicates([...id, ...title, ...type], "_id");
  };
  /**retuns's number of rank approval
   * @param {*} status- string of status
   */
  rank = (status) =>
    status === "Approved" ? 1 : status === "waiting" ? 0.5 : 0;
  /**return's number of progress of approval manager
   * @param {*} id - string letter id
   */
  progress = (id, i = 0) => {
    this.approval_managers(id).map((m) => {
      m.seen && m.status === "waiting"
        ? (i = i + this.rank(m.status))
        : m.status === "waiting"
        ? Donothing()
        : (i = i + this.rank(m.status));
    });
    return i;
  };
  /**return's number of totall progress
   * @param {*} id-string of letter id
   */
  totallProgress = (id) =>
    Round((this.progress(id) / this.approval_managers(id).length) * 100);
  /** return's true if the letter can be edited or deleled. false for
   * the letter can approve or deleted
   * @param {*} id-string letter id
   */
  isModifiable = (id) =>
    this.approval_managers(id).find((m) => m.status === "unApproved")
      ? true
      : this.progress(id) === 0
      ? true
      : false;
  /**return's true if the approval mananager can approve the letter false if it can not
   * @param {*} id - string of letter _id
   * @param {*} emp_id- string of emp_id
   */
  isApprovable = (id, emp_id) =>
    this.approval_managers(id).find(
      (m) => m.status === "unApproved" && m.emp_id !== this.getEmp_id()
    )
      ? false
      : this.approval_managers(id).find(
          (m) =>
            m.step > this.approvalStep(id, emp_id) && m.status === "Approved"
        )
      ? false
      : this.participants(id).find((l) => l.seen)
      ? false
      : true;
  /** return's array of object about unApproved managers list
   * @param {*} id- String letter id
   */
  unApproved = (id) =>
    this.approval_managers(id).filter((m) => m.status === "unApproved");
}
