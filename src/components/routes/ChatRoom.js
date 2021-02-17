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
import Navbar from "../layout/Navbar/Navbar";
import SideNav from "../layout/SideNav/SideNav";
import Chat from "../letters/Chat";

function ChatRoom() {
  const [state, setState] = useState({
    collapse: "",
  });
  const { letters, users, employees, messages, connections } = useContext(
    StoreContext
  );
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

              {/** */}
              <Chat />
            </div>
          </div>
        </div>
      </LayoutContext.Provider>
    </div>
  );
}

export default ChatRoom;
