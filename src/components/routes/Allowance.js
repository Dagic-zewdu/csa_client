import React, { useState, useContext, useEffect } from "react";
import Navbar from "../layout/Navbar/Navbar";
import SideNav from "../layout/SideNav/SideNav";
import { LayoutContext, StoreContext } from "../contexts/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NonFinanceShow from "../Allowance/NonFinanceShow";
import { UsersClass } from "../../controllers/Users";
import DataLoading from "../layout/DataLoading";
import ErrorLoading from "../layout/ErrorLoading";
import {
  faPaperPlane,
  faBook,
  faBell,
  faStar,
  faMoneyCheck,
  faMoneyCheckAlt,
  faStamp,
  faArrowAltCircleRight,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import ApprovalManagerAllowance from "../Allowance/ApprovalManagerAllowance";
import ShowPending from "../Allowance/Finance_Director/ShowPending";
import ShowPending_TL from "../Allowance/Finance_team_leader/ShowPending_tl";
import IncomingCalculations from "../Allowance/Finance_Employee/IncomingAllowance";
import ShowTlCalculations from "../Allowance/Finance_team_leader/ShowTlCalculations";
import ShowCalculated from "../Allowance/Finance_Director/ShowCalculated";
import { AllowanceClass } from "../../controllers/Allowance";
import AllCompleted from "../Allowance/View/AllCompleted";
const Allowance = () => {
  const [state, setState] = useState({
    collapse: "",
    myAllowance: "text-dark",
    approve: "",
    fd: "",
    tl: "",
    fe: "",
    atl: "",
    adr: "",
    ecom: "", //tl commented allowance
    comp: "",
  });

  const { users, employees, allowances } = useContext(StoreContext);
  const { state: Allowances, loading, error } = allowances;
  const { state: Users, loading: userLoading, error: userError } = users;
  const { state: Employees, loading: empLoading, error: empError } = employees;
  const user = new UsersClass(Users, Employees);
  /**Notification for allowances */
  const Allowance = new AllowanceClass(Allowances, Employees, Users);
  const completedAllowance = Allowance.completed().length;
  const ManagerNewAllowance = Allowance.new_allowances_manager().length;
  const pendingDirector = Allowance.NewDirectorPending().length;
  const pendingTl = Allowance.New_F_Pending_tl().length;
  const newCalculations = Allowance.newCalculations().length;
  const tlApprove = Allowance.tlNewApprove().length;
  const Drapprove = Allowance.NewDrApprove().length;
  const tlCommented = Allowance.tlCommented().length;
  const drCommented = Allowance.drCommented().length;
  const redone = Allowance.redone().length; //redone allowance that are commented by finance team leader
  const ReDone = Allowance.reDone().length; //redone allowance that are commented by finance director
  /** */
  const emp_id = user.getEmp_id();
  const userType = user.UserRole(emp_id);
  const isApproval = user.isApproval_Manager();
  const isFinanceDirector = user.isFinanceDirector();
  const isTl = user.isFinanceTeamLeader();
  const isF_Employee = user.isFinanceEmployee();
  useEffect(() => {
    user.isApproval_Manager()
      ? setState({
          ...state,
          approve: "text-dark",
          myAllowance: "",
          fd: "",
          tl: "",
          fe: "",
          atl: "",
          adr: "",
          comp: "",
        })
      : user.isFinanceDirector()
      ? setState({
          ...state,
          approve: "",
          myAllowance: "",
          fd: "text-dark",
          tl: "",
          fe: "",
          atl: "",
          adr: "",
          comp: "",
        })
      : isTl
      ? setState({
          ...state,
          approve: "",
          myAllowance: "",
          fd: "",
          tl: "text-dark",
          fe: "",
          atl: "",
          adr: "",
          comp: "",
        })
      : isF_Employee
      ? setState({
          ...state,
          approve: "",
          myAllowance: "",
          fd: "",
          tl: "",
          fe: "text-dark",
          atl: "",
          adr: "",
          comp: "",
        })
      : setState({
          ...state,
          approve: "",
          myAllowance: "text-dark",
          fd: "",
          tl: "",
          fe: "",
          atl: "",
          adr: "",
          comp: "",
        });
  }, [userType]);
  return (
    <div
      className={
        "app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header " +
        state.collapse
      }
    >
      <LayoutContext.Provider value={{ uiContents: state, togglers: setState }}>
        <Navbar />
        <div className="app-main">
          <SideNav />

          <div className="app-main__outer">
            <div className="app-main__inner">
              {/**Navigation */}
              <div className="container my-3">
                <div className="row">
                  {isApproval ? (
                    <div
                      className="col-lg-3 notification my-auto text-center bg-warning"
                      style={{ border: "2px solid", borderColor: "lightgray" }}
                      onClick={() =>
                        setState({
                          ...state,
                          approve: "text-dark",
                          myAllowance: "",
                          fd: "",
                          fe: "",
                          atl: "",
                          adr: "",
                          comp: "",
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faStamp}
                        className={
                          "nav-link-icon my-auto text-white " + state.approve
                        }
                      />
                      <h5
                        className={
                          "font-weight-bold text-white my-auto " + state.approve
                        }
                      >
                        Approval allowances
                      </h5>
                      {ManagerNewAllowance !== 0 ? (
                        <h5 className="badge bg-success">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {ManagerNewAllowance}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  ) : (
                    <p></p>
                  )}
                  {isFinanceDirector ? (
                    <div
                      className="col-lg-3 notification my-auto text-center bg-warning"
                      style={{ border: "2px solid", borderColor: "lightgray" }}
                      onClick={() =>
                        setState({
                          ...state,
                          approve: "",
                          myAllowance: "",
                          fd: "text-dark",
                          tl: "",
                          fe: "",
                          atl: "",
                          adr: "",
                          comp: "",
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faArrowAltCircleRight}
                        className={
                          "nav-link-icon my-auto mx-2 text-white " + state.fd
                        }
                      />
                      <h5
                        className={
                          "font-weight-bold text-white my-auto " + state.fd
                        }
                      >
                        Incoming Allowance
                      </h5>
                      {pendingDirector !== 0 ? (
                        <h5 className="badge bg-success">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {pendingDirector}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  ) : (
                    <p></p>
                  )}
                  {isTl ? (
                    <div
                      className="col-lg-3 bg-warning notification my-auto text-center"
                      style={{ border: "2px solid", borderColor: "lightgray" }}
                      onClick={() =>
                        setState({
                          ...state,
                          approve: "",
                          myAllowance: "",
                          fd: "",
                          tl: "text-dark",
                          fe: "",
                          atl: "",
                          adr: "",
                          comp: "",
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faArrowAltCircleRight}
                        className={
                          "nav-link-icon text-white my-auto mx-2 " + state.tl
                        }
                      />
                      <h5
                        className={
                          "font-weight-bold text-white my-auto " + state.tl
                        }
                      >
                        Incoming Allowance
                      </h5>
                      {pendingTl !== 0 ? (
                        <h5 className="badge bg-success">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {pendingTl}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  ) : (
                    <p></p>
                  )}
                  {isTl ? (
                    <div
                      className="col-lg-3 bg-warning notification my-auto text-center"
                      style={{ border: "2px solid", borderColor: "lightgray" }}
                      onClick={() =>
                        setState({
                          ...state,
                          approve: "",
                          myAllowance: "",
                          fd: "",
                          tl: "",
                          fe: "",
                          atl: "text-dark",
                          adr: "",
                          comp: "",
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={
                          "nav-link-icon text-white my-auto mx-2 " + state.atl
                        }
                      />
                      <h5
                        className={
                          "font-weight-bold text-white my-auto " + state.atl
                        }
                      >
                        Done allowance
                      </h5>
                      {tlApprove !== 0 ? (
                        <h5 className="badge bg-success">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {tlApprove}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                      {redone !== 0 ? (
                        <h5 className="badge bg-warning">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {redone}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  ) : (
                    <p></p>
                  )}

                  {isFinanceDirector ? (
                    <div
                      className="col-lg-3 bg-warning notification my-auto text-center"
                      style={{ border: "2px solid", borderColor: "lightgray" }}
                      onClick={() =>
                        setState({
                          ...state,
                          approve: "",
                          myAllowance: "",
                          fd: "",
                          tl: "",
                          fe: "",
                          atl: "",
                          adr: "text-dark",
                          comp: "",
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={
                          "nav-link-icon text-white my-auto mx-2 " + state.adr
                        }
                      />
                      <h5
                        className={
                          "font-weight-bold text-white my-auto " + state.adr
                        }
                      >
                        Done allowance
                      </h5>
                      {Drapprove !== 0 ? (
                        <h5 className="badge bg-success">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {Drapprove}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                      {ReDone ? (
                        <h5 className="badge bg-warning">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {ReDone}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  ) : (
                    <p></p>
                  )}
                  {isF_Employee ? (
                    <div
                      className="col-lg-3 bg-warning notification my-auto text-center"
                      style={{ border: "2px solid", borderColor: "lightgray" }}
                      onClick={() =>
                        setState({
                          ...state,
                          approve: "",
                          myAllowance: "",
                          fd: "",
                          tl: "",
                          fe: "text-dark",
                          atl: "",
                          adr: "",
                          comp: "",
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className={
                          "nav-link-icon text-white my-auto mx-2 " + state.fe
                        }
                      />
                      <h5
                        className={
                          "font-weight-bold text-white my-auto " + state.fe
                        }
                      >
                        Incoming Allowance
                      </h5>
                      {newCalculations !== 0 ? (
                        <h5 className="badge bg-success">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {newCalculations}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                      {tlCommented !== 0 ? (
                        <h5 className="badge bg-warning">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {tlCommented}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                      {drCommented !== 0 ? (
                        <h5 className="badge bg-warning">
                          <FontAwesomeIcon icon={faBell} className="mx-2" />
                          {drCommented}
                        </h5>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  ) : (
                    <p></p>
                  )}
                  <div
                    className="col-lg-3 bg-warning notification text-center"
                    style={{ border: "2px solid", borderColor: "lightgray" }}
                    onClick={() =>
                      setState({
                        ...state,
                        approve: "",
                        myAllowance: "text-dark",
                        fd: "",
                        tl: "",
                        fe: "",
                        atl: "",
                        adr: "",
                        comp: "",
                      })
                    }
                  >
                    <FontAwesomeIcon
                      icon={faBook}
                      className={
                        "nav-link-icon text-white my-auto mx-2  " +
                        state.myAllowance
                      }
                    />
                    <h5
                      className={
                        "font-weight-bold text-white my-auto " +
                        state.myAllowance
                      }
                    >
                      my Allowance
                    </h5>
                    {completedAllowance !== 0 ? (
                      <h5 className="badge bg-success">
                        <FontAwesomeIcon icon={faBell} className="mx-2" />
                        {completedAllowance}
                      </h5>
                    ) : (
                      <h5></h5>
                    )}
                  </div>
                </div>
              </div>
              {/**Body */}
              {loading || empLoading || userLoading ? (
                <DataLoading />
              ) : error || empError || userError ? (
                <ErrorLoading />
              ) : state.approve === "text-dark" ? (
                <ApprovalManagerAllowance />
              ) : state.fd === "text-dark" ? (
                <ShowPending />
              ) : state.tl === "text-dark" ? (
                <ShowPending_TL />
              ) : state.fe === "text-dark" ? (
                <IncomingCalculations />
              ) : state.atl === "text-dark" ? (
                <ShowTlCalculations />
              ) : state.adr === "text-dark" ? (
                <ShowCalculated />
              ) : state.comp === "text-dark" ? (
                <AllCompleted />
              ) : (
                <NonFinanceShow />
              )}
              {/** */}
            </div>
          </div>
        </div>
      </LayoutContext.Provider>
    </div>
  );
};

export default Allowance;
