import {
  faBell,
  faComment,
  faEnvelopeOpen,
  faEnvelopeOpenText,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Message } from "../../controllers/Message";
import { LayoutContext, StoreContext } from "../contexts/contexts";
import DataLoading from "../layout/DataLoading";
import ErrorLoading from "../layout/ErrorLoading";
import Navbar from "../layout/Navbar/Navbar";
import SideNav from "../layout/SideNav/SideNav";
import OutboxLetters from "../letters/OutboxLetters";

const OutBoxLetters = () => {
  const [state, setState] = useState({
    collapse: "",
  });
  const { letters, employees, messages, users, connections } = useContext(
    StoreContext
  );
  const { loading: empLoading, error: empError } = letters;
  const Messages = new Message(
    messages.state,
    connections.state,
    letters.state,
    users.state,
    employees.state
  ); //importing message class
  const notify = !messages.loading ? Messages.newInboxLetters().length : 0;

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
              <div className="container">
                <div className="row">
                  <div className="col-lg-3">
                    <h4 className="text-center">
                      <NavLink to="/inbox">
                        <FontAwesomeIcon
                          icon={faEnvelopeOpen}
                          className="fa-1x mx-2 text-danger"
                        />
                        Inbox letters
                        {notify ? (
                          <h4 className="mx-1 text-info font-weight-bold">
                            <FontAwesomeIcon
                              icon={faBell}
                              className="text-info mx-1"
                            />
                            {notify}
                          </h4>
                        ) : (
                          <p></p>
                        )}
                      </NavLink>
                    </h4>
                  </div>
                  <div className="col-lg-3">
                    <h4 className="text-center">
                      <NavLink to="/outbox">
                        <FontAwesomeIcon
                          icon={faEnvelopeOpenText}
                          className="fa-1x mx-2 text-danger"
                        />
                        outbox letters
                      </NavLink>
                    </h4>
                  </div>
                </div>
              </div>
              {/** */}
              {empLoading ? (
                <DataLoading />
              ) : empError ? (
                <ErrorLoading />
              ) : (
                <OutboxLetters />
              )}
            </div>
          </div>
        </div>
      </LayoutContext.Provider>
    </div>
  );
};

export default OutBoxLetters;
