import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { durationDays, ToEthiopianDateSting } from "../../controllers/Date";

class PrintLetter extends Component {
  render() {
    let { company, Mess, Letter, id } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12 my-2">
            <h3 className="text-center font-weight-bold">
              {company.state[0].name}
            </h3>
          </div>
          <div className="col-lg-6 my-2">
            <h6 className="text-center font-weight-bold">
              {Letter
                ? Letter.creater === Mess.getEmp_id()
                  ? ""
                  : "to - " + Mess.Name(Mess.getEmp_id())
                : ""}
            </h6>
            <h6 className="text-center font-weight-bold">
              {Letter
                ? Letter.creater === Mess.getEmp_id()
                  ? ""
                  : "from - " + Mess.Name(Letter.creater)
                : ""}{" "}
              <br />
              {Letter
                ? Letter.creater === Mess.getEmp_id()
                  ? ""
                  : "Department - " + Mess.Department(Letter.creater)
                : ""}
            </h6>
          </div>
          <div className="col-lg-6 my-2">
            <h6 className="text-center font-italic float-right">
              Letter id- {Letter.id} <br />
              Date -{Letter ? ToEthiopianDateSting(Letter.created_date) : ""}
            </h6>
          </div>
          {Letter ? (
            Letter.type === "allowance" ? (
              <div className="col-lg-6">
                <p className="text-center font-italic">
                  Project name -{Letter.project_name} <br />
                  program- {Letter.program} <br />
                  objective- {Letter.objective} <br />
                  duration days-{" "}
                  {parseInt(
                    durationDays(Letter.initial_date, Letter.return_date)
                  ) + 1}
                </p>
              </div>
            ) : (
              <p></p>
            )
          ) : (
            <p></p>
          )}
          {Letter ? (
            Letter.type === "allowance" ? (
              <div className="col-lg-6">
                <p className="text-center font-italic font-weight-bold">
                  Initial date - {ToEthiopianDateSting(Letter.initial_date)}{" "}
                  <br />
                  return date-{ToEthiopianDateSting(Letter.return_date)} <br />
                  Initial place- {Letter.initial_place} <br />
                  Destination place-{Letter.destination_place} <br />
                </p>
              </div>
            ) : (
              <p></p>
            )
          ) : (
            <p></p>
          )}

          <div className="col-lg-12 my-2">
            <h4 className="text-center font-weight-bold">
              {Letter ? Letter.title : ""}
            </h4>
          </div>
          <div className="col-lg-12 my-2">
            <Editor
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              readOnly={true}
              toolbarHidden={true}
              editorState={Mess.editorState(id)}
            />
          </div>
          <div className="col-lg-6 y-2">
            {Mess.isApproval(id) ? (
              Mess.approvedManagers().map((l) => {
                return (
                  <p className="text-center font-weight-bold">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-success fa-2x mx-2"
                    />
                    {Mess.Name(l.emp_id)}
                  </p>
                );
              })
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default PrintLetter;
