import { EmployeeClass } from "./Employees";
import { UsersClass } from "./Users";
import { removeDuplicates } from "./removeRedudant";

export class AllowanceClass extends EmployeeClass {
  constructor(allowances, employees, users) {
    super(employees);
    this.allowances = allowances;
    this.users = users;
  }
  /**returns current user emp_id */
  getEmp_id = () => {
    let { id } = localStorage; //getting the id
    let user = new UsersClass(this.users, this.employees);
    let Id = user.getEmp_id(id);
    return Id;
  };
  userAllowances = () => {
    let allowances = this.allowances.filter((f) => {
      return f.creater === this.getEmp_id();
    });
    return allowances;
  };
  findAllowance = (id) => {
    let allowance = this.allowances.find((a) => {
      return a._id === id;
    });
    return allowance;
  };
  /**tells the approval level
   * @param status=>parameter of the approval level Approved,unApproved,
   * commented
   *  */
  rankProgress = (status) =>
    status === "Approved"
      ? 4
      : status === "unApproved"
      ? 1
      : status === "commented"
      ? 2
      : 0;
  /*progress accepts letter id
   * represents progress of the allowance returns from totall 22
   */
  progress = (id) => {
    var i = 0;
    if (this.findAllowance(id) === undefined) {
      return i;
    } else {
      let {
        approval_manager,
        f_pending_dr,
        f_pending_emp,
        f_approve_tm,
        f_pending_tl,
        f_approve_dr,
      } = this.findAllowance(id);
      //step-1 check if the approval manager has seen and approved the allowance
      let ama =
        approval_manager.seen && approval_manager.approved === "waiting"
          ? 3
          : this.rankProgress(approval_manager.approved);
      i = i + ama;
      //step-2 check if the finance director has seen and approve
      let fpd =
        f_pending_dr.seen && f_pending_dr.approved === "waiting"
          ? 3
          : this.rankProgress(f_pending_dr.approved);
      i = i + fpd;
      //step -3 check if the finance tm has seen the allowance
      let fptl = f_pending_tl.seen ? 3 : 0;
      i = i + fptl;
      //step-4 check if the employee has seen the allowance
      let fpe = f_pending_emp.seen ? 3 : 0;
      i = i + fpe;
      //step-5 check if the finance team leader has seen and approved the allowance
      let fatl =
        f_approve_tm.seen && f_approve_tm.approved === "waiting"
          ? 3
          : this.rankProgress(f_approve_tm.approved);
      i = i + fatl;
      //step-6 check if the finance director has seen & approved
      let fadr =
        f_approve_dr.seen && f_approve_dr.approved === "waiting"
          ? 3
          : this.rankProgress(f_approve_dr.approved);
      i = i + fadr;
      return i;
    }
  };
  /**accepts allowance id and returns progress by percent */
  totallProgress = (id) => {
    let Progress = Math.round((this.progress(id) / 22) * 100);
    return Progress;
  };
  tellProgress = (id) => {
    let progress = this.progress(id);
    if (progress === 1) {
      return "Allowance is unapproved by your approving manager";
    } else if (progress === 2) {
      return "Allowance is commented by your approving Manager";
    } else if (progress === 3) {
      return "Your approving manager is reviewing your allowance";
    } else if (progress === 4) {
      return "Allowance is approved by your manager";
    } else if (progress === 5) {
      return "Allowance is disapproved by finance director";
    } else if (progress === 6) {
      return "Allowance is commented by finance director";
    } else if (progress === 7) {
      return "Finance director is reviewing your Allowance";
    } else if (progress === 8) {
      return "Allwoance is approved by finance director";
    } else if (progress === 11) {
      return "Allowance is being reviwed by finance team leader";
    } else if (progress === 14) {
      return "Allwoance is calculating ";
    } else if (progress === 15) {
      return "Allowance is calculated but it is dis approved by finance by team leader";
    } else if (progress === 16) {
      return "Allowance is calculated but is commented by fiancne team leader";
    } else if (progress === 17) {
      return "Allowance is callcualted is being reviewed by finance team leader";
    } else if (progress === 18) {
      return "Allowance is calculated is approved by finance team leader";
    } else if (progress === 19) {
      return "Allowance is calculated is dis approved by finance director";
    } else if (progress === 20) {
      return "Allowance is  calcualted and commented by fianance director";
    } else if (progress === 21) {
      return "Allowance is calculated and is being reviewed for approval";
    } else if (progress === 22) {
      return "Allowance is calculated";
    }
  };
  checkApproval = (Num) => {
    if (Num === 0) {
      return "Begin";
    } else if (
      Num === 3 ||
      Num === 7 ||
      Num === 11 ||
      Num === 17 ||
      Num === 14
    ) {
      return "Reviewed";
    } else if (Num === 4 || Num === 8 || Num === 18) {
      return "Approved";
    } else if (Num === 1 || Num === 5 || Num === 15 || Num === 19) {
      return "unApproved";
    } else if (Num === 2 || Num === 6 || Num === 16 || Num === 20) {
      return "commented";
    } else if (Num === 22) {
      return "completed";
    }
  };
  /**Approval manager */
  approve_Allowances = () => {
    //accepts emp_id and return managers approval allowance
    let allowances = this.allowances.filter((f) => {
      return (
        f.approval_manager.emp_id === this.getEmp_id() &&
        f.save_options === "approve"
      );
    });
    return allowances;
  };
  /**  returns new allowances that have to be approved */
  new_allowances_manager = () => {
    let New = this.approve_Allowances()
      ? this.approve_Allowances().filter((a) => {
          return a.approval_manager.seen === false;
        })
      : [];
    return New;
  };
  /**  returns seen allowances by the manager */
  seen_allowances_manager = () => {
    let seen = this.approve_Allowances()
      ? this.approve_Allowances().filter((a) => {
          return a.approval_manager.seen === true;
        })
      : [];
    return seen;
  };
  approved_Allowances = () => {
    let approved = this.approve_Allowances()
      ? this.approve_Allowances().filter((a) => {
          return a.approval_manager.approved === "Approved";
        })
      : [];
    return approved;
  };
  unApproved_Allowances = () => {
    let unApproved = this.approve_Allowances()
      ? this.approve_Allowances().filter((a) => {
          return a.approval_manager.approved === "unApproved";
        })
      : [];
    return unApproved;
  };
  commented_Allowances = () => {
    let commented = this.approve_Allowances()
      ? this.approve_Allowances().filter((a) => {
          return a.approval_manager.approved === "commented";
        })
      : [];
    return commented;
  };
  /**accepts letter id tells whether it is new or not */
  isNewApproval = (id) => {
    let New = this.new_allowances_manager()
      ? this.new_allowances_manager().filter((a) => {
          return a._id === id;
        })
      : [];
    return New.length ? true : false;
  };
  /**Finance director pending allowances pending allowance of the director
   */
  DirectorPending = () => {
    let fda = this.allowances.filter((f) => {
      return (
        f.approval_manager.approved === "Approved" &&
        f.save_options === "approve" &&
        f.approval_manager.seen
      );
    });
    return fda;
  };
  seenDirectorPending = () => {
    let seen = this.DirectorPending().filter((f) => {
      return f.f_pending_dr.seen;
    });
    return seen;
  };
  NewDirectorPending = () => {
    let unSeen = this.DirectorPending().filter((f) => {
      return !f.f_pending_dr.seen;
    });
    return unSeen;
  };

