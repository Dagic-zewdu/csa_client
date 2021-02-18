import React, { useContext, useEffect, useState } from "react";
import {
  faBarcode,
  faDraftingCompass,
  faCog,
  faTruckMoving,
  faUser,
  faHammer,
  faObjectGroup,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { MDBTableBody, MDBTable, MDBTableHead } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StoreContext } from "../../contexts/contexts";
import { AllowanceClass } from "../../../controllers/Allowance";
import { DotLoading } from "../../layout/Loading";
import ModalAllowance from "../../layout/ModalAllowance";
import { fetchData_Allowance } from "../../fetchers/Functions/FecthAllowance";

const ShowTlCalculations = () => {
  const { allowances, dispatchAllowances, employees, users } = useContext(
    StoreContext
  );
  const [state, setState] = useState({
    newAllowances: [],
    seenAllowances: [],
    found: false,
  });
  const { state: Allowances, loading, error } = allowances;
  const { state: Employees, loading: empLoading, error: empError } = employees;
  const { state: Users, loading: userLoading, error: userError } = users;
  const allowance = new AllowanceClass(Allowances, Employees, Users);

  const newAllowances = allowance.tlNewApprove();
  const seenAllowances = allowance.tlSeenApprove();
  const allAllowances = allowance.tlApprove();
  const redone = allowance.redone();
  //fetch if change occurs
  const fetch = () => fetchData_Allowance(dispatchAllowances);
  useEffect(() => {
    fetch();
    setState((s) => ({ ...s, newAllowances, seenAllowances }));
  }, [Allowances.length, loading]);

  //new allowances render
  const NewAllowances =
    loading || empLoading || userLoading ? (
      <tr>
        <td colSpan={5} className="text-center">
          <DotLoading />
        </td>
      </tr>
    ) : error || empError || userError ? (
      <tr>
        <td colSpan={5} className="text-center text-danger">
          ...oops Loading failed server is not responding
        </td>
      </tr>
    ) : (
      state.newAllowances.map((na) => {
        return (
          <tr key={na._id}>
            <td className="text-info">{na.id}</td>
            <td className="text-info">{allowance.Name(na.creater)}</td>

            <td className="text-info">{na.letter_id}</td>
            <td className="text-info">
              {na.initial_place}-{na.destination_place}
            </td>
            <td className="text-info">{na.f_approve_tm.approved}</td>
            <td className="text-info">
              <ModalAllowance
                type="view_details"
                allowance={na}
                fetch={fetch}
                Manager_seen={false}
                pendingDirector={false}
                adr={false}
                approve_tl={true}
                pendingTeamLeader={false}
                incomingCalculations={false}
              />
              <ModalAllowance
                type="see_calculations"
                allowance={na}
                tl={true}
                director={false}
                fetch={fetch}
              />
            </td>
          </tr>
        );
      })
    );
  //seen allowance render
  const SeenAllowances =
    loading || empLoading || userLoading ? (
      <tr>
        <td colSpan={5} className="text-center">
          <DotLoading />
        </td>
      </tr>
    ) : error || empError || userError ? (
      <tr>
        <td colSpan={5} className="text-center text-danger">
          ...oops Loading failed server is not responding
        </td>
      </tr>
    ) : allAllowances.length ? (
      state.seenAllowances.map((na) => {
        return (
          <tr key={na._id}>
            <td>{na.id}</td>
            <td>{allowance.Name(na.creater)}</td>
            <td>{na.letter_id}</td>
            <td>
              {na.initial_place}-{na.destination_place}
            </td>
            <td>
              {allowance.progress(na._id) === 16 &&
              allowance.isRedone(na._id) ? (
                <h6 className="text-center font-weight-bold text-warning font-italic">
                  Allowance calculation is redone please see the calculation
                </h6>
              ) : (
                <p></p>
              )}
              {na.f_approve_tm.approved}

              {allowance.progress(na._id) === 16 ? (
                <p className="font-italic text-warning font-weight-bold">
                  comment-{na.f_approve_tm.comment}
                </p>
              ) : (
                <p></p>
              )}
            </td>
            <td>
              <ModalAllowance
                type="view_details"
                allowance={na}
                fetch={fetch}
                Manager_seen={true}
              />
              <ModalAllowance
                type="see_calculations"
                allowance={na}
                tl={true}
                director={false}
                fetch={fetch}
              />
              {allowance.progress(na._id) < 19 ? (
                <ModalAllowance
                  type="approve_tl"
                  allowance={na}
                  fetch={fetch}
                />
              ) : (
                <p></p>
              )}
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={5} className="text-center text-danger">
          ...oops No allowances yet
        </td>
      </tr>
    );
  /**return's array of allowances that resulted from searching
   * @param {*} index-string to search
   */
  const handleSearch = (index) =>
    setState((s) => ({
      ...s,
      newAllowances:
        index === ""
          ? newAllowances
          : allowance.searchAllowances(newAllowances, index),
      seenAllowances:
        index === ""
          ? seenAllowances
          : allowance.searchAllowances(seenAllowances, index),
      found: index === "" ? false : true,
    }));
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
                placeholder="Type allowance id,creater name..."
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
                <div className="widget-heading">Allowances</div>
                <div className="widget-subheading">Totall Recieved</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span>{allAllowances.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row  mt-3 main-card mb-3 card min-height">
        <div className="col-lg-12">
          {state.found ? (
            <h5 className="text-center">
              Allowance found -
              {state.newAllowances.length + state.seenAllowances.length}
            </h5>
          ) : (
            <p></p>
          )}
          {newAllowances.length ? (
            <h5 className="text-center text-info my-2">
              <FontAwesomeIcon icon={faBell} className="mx-2" />
              New Allowances Done ({newAllowances.length})
            </h5>
          ) : (
            <p></p>
          )}
          {redone.length ? (
            <h5 className="text-center text-warning my-2">
              <FontAwesomeIcon icon={faBell} className="mx-2" />
              {redone.length} allowance calculation is redone
            </h5>
          ) : (
            <p></p>
          )}
        </div>

        <div className="col-lg-12">
          <MDBTable hover bordered striped>
            <MDBTableHead>
              <tr>
                <th>
                  <FontAwesomeIcon icon={faBarcode} className="mx-2" />
                  Allowance id
                </th>
                <th>
                  <FontAwesomeIcon icon={faUser} className="mx-2" />
                  From user
                </th>

                <th>
                  <FontAwesomeIcon icon={faBarcode} className="mx-2" />
                  Letter id
                </th>

                <th>
                  <FontAwesomeIcon icon={faTruckMoving} className="mx-2" />
                  initial place -destination place
                </th>
                <th>
                  <FontAwesomeIcon icon={faHammer} className="mx-2" />
                  Decision
                </th>
                <th>
                  <FontAwesomeIcon icon={faCog} className="mx-2" />
                  Options
                </th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {NewAllowances}
              {SeenAllowances}
            </MDBTableBody>
          </MDBTable>
        </div>
      </div>
    </div>
  );
};

export default ShowTlCalculations;
