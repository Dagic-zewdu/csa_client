import {
  faCalendar,
  faChartLine,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useContext, useEffect, useState } from "react";
import Progress from "reactstrap/lib/Progress";
import { localTime, TellDay } from "../../controllers/Date";
import { Message } from "../../controllers/Message";
import { StoreContext } from "../contexts/contexts";
import ModalLetter from "../layout/ModalLetter";

const OutboxLetters = () => {
  const [state, setState] = useState({
    Letters: [],
    found: false,
  });

  const {
    employees,
    users,
    connections,
    messages,
    letters,
    socket,
  } = useContext(StoreContext);
  const message = new Message(
    messages.state,
    connections.state,
    letters.state,
    users.state,
    employees.state
  );
  useEffect(() => {
    setState({ ...state, Letters: message.outBox() });
  }, [letters]);

  const Letters = message.outBox();
  const handleSearch = (index) =>
    setState({
      ...state,
      Letters: index === "" ? Letters : message.searchLetters(index),
      found: index === "" ? false : true,
    });
  const emitter = () => {
    socket.emit("chat", "");
    socket.emit("letters", "");
    socket.on("chat", (data) => {
      let Mess = new Message(
        data,
        connections.state,
        letters.state,
        users.state,
        employees.state
      );
      setState((s) => ({ ...s, Letters: Mess.outBox() }));
    });
  };

  const typing_letter = () =>
    socket.emit("typing_letter", { emp_id: messages.getEmp_id() });
  const stop_typing = () => socket.emit("typing_letter", { emp_id: "" }); //for creating letter

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3 my-auto">
          <ModalLetter
            type="Create_letter"
            typing={typing_letter}
            stop_typing={stop_typing}
          />
        </div>
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
                <div className="widget-heading">Letters</div>
                <div className="widget-subheading">Totall Made</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span>{Letters.length}</span>
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
                  Letters found -{state.Letters.length}
                </h5>
              ) : (
                <p></p>
              )}
              <MDBTable hover bordered striped>
                <MDBTableHead>
                  <tr>
                    <th># Letter id</th>
                    <th>Title</th>

                    <th>Type</th>

                    <th>
                      <FontAwesomeIcon icon={faCalendar} className="mx-2" />
                      created
                    </th>

                    <th>
                      <FontAwesomeIcon icon={faChartLine} className="mx-2" />
                      Progress
                    </th>
                    <th>
                      <FontAwesomeIcon icon={faCog} className="mx-2" />
                      Options
                    </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {state.Letters.length ? (
                    state.Letters.map((l) => {
                      return (
                        <tr key={l._id}>
                          <td className="text-center">{l.id}</td>
                          <td className="text-center">{l.title}</td>
                          <td className="text-center">{l.type}</td>
                          <td className="text-center">
                            <p className="font-italic">
                              {TellDay(l.created_date)} <br />
                              {localTime(l.created_date)}
                            </p>
                          </td>
                          {message.approval_managers(l._id).length ? (
                            <td>
                              {message.totallProgress(l._id) === 100 ? (
                                <h4 className="text-center text-success font-italic">
                                  Approval stage is completed
                                </h4>
                              ) : (
                                <div className="">
                                  <Progress
                                    color="info"
                                    value={message.totallProgress(l._id)}
                                  />
                                  {"" + message.totallProgress(l._id) + "%"}
                                </div>
                              )}
                            </td>
                          ) : (
                            <td>
                              <p className="font-italic text-danger">
                                The letter has no approval stage
                              </p>
                            </td>
                          )}
                          <td>
                            <ModalLetter type="view_letter" l_id={l._id} />
                            <ModalLetter type="progress" l_id={l._id} />
                            {message.isModifiable(l._id) ? (
                              <ModalLetter type="edit_letter" l_id={l._id} />
                            ) : (
                              <p></p>
                            )}
                            {message.isModifiable(l._id) ? (
                              <ModalLetter
                                type="delete_letter"
                                l_id={l._id}
                                emitter={emitter}
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
                      <td colSpan={6}>
                        <p className="text-center font-weight-bold text-danger">
                          No letters are created
                        </p>
                      </td>
                    </tr>
                  )}
                </MDBTableBody>
              </MDBTable>
            </div>
          </div>
        </div>

        {/** */}
      </div>
    </div>
  );
};

export default OutboxLetters;