  /**Finance Incoming allowance */
  /**returns all pending allowance that are attached to the team leader */
  F_pending_tl = () => {
    let f_tl = this.DirectorPending().filter((d) => {
      return d.f_pending_tl.emp_id === this.getEmp_id();
    });
    return f_tl;
  };
  /**returns New pending allowance that are attached to the team leader */
  New_F_Pending_tl = () => {
    let New = this.F_pending_tl().filter((f) => {
      return !f.f_pending_tl.seen;
    });
    return New;
  };
  /**returns seen pending allowance that are attached to the team leader */
  seen_F_Pending_tl = () => {
    let seen = this.F_pending_tl().filter((f) => {
      return f.f_pending_tl.seen;
    });
    return seen;
  };
  /**returns all allowances that need to be approved team leader */
  tlApprove = () => {
    let approve = this.F_pending_tl().filter((f) => {
      return f.f_pending_emp.calculated === "approve";
    });
    return approve;
  };
  /**returns new allowance that need to be approved bt team leader */
  tlNewApprove = () => {
    let approve = this.tlApprove().filter((i) => {
      return !i.f_approve_tm.seen;
    });
    return approve;
  };
  /**returns seen allowance of approval team leader */
  tlSeenApprove = () => {
    let approve = this.tlApprove().filter((i) => {
      return i.f_approve_tm.seen;
    });
    return approve;
  };

