import {
  faBarcode,
  faCalendar,
  faCog,
  faObjectGroup,
  faPaperPlane,
  faSdCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useContext, useEffect, useState } from "react";
import { DeductionClass } from "../../controllers/Deductions";
import { StoreContext } from "../contexts/contexts";
import { fetchData_Deductions } from "../fetchers/Functions/FerchDeductions";
import ModalDeduction from "../layout/ModalDeduction";

const CompletedDeduction = () => {
  const [state, setState] = useState({
    deductions: [],
    found: false,
  });
  const {
    allowances,
    dispatchDeductions,
    deductions,
    employees,
    users,
  } = useContext(StoreContext);
  const { state: Allowances } = allowances;
  const { state: Employees } = employees;
  const { state: Users } = users;
  const { state: Deductions } = deductions;
  const Deduction = new DeductionClass(
    Deductions,
    Allowances,
    Employees,
    Users
  );
  const CompleteDeductions = Deduction.completedDeductions();
  const fetch = () => fetchData_Deductions(dispatchDeductions);
  useEffect(() => {
    fetchData_Deductions(dispatchDeductions);
    setState({ ...state, deductions: CompleteDeductions });
  }, []);
  const handleSearch = (index) => {
    const results =
      index === "" ? CompleteDeductions : Deduction.searchCompleted(index);
    const found = index === "" ? false : true;
    setState({ ...state, deductions: results, found });
  };
  const listDeductions = state.deductions.length ? (
    state.deductions.map((d) => {
      return (
        <tr key={d._id}>
          <td className="text-center">{d.id}</td>
          <td className="text-center">
            {Deduction.findAllowance(d.allowance_id)
              ? Deduction.findAllowance(d.allowance_id).id
              : ""}
          </td>
          <td>{Deduction.Name(d.creater)}</td>
          <td>{Deduction.Department(d.creater)}</td>
          <td>
            <ModalDeduction
              type="view_calculation"
              fetch={fetch}
              deduction={d}
              ftl={false}
            />
            <ModalDeduction
              type="view_final"
              deduction={d}
              fetch={fetch}
              user={false}
            />
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={5} className="text-center text-danger font-weight-bold">
        No deductions completed yet
      </td>
    </tr>
  );
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3 my-auto"></div>
        <div className="col-lg-5 my-auto">
          <div className="search-wrapper active">
            <div className="input-holder">
              <input
                type="text"
                className="search-input"
                placeholder="Type deduction id, allowance id"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className="search-icon">
                <span></span>
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-4 my-auto">
          <div className="card mb-3 widget-content bg-grow-early">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Deductions</div>
                <div className="widget-subheading">Totall completed</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span>{CompleteDeductions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/** */}
        <div className="container mt-3 main-card mb-3 card min-height">
          <div className="row">
            <div className="col-lg-12">
              {state.found ? (
                <h5 className="text-center">
                  Deductions found -{state.deductions.length}
                </h5>
              ) : (
                <p></p>
              )}
              <MDBTable hover bordered striped>
                <MDBTableHead>
                  <tr>
                    <th>
                      <FontAwesomeIcon icon={faBarcode} className="mx-2" />
                      Deduction id
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faPaperPlane} className="mx-2" />
                      Allowance id attached
                    </th>

                    <th>
                      <FontAwesomeIcon icon={faUser} className="mx-2" />
                      Employee name
                    </th>

                    <th>
                      <FontAwesomeIcon icon={faObjectGroup} className="mx-2" />
                      Department
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faCog} className="mx-2" />
                      Options
                    </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>{listDeductions}</MDBTableBody>
              </MDBTable>
            </div>
          </div>
        </div>

        {/** */}
      </div>
    </div>
  );
};

export default CompletedDeduction;
