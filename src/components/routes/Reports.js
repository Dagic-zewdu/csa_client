import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useContext } from "react";
import AllCompleted from "../Allowance/View/AllCompleted";
import { LayoutContext, StoreContext } from "../contexts/contexts";
import CompletedDeduction from "../Deduction/CompletedDeduction";
import DataLoading from "../layout/DataLoading";
import ErrorLoading from "../layout/ErrorLoading";
import Navbar from "../layout/Navbar/Navbar";
import SideNav from "../layout/SideNav/SideNav";

const Reports = () => {
  const [state, setState] = useState({
    allowance: "text-dark",
    deduction: "",
    collapse: "",
  });

  const { allowances, deductions, users } = useContext(StoreContext);
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
              <div className="container my-3">
                <div className="row">
                  <div
                    className="col-lg-6 bg-warning"
                    style={{ border: "2px solid", borderColor: "lightgray" }}
                    onClick={() =>
                      setState({
                        ...state,
                        allowance: "text-dark",
                        deduction: "",
                      })
                    }
                  >
                    <h4 className={"text-center text-white " + state.allowance}>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={
                          "text-center mx-2 text-white " + state.allowance
                        }
                      />
                      Completed Allowance
                    </h4>
                  </div>
                  <div
                    className="col-lg-6 bg-warning"
                    style={{ border: "2px solid", borderColor: "lightgray" }}
                    onClick={() =>
                      setState({
                        ...state,
                        allowance: "",
                        deduction: "text-dark",
                      })
                    }
                  >
                    <h4 className={"text-center text-white " + state.deduction}>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={
                          "text-center mx-2 text-white " + state.deduction
                        }
                      />
                      Completed Deduction
                    </h4>
                  </div>
                </div>
              </div>
              {/*  */}
              {allowances.loading || deductions.loading ? (
                <DataLoading />
              ) : allowances.error || deductions.error ? (
                <ErrorLoading />
              ) : state.allowance === "text-dark" ? (
                <AllCompleted />
              ) : state.deduction === "text-dark" ? (
                <CompletedDeduction />
              ) : (
                <p></p>
              )}
              {/*  */}
            </div>
          </div>
        </div>
      </LayoutContext.Provider>
    </div>
  );
};

export default Reports;