  /**Finance Employee Incoming allowance  Returns calculations that needs to be calculated*  */
  IncomingCalculations = () => {
    let calculations = this.DirectorPending().filter((c) => {
      return (
        c.f_pending_tl.forwarded && c.f_pending_emp.emp_id === this.getEmp_id()
      );
    });
    return calculations;
  };
  /**returns seen calculations */
  seenCalculations = () => {
    let seen = this.IncomingCalculations()
      ? this.IncomingCalculations().filter((i) => {
          return i.f_pending_emp.seen;
        })
      : [];
    return seen;
  };
  /**returns unseen calculations */
  newCalculations = () => {
    let New = this.IncomingCalculations()
      ? this.IncomingCalculations().filter((i) => {
          return !i.f_pending_emp.seen;
        })
      : [];
    return New;
  };
  /**recieves allowance id and returns whether the calculation is done */
  isCalculationDone = (id) => {
    let done = this.IncomingCalculations().find((i) => {
      return (
        i._id === id &&
        (i.f_pending_emp.calculated === "approve" ||
          i.f_pending_emp.calculated === "draft")
      );
    });
    return done ? true : false;
  };
  /**returns commented allowance that are given from the team leader */
  tlCommented = () => {
    let comment = this.seenCalculations().filter((c) => {
      return (
        this.isCalculationDone(c._id) &&
        c.f_approve_tm.approved === "commented" &&
        !c.f_pending_emp.redone
      );
    });
    return comment;
  };
  /**returns redone allowances by team leader */
  redone = () => {
    let re = this.tlSeenApprove().filter((r) => {
      return r.f_pending_emp.redone;
    });
    return re;
  };

  /*** check if the calculation is redone or not*/
  isRedone = (id) => (this.redone().find((r) => r._id === id) ? true : false);
  /**returns allowance that need to be approved or already approved allwoance */
  DrApproveAllowance = () => {
    const dr = this.allowances.filter((a) => {
      return (
        a.f_pending_dr.emp_id === this.getEmp_id() &&
        a.f_approve_tm.approved === "Approved"
      );
    });
    return dr;
  };
  NewDrApprove = () => {
    let dr = this.DrApproveAllowance().filter((a) => {
      return !a.f_approve_dr.seen;
    });
    return dr;
  };
  seenDrApprove = () => {
    let dr = this.DrApproveAllowance().filter((a) => {
      return a.f_approve_dr.seen;
    });
    return dr;
  };
  /**returns allowance that are commented by director */
  drCommented = () => {
    let comment = this.seenCalculations().filter((c) => {
      return (
        this.isCalculationDone(c._id) &&
        c.f_approve_dr.approved === "commented" &&
        !c.f_pending_emp.redone_director
      );
    });
    return comment;
  };
  /**returns redone allowances that are commented by finance director */
  reDone = () =>
    this.DrApproveAllowance().filter((c) => c.f_pending_emp.redone_director);
  /**check allowance is redone or not which are commented by finance director */
  isReDone = (id) => (this.reDone().find((c) => c._id === id) ? true : false);
  /**returns completed unseen allowances for the user */
  completed = () => {
    let complete = this.userAllowances().filter((a) => {
      return this.progress(a._id) === 22 && !a.all_done;
    });
    return complete;
  };
  /**it returns array of completed allowances that is included in the index search for
   * the allowance creater
   * */
  searchCompleted = (Index) => {
    let index = Index.toString().toLowerCase();
    let id = this.completed().filter((a) => {
      return a.id.toString().toLowerCase().includes(index, 0);
    });
    let letter_id = this.completed().filter((a) => {
      return a.letter_id.toString().toLowerCase().includes(index, 0);
    });
    //destination place search
    let dp = this.completed().filter((a) => {
      return a.destination_place.toString().toLowerCase().includes(index, 0);
    });
    //project name serach
    let pn = this.completed().filter((a) => {
      return a.project_name.toString().toLowerCase().includes(index, 0);
    });

    return removeDuplicates([...id, ...letter_id, ...dp, ...pn], "_id");
  };

