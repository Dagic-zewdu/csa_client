import {
  faChartLine,
  faCheckCircle,
  faEye,
  faUser,
  faUserCheck,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useContext } from "react";
import { Message } from "../../controllers/Message";
import { StoreContext } from "../contexts/contexts";

const LetterProgress = ({ l_id: id }) => {
  const {
    socket,
    messages,
    connections,
    employees,
    users,
    letters,
  } = useContext(StoreContext);

  const message = new Message(
    messages.state,
    connections.state,
    letters.state,
    users.state,
    employees.state
  );

  const tprogress = message.totallProgress(id);
  const color = message
    .approval_managers(id)
    .find((ap) => ap.status === "unApproved")
    ? "red"
    : "info";
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 my-2">
          {message.approval_managers(id).length ? (
            <h4 className="text-center">Approval managers</h4>
          ) : (
            <p></p>
          )}
        </div>
        <div className="col-lg-12">
          {message.approval_managers(id).length ? (
            <MDBTable striped hover>
              <MDBTableHead>
                <tr>
                  <th>#Employee id</th>
                  <th>
                    <FontAwesomeIcon icon={faUser} className="mx-2" />
                    Employee name
                  </th>
                  <th>
                    <FontAwesomeIcon icon={faChartLine} className="mx-2" />
                    Approval stage
                  </th>
                  <th>
                    <FontAwesomeIcon icon={faUserCheck} className="mx-2" />
                    Seen
                  </th>
                  <th className="text-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="mx-2" />
                    Approval status
                  </th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {message.approval_managers(id).map((m) => {
                  return (
                    <tr key={m._id}>
                      <td>{m.emp_id}</td>
                      <td>{message.Name(m.emp_id)}</td>
                      <td>{m.step}</td>
                      <td>{m.seen ? "Seen" : "not Seen"}</td>
                      <td>
                        {m.status === "Approved" ? (
                          <p className="text-center text-success">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="fa-2x mx-2 text-success"
                            />
                            Approved
                          </p>
                        ) : m.status === "unApproved" ? (
                          <p className="text-center">
                            <FontAwesomeIcon
                              icon={faWindowClose}
                              className="fa-2x mx-2 text-danger"
                            />
                            unApproved
                          </p>
                        ) : m.status === "waiting" && m.seen ? (
                          <p className="text-center">
                            <FontAwesomeIcon
                              icon={faEye}
                              className="fa-2x mx-2 text-info"
                            />
                            Reviewing
                          </p>
                        ) : m.status === "waiting" ? (
                          <p className="text-center font-weight-bold">
                            waiting
                          </p>
                        ) : (
                          <p></p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            </MDBTable>
          ) : (
            <p></p>
          )}
        </div>
        <div className="col-lg-12 my-2">
          {message.participants(id).length ? (
            <h4 className="text-center">participants</h4>
          ) : (
            <p></p>
          )}

          {message.participants(id).length ? (
            <MDBTable striped hover>
              <MDBTableHead>
                <tr>
                  <th className="text-center"># Employee id</th>
                  <th>
                    <FontAwesomeIcon icon={faUser} className="mx-2" />
                    Employee name
                  </th>
                  <th>
                    <FontAwesomeIcon icon={faUserCheck} className="mx-2" />
                    Seen
                  </th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {message.participants(id).map((p) => {
                  return (
                    <tr key={p._id}>
                      <td className="text-center">{p.emp_id}</td>
                      <td>{message.Name(p.emp_id)}</td>
                      <td>{p.seen ? "Seen" : "not Seen"}</td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            </MDBTable>
          ) : (
            <p></p>
          )}
        </div>
        <div className="col-lg-12">
          <div
            className={
              "mb-3 widget-chart widget-chart2 text-left card card-shadow-" +
              color
            }
          >
            <div className="widget-content">
              <div className="widget-content-outer">
                <div className="widget-content-wrapper">
                  <div className="widget-content-left pr-2 fsize-1">
                    <div
                      className={"widget-numbers mt-0 fsize-3 text-" + color}
                    >
                      {message.totallProgress(id)}%
                    </div>
                  </div>
                  <div className="widget-content-right w-100">
                    <div className="progress-bar-xs progress">
                      <div
                        className={"progress-bar bg-" + color}
                        role="progressbar"
                        aria-valuenow={message.totallProgress(id)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: message.totallProgress(id) + "%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="widget-content-left fsize-1">
                  <div className="text-muted opacity-6">
                    Approval Totall progress made
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {message.unApproved(id).length ? (
          <div className="col-lg-12">
            <h4 className="text-center font-weight-bold text-danger">
              The following managers does not approve this letter because of
            </h4>
            {message.unApproved(id).map((m) => {
              return (
                <p className="text-danger font-italic font-weight-bold text-center">
                  {message.Name(m.emp_id)}-
                  {message.manager_info(id, m.emp_id)
                    ? message.manager_info(id, m.emp_id).comment
                    : ""}
                </p>
              );
            })}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default LetterProgress;
