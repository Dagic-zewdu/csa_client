import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { Message } from "../../controllers/Message";
import { Donothing } from "../../controllers/saveProcess";
import { StoreContext } from "../contexts/contexts";
import PrintLetter from "./PrintLetter";

const ViewLetters = ({ l_id: id, setSize }) => {
  const {
    socket,
    company,
    letters,
    employees,
    messages,
    users,
    connections,
  } = useContext(StoreContext);

  const Mess = new Message(
    messages.state,
    connections.state,
    letters.state,
    users.state,
    employees.state
  );
  const Letter = Mess.find_letter(id);
  const emp_id = Mess.getEmp_id();

  useEffect(() => {
    setSize ? setSize("xl") : Donothing();
    Mess.manager_info(id)
      ? socket.emit("update_letter", {
          ...Letter,
          approval_manager: [
            ...Mess.approval_managers(id).filter((m) => m.emp_id !== emp_id),
            { ...Mess.manager_info(id, emp_id), seen: true },
          ],
        })
      : Donothing();

    Mess.participants(id).find((m) => m.emp_id === emp_id)
      ? socket.emit("update_letter", {
          ...Letter,
          participants: [
            ...Mess.participants(id).filter((m) => m.emp_id !== emp_id),
            { ...Mess.particpant_info(id, emp_id), seen: true },
          ],
        })
      : Donothing();
  }, []);
  const componentRef = useRef();
  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <div className="container">
            <div className="row">
              <div className="col-lg-9"></div>
              <div className="col-lg-3">
                <button className="btn btn-outline-info">
                  <FontAwesomeIcon icon={faPrint} className="mx-2" />
                  Print
                </button>
              </div>
            </div>
          </div>
        )}
        content={() => componentRef.current}
      />
      <PrintLetter
        ref={componentRef}
        company={company}
        Mess={Mess}
        Letter={Letter}
        id={id}
      />
    </div>
  );
};

export default ViewLetters;