  /**returns uncompleted and completed seen allowance of the user  */
  unCompleted = () => {
    let unComplete = this.userAllowances().filter((a) => {
      return this.progress(a._id) !== 22 || a.all_done;
    });
    return unComplete;
  };
  /**it returns array of uncompleted allowances that is included in the index search for
   * the allowance creater
   * */
  searchUnCompleted = (Index) => {
    let index = Index.toString().toLowerCase();
    let id = this.unCompleted().filter((a) => {
      return a.id.toString().toLowerCase().includes(index, 0);
    });
    let letter_id = this.unCompleted().filter((a) => {
      return a.letter_id.toString().toLowerCase().includes(index, 0);
    });
    //destination place search
    let dp = this.unCompleted().filter((a) => {
      return a.destination_place.toString().toLowerCase().includes(index, 0);
    });
    //project name serach
    let pn = this.unCompleted().filter((a) => {
      return a.project_name.toString().toLowerCase().includes(index, 0);
    });
    return removeDuplicates([...id, ...letter_id, ...dp, ...pn], "_id");
  };
  /**returns all completed allowances
   * used for finannce department inoeder to see all completed allowance  */
  allCompleted = () =>
    this.allowances.filter(
      (a) =>
        this.progress(a._id) === 22 && a.f_approve_dr.approved === "Approved"
    );
  /**returns array of allowance completed all process
   * @param Index=>refers to index of text that we you want to search
   *  */
  searchAllCompleted = (Index) => {
    let index = Index.toString().toLowerCase();
    let id = this.allCompleted().filter((a) => {
      return a.id.toString().toLowerCase().includes(index, 0);
    });
    let letter_id = this.allCompleted().filter((a) => {
      return a.letter_id.toString().toLowerCase().includes(index, 0);
    });
    //destination place search
    let dp = this.allCompleted().filter((a) => {
      return a.destination_place.toString().toLowerCase().includes(index, 0);
    });
    //project name serach
    let pn = this.allCompleted().filter((a) => {
      return a.project_name.toString().toLowerCase().includes(index, 0);
    });
    return removeDuplicates([...id, ...letter_id, ...dp, ...pn], "_id");
  };
  /** return's array of allowance's resulted by searching
   * @param {*} Allowances - array of objects of allowances
   * @param {*} Index- Index to search
   */
  searchAllowances = (Allowances, Index) => {
    let index = Index.toString().toLowerCase();
    let id = Allowances.filter((a) => {
      return a.id.toString().toLowerCase().includes(index, 0);
    });
    let name = Allowances.filter((a) =>
      this.Name(a.creater).toString().toLowerCase().includes(index, 0)
    );
    let letter_id = Allowances.filter((a) => {
      return a.letter_id.toString().toLowerCase().includes(index, 0);
    });
    let objective = Allowances.filter((a) =>
      a.objective.toString().toLowerCase().includes(index, 0)
    );
    let initial_place = Allowances.filter((a) =>
      a.initial_place.toString().toLowerCase().includes(index, 0)
    );
    let destination_place = Allowances.filter((a) =>
      a.destination_place.toString().toLowerCase().includes(index, 0)
    );
    return removeDuplicates(
      [
        ...id,
        ...name,
        ...letter_id,
        ...objective,
        ...initial_place,
        ...destination_place,
      ],
      "_id"
    );
  };
}
