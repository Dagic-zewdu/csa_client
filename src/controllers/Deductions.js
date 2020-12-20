import { AllowanceClass } from "./Allowance"
import { durationDays, durationMonth, durationYears, toEthiopianDate, toEthiopianMonth } from "./Date"
import { removeDuplicates } from "./removeRedudant"

export class DeductionClass extends AllowanceClass {
  constructor(deductions, allowances, employees, users) {
    super(allowances, employees, users)
    this.deductions = deductions
  }
  /**returns array of allowance to deduct */
  toDeduct = () => this.allCompleted().filter(d => d.creater === this.getEmp_id())
  /**check allowance whether the deduction started or not
   * @param id=>refers to allowance _id
   */
  isDeductionStarted = (id) => this.deductions.find(d =>
    d.allowance_id === id) ? true : false
  /**search availiable allowance that the user want to deduct
   * @param Index=>refers to text to search
   *  */
  searchToDeduct = (Index) => {
    let index = Index.toString().toLowerCase()
    let id = this.toDeduct().filter(a => {
      return a.id.toString().toLowerCase().includes(index, 0)
    })
    let letter_id = this.toDeduct().filter(a => {
      return a.letter_id.toString().toLowerCase().includes(index, 0)
    })
    //destination place search
    let dp = this.toDeduct().filter(a => {
      return a.destination_place.toString().toLowerCase().includes(index, 0)
    })
    //project name serach
    let pn = this.toDeduct().filter(a => {
      return a.project_name.toString().toLowerCase().includes(index, 0)
    })
    return removeDuplicates([...id, ...letter_id, ...dp, ...pn], '_id')
  }
  /**returns array of months that user spent on
   * @param id:-refers to allowance _id
   */
  durationMonths = (id) => {
    let allowance = this.findAllowance(id)
    let imonth = allowance ? parseInt(toEthiopianDate(allowance.initial_date).month) : 0
    let rmonth = allowance ? parseInt(toEthiopianDate(allowance.destination_date).month) : 0
    return allowance ? (durationDays(allowance.initial_date, allowance.destination_date) <= 365 ?
      durationMonth(imonth, rmonth) : durationMonth(1, 13)) : []
  }
  /**returns array element of years btn initial year and return year
   * @param id:-refers to allowance _id
   */
  durationYears = (id) => {
    let allowance = this.findAllowance(id)
    let iyear = allowance ? parseInt(toEthiopianDate(allowance.initial_date).year) : 0
    let ryear = allowance ? parseInt(toEthiopianDate(allowance.destination_date).year) : 0
    return durationYears(iyear, ryear)
  }
  /**find allowance with _id and returns object of deduction
   * @param id=>deduction _id
   */
  findDeductions = (id) => this.deductions.find(d => d._id === id)
  /**find allowance with id and returns object of deduction
     * @param id=>deduction id
     */
  findWithId = (id) => this.deductions.find(d => d.id === id)
  /**returns all deduction of the user */
  userDeductions = () => this.deductions.filter(d => d.creater === this.getEmp_id())
  /**returns uncompleted deduction array  for the user */
  userUnCompleted=()=>this.userDeductions().filter(d=>!d.c_seen && this.Progress(d._id) !== 16 )
  /**returns completed unseen deductions of array for the user */
  userNewCompleted=()=>this.userDeductions().filter(d=>!d.c_seen && this.Progress(d._id) === 16 )
   /**returns completed seen deductions of array for the user */
   userSeenCompleted=()=>this.userDeductions().filter(d=> d.c_seen && this.Progress(d._id) === 16 )
  /**return array of deductions found by the index text of the deduction
   * creater user
   * @param index=>is deduction searching text index
   */
  searchUserDeductions = (Index) => {
    let index = Index.toString().toLowerCase()
    //search allowance id
    let allowance_id = this.userDeductions().filter(d => {
      let allowance = this.findAllowance(d.allowance_id) ? this.findAllowance(d.allowance_id).id : ''
      return allowance.toString().toLowerCase().includes(index, 0)
    })

    //search deduction id
    let id = this.userDeductions().filter(d => {
      return d.id.toString().toLowerCase().includes(index, 0)
    })
    const results=removeDuplicates([...allowance_id, ...id], '_id')
    return {
      unCompleted : results.filter(d=>!d.c_seen && this.Progress(d._id) !== 16),
      completedSeen:results.filter(d=> d.c_seen && this.Progress(d._id) === 16),
      completedUnseen:results.filter(d=>!d.c_seen && this.Progress(d._id) === 16)
    }
  }
  /**tell the progress of the deduction from totall 16
   * @param id=>Deduction _id
   */
  Progress = (id) => {
    var i = 0
    const deduction = this.findDeductions(id)
    //step 1-check the approval manager seen and approved the deduction
    const ama = deduction ? deduction.approval_manager.approve === 'waiting' &&
      deduction.approval_manager.seen ? 3 : this.rankProgress(deduction.approval_manager.approve) : 0
    i = i + ama
    //step 2-check the finance team leader seen the deduction and assigend employee
    const fptl = deduction ? deduction.f_tl_pending.approve === 'waiting' &&
      deduction.f_tl_pending.seen ? 3 : this.rankProgress(deduction.f_tl_pending.approve) : 0
    i = i + fptl
    //step 3-check the finance employee has seen the deduction and calculated
    const fe = deduction ? deduction.f_employee.seen && !deduction.f_employee.calculated ?
      3 : deduction.f_employee.calculated ? 4 : 0 : 0
    i = i + fe
    //step 4- check the f_tl has seen and approved the deduction
    const ftla = deduction ? deduction.f_tl_approve.approve === 'waiting' &&
      deduction.f_tl_approve.seen ? 3 : this.rankProgress(deduction.f_tl_approve.approve) : 0
    i = i + ftla
    return i
  }
  /**returns a string which tells the progress of the deduction
   * @param id=>deduction _id
   */
  tellDeductionProgress = id => this.Progress(id) === 0 ? 'Deduction is created' :
    this.Progress(id) === 1 ? 'Your manager unApproved your Deduction' :
      this.Progress(id) === 2 ? 'Your manager commented on your deduction.Please view the comment  ' :
        this.Progress(id) === 3 ? 'Your manager is reviewing your deduction' :
          this.Progress(id) === 4 ? 'Your manager approved your deduction' :
            this.Progress(id) === 5 ? 'Your deduction is not accepted by finance please contact finance' :
              this.Progress(id) === 6 ? 'Your deduction is commented by finance team leader please view the comment' :
                this.Progress(id) === 7 ? 'Your deduction is being reviewed by finance team leader' :
                  this.Progress(id) === 8 ? 'Your deduction is accepted by finance team leader and is ready for calculation' :
                    this.Progress(id) === 11 ? 'Accountant is calculating your deduction' :
                      this.Progress(id) === 12 ? 'Your deduction is calculated and is ready for approval' :
                        this.Progress(id) === 13 ? 'Your deduction is calculated but it is dissaproved by finance team leader please contact for more information' :
                          this.Progress(id) === 14 ? 'Your deduction is calculated but it is commented by finance team leader to do the calculation again please wait the calculation is redoing' :
                            this.Progress(id) === 15 ? 'Your deduction is calculated and is being reviewed for approval' :
                              this.Progress(id) === 16 ? 'Your deduction is completed' : ''
  /**return string of danger,warning,success based on 
   * danger=>if it the deduction is unApproving at some point
   * warning=>if it the deduction is commenting at some point
   * success=> if the deduction is completed
   * info=> if the deduction is reviewing at some point
   * primary=> if the deduction is approving at some point
   * @param id=>refers to deduction _id
   */
  deductionColor = id => this.Progress(id) === 1 || this.Progress(id) === 5 ||
    this.Progress(id) === 13 ? 'danger' :
    this.Progress(id) === 7 || this.Progress(id) === 3 || this.Progress(id) === 11 ||
      this.Progress(id) === 15 ? 'info' :
      this.Progress(id) === 4 || this.Progress(id) === 8 || this.Progress(id) === 12 ? 'primary' :
        this.Progress(id) === 16 ? 'success' : this.Progress(id) === 2 || this.Progress(id) === 6 ||
          this.Progress(id) === 14 ? 'warning' : ''
  /**returns numbers of progress made by deduction by percent
   * @param id=>deduction _id
   */
  progressTotall = id => Math.round((this.Progress(id) / 16) * 100)
  /**returns array of deductions(objects) of the approval manager*/
  MangerDeductions = () => this.deductions.filter(d =>
    d.approval_manager.emp_id === this.getEmp_id() && d.save_options === 'approve')
  /**return new array of deductions(objects) of the approval manager*/
  newManagerDeductions = () => this.MangerDeductions().filter(d => !d.approval_manager.seen)
  /**return seen deductions for approval manager */
  seenManagerDeductions = () => this.MangerDeductions().filter(d => d.approval_manager.seen)
  /**return found new array of deduction */
  searchManager = (Index) => {
    let index = Index.toString().toLowerCase()
    //deduction id
    let id = this.MangerDeductions().filter(a => a.id.toString().toLowerCase().includes(index, 0))
    //allowance _id
    let a_id = this.MangerDeductions().filter(d => {
      let allowance = this.findAllowance(d.allowance_id) ? this.findAllowance(d.allowance_id).id : ''
      return allowance.toString().toLowerCase().includes(index, 0)
    })
    //emp_id creater of deduction
    let creater = this.MangerDeductions().filter(a => a.creater.toString().toLowerCase().includes(index, 0))
    /**searchs approval type */
    let approval = this.MangerDeductions().filter(a => a.approval_manager.approve.toString().toLowerCase().includes(index, 0))
    /**searchs name for deductions */
    let name = this.MangerDeductions().filter(a => this.Name(a.creater).toString().toLowerCase().includes(index, 0))
    let deductions = removeDuplicates([...id, ...a_id, ...creater, ...approval, ...name], '_id')
    return {
      new: deductions.filter(d => !d.approval_manager.seen),
      seen: deductions.filter(d => d.approval_manager.seen)
    }
  }
  /**return incoming deductions(array of objects) for  finance team leader*/
  ftl_IncomingDeductions = () => this.deductions.filter(d =>
    this.UserRole(this.getEmp_id()) === 'f_team_leader' && d.approval_manager.approve === 'Approved'
  )
  /**returns new incoming deductions(arry of objects) for finance team leader*/
  ftl_newIncomingDeductions = () => this.ftl_IncomingDeductions().filter(d => !d.f_tl_pending.seen)
  /**returns new incoming deductions(arry of objects) for finance team leader*/
  ftl_seenIncomingDeductions = () => this.ftl_IncomingDeductions().filter(d => d.f_tl_pending.seen)
  /**search deductions for finance team leader
   * @param index=>search string
   */
  searchFtlIncoming = (Index) => {
    let index = Index.toString().toLowerCase()
    //deduction id
    let id = this.ftl_IncomingDeductions().filter(a => a.id.toString().toLowerCase().includes(index, 0))
    //allowance _id
    let a_id = this.ftl_IncomingDeductions().filter(d => {
      let allowance = this.findAllowance(d.allowance_id) ? this.findAllowance(d.allowance_id).id : ''
      return allowance.toString().toLowerCase().includes(index, 0)
    })
    //emp_id creater of deduction
    let creater = this.ftl_IncomingDeductions().filter(a => a.creater.toString().toLowerCase().includes(index, 0))
    /**searchs approval type */
    let approval = this.ftl_IncomingDeductions().filter(a => a.f_tl_pending.approve.toString().toLowerCase().includes(index, 0))
    /**searchs name for deductions */
    let name = this.ftl_IncomingDeductions().filter(a => this.Name(a.creater).toString().toLowerCase().includes(index, 0))
    let deductions = removeDuplicates([...id, ...a_id, ...creater, ...approval, ...name], '_id')
    return {
      new: deductions.filter(d => !d.f_tl_pending.seen),
      seen: deductions.filter(d => d.f_tl_pending.seen)
    }
  }
  /**returns Deductions for finance employee  */
  fEmployeeDeductions = () => this.deductions.filter(d => d.f_tl_pending.approve === 'Approved' &&
    d.f_employee.emp_id === this.getEmp_id())
  /**returns new Deductions for finance employee */
  fNewEmployeeDeductions = () => this.fEmployeeDeductions().filter(d => !d.f_employee.seen)
  /**return seen that are not redone deduction for finance employee */
  fSeenEmployeeDeductions = () => this.fEmployeeDeductions().filter(d => d.f_employee.seen && !d.f_tl_approve.redone)
  /**return's seen array of deduction s that need to be redone */
  fe_RedoneDeductions = () => this.fEmployeeDeductions().filter(d => d.f_employee.seen && d.f_tl_approve.redone)
  /**search deductions for employee */
  searchFemployee = (Index) => {
    let index = Index.toString().toLowerCase()
    //deduction id
    let id = this.fEmployeeDeductions().filter(a => a.id.toString().toLowerCase().includes(index, 0))
    //allowance _id
    let a_id = this.fEmployeeDeductions().filter(d => {
      let allowance = this.findAllowance(d.allowance_id) ? this.findAllowance(d.allowance_id).id : ''
      return allowance.toString().toLowerCase().includes(index, 0)
    })
    //emp_id creater of deduction
    let creater = this.fEmployeeDeductions().filter(a => a.creater.toString().toLowerCase().includes(index, 0))
    /**searchs name for deductions */
    let name = this.fEmployeeDeductions().filter(a => this.Name(a.creater).toString().toLowerCase().includes(index, 0))
    let deductions = removeDuplicates([...id, ...a_id, ...creater, ...name], '_id')
    return {
      new: deductions.filter(d => !d.f_employee.seen),
      seen: deductions.filter(d => d.f_employee.seen && !d.f_tl_approve.redone),
      redone: deductions.filter(d => d.f_employee.seen && d.f_tl_approve.redone)
    }
  }
  /**returns array of spending days if the deduction is found
   * @param id=>deduction id
   */
  spendingDays = (id) => this.findDeductions(id) ? this.findDeductions(id).spending_days : []
  /**returns an object info about spending day 
   * @param id=>deduction id
   * @param sid=>spending day id
  */
  findSpendingDay = (id, sid) => this.spendingDays(id).find(d => d._id === sid)
  /**retuns duration days of spending days
   * @param id=>deduction _id
   * @param sid=>spending _id
   *  */
  sDuration = (id, sid) => this.findSpendingDay(id, sid) ?
    durationDays(this.findSpendingDay(id, sid).from_date, this.findSpendingDay(id, sid).upto_date) + 1 : 0
  /**return spending from day string of ethiopian date
   * @param id=>deduction id
   * @param sid=>spending day id
   */
  sFromDate = (id, sid) => this.findSpendingDay(id, sid) ? this.findSpendingDay(id, sid).from_date : ''
  /**return spending upto date string of ethiopian date
   * @param id=>deduction id
   * @param sid=>spending day id
   */ 
  sUptoDate = (id, sid) => this.findSpendingDay(id, sid) ? this.findSpendingDay(id, sid).upto_date : ''
  /*return's calculated deductions of array that need to be approved*/
  ftl_Calulated=()=>this.ftl_IncomingDeductions().filter(d=>
     d.f_tl_pending.emp_id ===this.getEmp_id() && d.f_employee.calculated && (d.f_employee.save_options === 'Approve' || d.f_employee.save_options === 'approve' )
     )
   /**return's array of new calculated deduction for finance team leader */
   ftl_newCalculated=()=>this.ftl_Calulated().filter(d=>!d.f_tl_approve.seen)
   /**return's array of calculated allowance that are redone by finance employee
    *  and that are seen  by finance team leader
    * */
   ftl_Redone=()=>this.ftl_Calulated().filter(d=>d.f_employee.redone && d.f_tl_approve.seen)
   /**return's array of calculted deductions that are seen are not necessary redone by
    * finance employee
    *  */  
   ftl_CalulatedSeen=()=>this.ftl_Calulated().filter(d=>!d.f_employee.redone && d.f_tl_approve.seen)
/**return's object of array new,seen,redone
 * @Param Index-search string
 */
   ftlSeacrchCalulated=(Index)=>{
    let index = Index.toString().toLowerCase()
    //deduction id
    let id = this.ftl_Calulated().filter(a => a.id.toString().toLowerCase().includes(index, 0))
    //allowance _id
    let a_id = this.ftl_Calulated().filter(d => {
      let allowance = this.findAllowance(d.allowance_id) ? this.findAllowance(d.allowance_id).id : ''
      return allowance.toString().toLowerCase().includes(index, 0)
    })
    //emp_id creater of deduction
    let creater = this.ftl_Calulated().filter(a => a.creater.toString().toLowerCase().includes(index, 0))
    /**searchs approval type */
    let approval = this.ftl_Calulated().filter(a => a.f_tl_approve.approve.toString().toLowerCase().includes(index, 0))
    /**searchs name for deductions */
    let name = this.ftl_Calulated().filter(a => this.Name(a.creater).toString().toLowerCase().includes(index, 0))
    let deductions = removeDuplicates([...id, ...a_id, ...creater, ...approval, ...name], '_id')
    return {
      new: deductions.filter(d => !d.f_tl_approve.seen),
      seen: deductions.filter(d => !d.f_employee.redone && d.f_tl_approve.seen),
      redone: deductions.filter(d=>d.f_employee.redone && d.f_tl_approve.seen)
    }
}
/**return's array of completed  deduction for finance users*/
completedDeductions=()=>this.deductions.filter(d=>this.Progress(d._id)===16)
searchCompleted=Index=>{
  let index = Index.toString().toLowerCase()
  //deduction id
  let id = this.completedDeductions().filter(a => a.id.toString().toLowerCase().includes(index, 0))
  //allowance _id
  let a_id = this.completedDeductions().filter(d => {
    let allowance = this.findAllowance(d.allowance_id) ? this.findAllowance(d.allowance_id).id : ''
    return allowance.toString().toLowerCase().includes(index, 0)
  })
  //emp_id creater of deduction
  let creater = this.completedDeductions().filter(a => a.creater.toString().toLowerCase().includes(index, 0))
  /**searchs name for deductions */
  let name = this.completedDeductions().filter(a => this.Name(a.creater).toString().toLowerCase().includes(index, 0))
  /**search department  */
  let department = this.completedDeductions().filter(a => this.Department(a.creater).toString().toLowerCase().includes(index, 0))
  return removeDuplicates([...id, ...a_id, ...creater, ...name,...department], '_id')
}
  }