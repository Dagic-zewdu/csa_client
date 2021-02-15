import {
  faCheck,
  faComment,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useState } from "react";
import { getDate } from "../../controllers/Date";
import { Message } from "../../controllers/Message";
import { saveProcess } from "../../controllers/saveProcess";
import { loadLetters } from "../../store/Actions/letterActions";
import { encryptObject, decrptObject } from "../auth/encrypt";
import { host } from "../config/config";
import { StoreContext } from "../contexts/contexts";
import { emitter } from "../fetchers/Emmitters";
import { DotLoading } from "../layout/Loading";
import { userInfo } from "../users/userInfo";

const TakeActions = ({ l_id: id }) => {
  const [state, setState] = useState({
    approved: "",
    unApproved: false,
    comment: "",
    check: { Approved: false, unApproved: false },
    ...saveProcess("default"),
  });
  const {
    socket,
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({
        ...state,
        ...saveProcess("initial", "Taking decision please wait ..."),
      });
      const date = await getDate();
      const letter = {
        ...Letter,
        approval_manager: [
          ...Mess.approval_managers(id).filter((m) => m.emp_id !== emp_id),
          {
            ...Mess.manager_info(id),
            status: state.approved,
            comment: state.comment,
            approved_date: date,
          },
        ],
      };
      //update the letter
      const req = await axios.put(host + "/letter", {
        data: encryptObject({ ...letter, ...userInfo() }),
      });
      const res = decrptObject(req.data);
      if (res.updated) {
        let proceed = Mess.proceedStage(id); //checks wheter to proceed this stage
        if (proceed) {
          //procedd to the next stage
          let nextManager = Mess.nextEmployee(id); //select next manager
          let next = nextManager.length ? true : false; //check approval manager are there
          if (next) {
            let Data = nextManager.map((m) => {
              return {
                message: Letter.title,
                letter_id: id,
                file_name: "",
                sender: Letter.creater,
                reciever: m.emp_id,
              };
            }); //send message to the next employee

            let Req = await axios.post(host + "/messages", {
              data: encryptObject({
                messages: [
                  ...Data,
                  {
                    message:
                      state.approved === "Approved"
                        ? "System Notification " +
                          Mess.Name(emp_id) +
                          " has approved your letter " +
                          Letter.id
                        : state.approved === "unApproved"
                        ? "System notification " +
                          Mess.Name(emp_id) +
                          " un approved your letter because " +
                          state.comment
                        : "",
                    letter_id: "",
                    file_name: "",
                    sender: emp_id,
                    reciever: Letter.creater,
                  },
                ],
                ...userInfo(),
              }),
            }); //sending message with system notification
            let Res = decrptObject(Req.data); //decrypting response
            if (Res.created) {
              sendToParticipant();
            } else {
              sendToParticipant();
            }
          } else {
            sendToParticipant();
          }
        } else {
          setState({
            ...state,
            ...saveProcess("success", "Decison made succesfully"),
          });
        }
      } else {
        setState({
          ...state,
          ...saveProcess(
            "error",
            "Error made while taking decision making please try again letter"
          ),
        });
      }
      emitter(socket);
    } catch (err) {
      setState({
        ...state,
        ...saveProcess(
          "error",
          "Error made while taking decision making please try again letter"
        ),
      });
    }
  };

  const sendToParticipant = async () => {
    const Letters = await loadLetters();
    const M = new Message(
      messages.state,
      connections.state,
      Letters,
      users.state,
      employees.state
    );
    let progress = M.progress(id) === 100 ? true : false;
    let Participants = M.participants(id).length ? true : false;
    if (progress && Participants) {
      //if no approval manager are found send to participant
      let participant = Mess.participants(id);
      let Part = participant.map((p) => {
        return {
          message: Letter.title,
          letter_id: id,
          sender: Letter.creater,
          reciever: p.emp_id,
        };
      });
      let req = await axios.post(host + "/messages", {
        data: encryptObject({
          messages: [
            ...Part,
            {
              message:
                "System Notification- Letter " +
                Letter.id +
                " has completed approval stages and given to all participants",
              sender: emp_id,
              reciever: Letter.creater,
            },
          ],
          ...userInfo(),
        }),
      });
      let res = decrptObject(req.data);
    }
    setState({
      ...state,
      ...saveProcess("success", "Decison made succesfully"),
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="container">
        <div className="col-lg-12">
          {/* Approve */}
          <div className="input-container">
            <FontAwesomeIcon
              icon={faCheck}
              className="text-info fa-2x mx-2 my-auto "
            />
            <input
              type="checkbox"
              name="approval"
              value="male"
              checked={state.check.Approved}
              className="my-auto mx-3"
              onChange={(e) =>
                setState((s) => ({
                  ...state,
                  approved: s.approved === "Approved" ? "" : "Approved",
                  check: { Approved: !s.check.Approved, unApproved: false },
                }))
              }
            />
            Approve
          </div>
          {/* UnApprove */}
          <div className="input-container">
            <FontAwesomeIcon
              icon={faWindowClose}
              className="text-danger fa-2x mx-2 my-auto "
            />
            <input
              type="checkbox"
              name="approval"
              value="male"
              checked={state.check.unApproved}
              className="my-auto mx-3"
              onChange={(e) =>
                setState((s) => ({
                  ...state,
                  approved: s.approved === "unApproved" ? "" : "unApproved",
                  check: { Approved: false, unApproved: !s.check.unApproved },
                }))
              }
            />
            un Approve
          </div>
          {state.check.unApproved && state.approved === "unApproved" ? (
            <p className="font-weight-bold text-center">
              please write a comment why you unApprove this message
            </p>
          ) : (
            <p></p>
          )}

          {state.check.unApproved && state.approved === "unApproved" ? (
            <div className="input-container">
              <FontAwesomeIcon
                icon={faComment}
                className="text-warning fa-2x mx-2 my-auto "
              />
              <textarea
                className="input-field form-control my-auto"
                type="text"
                placeholder="write comment"
                onChange={(e) => {
                  setState({ ...state, comment: e.target.value });
                }}
                required={true}
                cols="20"
                rows="5"
              ></textarea>
            </div>
          ) : (
            <p></p>
          )}
          <div className="text-center">
            <p className="text-danger text-center font-weight-bold">
              {state.error}
            </p>
            <p className="text-success text-center font-weight-bold">
              {state.success}
            </p>
            <p className="text-info text-center font-weight-bold">
              {state.process}
            </p>
            {state.loading ? <DotLoading /> : <p></p>}
          </div>
          {state.check.Approved || state.check.unApproved ? (
            <button
              type="submit"
              className="float-right btn btn-info"
              disabled={state.disable}
            >
              Done
            </button>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </form>
  );
};

export default TakeActions;
