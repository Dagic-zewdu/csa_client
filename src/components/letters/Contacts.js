import {
  faCircle,
  faComment,
  faObjectGroup,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Message } from "../../controllers/Message";
import { removeDuplicates } from "../../controllers/removeRedudant";
import { Donothing } from "../../controllers/saveProcess";
import { Notification, StoreContext } from "../contexts/contexts";

const Contacts = () => {
  const [state, setState] = useState({
    f_director: [],
    f_sector_leader: [],
    directors: [],
    team_leaders: [],
    sector_leaders: [],
    employees: [],
    commisioner: [],
    users: [], // connected or discconnected users
  });
  const { users, employees, messages, connections } = useContext(StoreContext);

  const { state: Users, loading: userLoading, error: userError } = users;
  const { state: Employees, loading: empLoading, error: empError } = employees;
  const Messages = new Message(
    messages.state,
    connections.state,
    [],
    Users,
    Employees
  );
  const emp = removeDuplicates(
    [...Messages.Type("employee"), ...Messages.Type("f_employee")],
    "_id"
  );
  const directors = Messages.Type("director");
  const f_director = Messages.Type("f_director");
  const team_leaders = removeDuplicates(
    [...Messages.Type("f_team_leader"), ...Messages.Type("team_leader")],
    "_id"
  );
  const sector_leaders = Messages.Type("sector_leader");
  const f_sector_leader = Messages.Type("f_sector_leader");
  const commisioner = Messages.Type("senior_officer");
  useEffect(() => {
    setState({
      ...state,
      directors,
      employees: emp,
      f_sector_leader,
      f_director,
      team_leaders,
      sector_leaders,
      commisioner,
    });
  }, [userLoading, empLoading]);
  /**search name elements with search index provide */
  const handleSearch = (index) =>
    setState((s) => ({
      ...s,
      f_director:
        index !== "" ? Messages.ContactSearch(index).f_director : f_director,
      f_sector_leader:
        index !== ""
          ? Messages.ContactSearch(index).f_sector_leader
          : f_sector_leader,
      directors:
        index !== "" ? Messages.ContactSearch(index).directors : directors,
      team_leaders:
        index !== ""
          ? Messages.ContactSearch(index).team_leaders
          : team_leaders,
      sector_leaders:
        index !== ""
          ? Messages.ContactSearch(index).sector_leaders
          : sector_leaders,
      employees: index !== "" ? Messages.ContactSearch(index).employees : emp,
      commisioner:
        index !== "" ? Messages.ContactSearch(index).commisioner : commisioner,
    }));
  /***online users */

  return (
    <div className="col-lg-12">
      <div className="container">
        <div className="row">
          <div className="col-lg-6"></div>
          <div className="col-lg-6">
            <div className="search-wrapper active">
              <div className="input-holder">
                <input
                  type="text"
                  className="search-input"
                  placeholder="type name,department,id"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="search-icon">
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-card mb-3 min-height card">
        {Employees.length ? (
          <div className="container">
            <div className="row">
              {state.f_director.length ? (
                <div className="col-lg-12">
                  <h4 className="contact-header text-center">
                    Finance director
                  </h4>
                  <MDBTable bordered striped>
                    <MDBTableHead>
                      <tr>
                        <th className="text-center"># employee id</th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-1x text-danger mx-2"
                          />
                          name
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faObjectGroup}
                            className="fa-1x text-danger mx-2"
                          />
                          Department
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="fa-1x text-danger mx-2"
                          />
                        </th>
                        <th className="text-center">status</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {state.f_director.map((f) => {
                        return (
                          <tr key={f._id}>
                            <td className="text-center">{f.emp_id}</td>
                            <td className="text-center">
                              {Messages.Name(f.emp_id)}
                            </td>
                            <td className="text-center">{f.department}</td>
                            <td className="text-center">
                              <Link to={"/message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <button className="btn btn-success">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                ) : (
                                  <button className="btn">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                )}
                              </Link>
                            </td>
                            <td className="text-center">
                              <Link to={"message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faCircle}
                                      className="fa-1x text-success mx-2"
                                    />
                                    online
                                  </p>
                                ) : (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faCircle}
                                      className="fa-1x mx-2"
                                    />
                                    offline
                                  </p>
                                )}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ) : (
                <p></p>
              )}
              {/* commissioner */}
              {state.sector_leaders.length ? (
                <div className="col-lg-12">
                  <h4 className="contact-header text-center">sector leaders</h4>
                  <MDBTable bordered striped>
                    <MDBTableHead>
                      <tr>
                        <th className="text-center"># employee id</th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-1x text-danger mx-2"
                          />
                          name
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faObjectGroup}
                            className="fa-1x text-danger mx-2"
                          />
                          Department
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="fa-1x text-danger mx-2"
                          />
                        </th>
                        <th className="text-center">status</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {state.sector_leaders.map((f) => {
                        return (
                          <tr key={f._id}>
                            <td className="text-center">{f.emp_id}</td>
                            <td className="text-center">
                              {Messages.Name(f.emp_id)}
                            </td>
                            <td className="text-center">{f.department}</td>
                            <td className="text-center">
                              <Link to={"/message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <button className="btn btn-success">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                ) : (
                                  <button className="btn">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                )}
                              </Link>
                            </td>
                            <td className="text-center">
                              <Link to={"message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faCircle}
                                      className="fa-1x text-success mx-2"
                                    />
                                    online
                                  </p>
                                ) : (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faCircle}
                                      className="fa-1x mx-2"
                                    />
                                    offline
                                  </p>
                                )}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ) : (
                <p></p>
              )}
              {/*sector leaders  */}
              {state.commisioner.length ? (
                <div className="col-lg-12">
                  <h4 className="contact-header text-center">Commisioner</h4>
                  <MDBTable bordered striped>
                    <MDBTableHead>
                      <tr>
                        <th className="text-center"># employee id</th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-1x text-danger mx-2"
                          />
                          name
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faObjectGroup}
                            className="fa-1x text-danger mx-2"
                          />
                          Department
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="fa-1x text-danger mx-2"
                          />
                        </th>
                        <th className="text-center">status</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {state.commisioner.map((f) => {
                        return (
                          <tr key={f._id}>
                            <td className="text-center">{f.emp_id}</td>
                            <td className="text-center">
                              {Messages.Name(f.emp_id)}
                            </td>
                            <td className="text-center">{f.department}</td>
                            <td className="text-center">
                              <Link to={"/message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <button className="btn btn-success">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                ) : (
                                  <button className="btn">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                )}
                              </Link>
                            </td>
                            <td className="text-center">
                              <Link to={"message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faCircle}
                                      className="fa-1x text-success mx-2"
                                    />
                                    online
                                  </p>
                                ) : (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faCircle}
                                      className="fa-1x mx-2"
                                    />
                                    offline
                                  </p>
                                )}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ) : (
                <p></p>
              )}
              {/** */}
              {state.f_sector_leader.length ? (
                <div className="col-lg-12">
                  <h4 className="contact-header text-center">
                    Finance Sector leader
                  </h4>
                  <MDBTable bordered striped>
                    <MDBTableHead>
                      <tr>
                        <th className="text-center"># employee id</th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-1x text-danger mx-2"
                          />
                          name
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faObjectGroup}
                            className="fa-1x text-danger mx-2"
                          />
                          Department
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="fa-1x text-danger mx-2"
                          />
                        </th>
                        <th className="text-center">status</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {state.f_sector_leader.map((f) => {
                        return (
                          <tr key={f._id}>
                            <td className="text-center">{f.emp_id}</td>
                            <td className="text-center">
                              {Messages.Name(f.emp_id)}
                            </td>
                            <td className="text-center">{f.department}</td>
                            <td className="text-center">
                              <Link to={"message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <button className="btn btn-success">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                ) : (
                                  <button className="btn">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                )}
                              </Link>
                            </td>
                            <td className="text-center">
                              {Messages.isOnline(f.emp_id) ? (
                                <p>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    className="fa-1x text-success mx-2"
                                  />
                                  online
                                </p>
                              ) : (
                                <p>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    className="fa-1x mx-2"
                                  />
                                  offline
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ) : (
                <p></p>
              )}
              {state.directors.length ? (
                <div className="col-lg-12">
                  <h4 className="contact-header text-center">Directors</h4>
                  <MDBTable bordered striped>
                    <MDBTableHead>
                      <tr>
                        <th className="text-center"># employee id</th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-1x text-danger mx-2"
                          />
                          name
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faObjectGroup}
                            className="fa-1x text-danger mx-2"
                          />
                          Department
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="fa-1x text-danger mx-2"
                          />
                        </th>
                        <th className="text-center">status</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {state.directors.map((f) => {
                        return (
                          <tr key={f._id}>
                            <td className="text-center">{f.emp_id}</td>
                            <td className="text-center">
                              {Messages.Name(f.emp_id)}
                            </td>
                            <td className="text-center">{f.department}</td>
                            <td className="text-center">
                              <Link to={"message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <button className="btn btn-success">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                ) : (
                                  <button className="btn">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                )}
                              </Link>
                            </td>
                            <td className="text-center">
                              <Link to={"message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faCircle}
                                      className="fa-1x text-success mx-2"
                                    />
                                    online
                                  </p>
                                ) : (
                                  <p>
                                    <FontAwesomeIcon
                                      icon={faCircle}
                                      className="fa-1x mx-2"
                                    />
                                    offline
                                  </p>
                                )}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ) : (
                <p></p>
              )}
              {state.team_leaders.length ? (
                <div className="col-lg-12">
                  <h4 className="contact-header text-center">Team leaders</h4>
                  <MDBTable bordered striped>
                    <MDBTableHead>
                      <tr>
                        <th className="text-center"># employee id</th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-1x text-danger mx-2"
                          />
                          name
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faObjectGroup}
                            className="fa-1x text-danger mx-2"
                          />
                          Department
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="fa-1x text-danger mx-2"
                          />
                        </th>
                        <th className="text-center">status</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {state.team_leaders.map((f) => {
                        return (
                          <tr key={f._id}>
                            <td className="text-center">{f.emp_id}</td>
                            <td className="text-center">
                              {Messages.Name(f.emp_id)}
                            </td>
                            <td className="text-center">{f.department}</td>
                            <td className="text-center">
                              <Link to={"message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <button className="btn btn-success">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                ) : (
                                  <button className="btn">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                )}
                              </Link>
                            </td>
                            <td className="text-center">
                              {Messages.isOnline(f.emp_id) ? (
                                <p>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    className="fa-1x text-success mx-2"
                                  />
                                  online
                                </p>
                              ) : (
                                <p>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    className="fa-1x mx-2"
                                  />
                                  offline
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ) : (
                <p></p>
              )}
              {state.employees.length ? (
                <div className="col-lg-12">
                  <h4 className="contact-header text-center">Employees</h4>
                  <MDBTable bordered striped>
                    <MDBTableHead>
                      <tr>
                        <th className="text-center"># employee id</th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fa-1x text-danger mx-2"
                          />
                          name
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faObjectGroup}
                            className="fa-1x text-danger mx-2"
                          />
                          Department
                        </th>
                        <th className="text-center">
                          <FontAwesomeIcon
                            icon={faComment}
                            className="fa-1x text-danger mx-2"
                          />
                        </th>
                        <th className="text-center">status</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {state.employees.map((f) => {
                        return (
                          <tr key={f._id}>
                            <td className="text-center">{f.emp_id}</td>
                            <td className="text-center">
                              {Messages.Name(f.emp_id)}
                            </td>
                            <td className="text-center">{f.department}</td>
                            <td className="text-center">
                              <Link to={"message/" + f.emp_id}>
                                {Messages.isOnline(f.emp_id) ? (
                                  <button className="btn btn-success">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                ) : (
                                  <button className="btn">
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="fa-1x mx-2"
                                    />
                                    contact
                                  </button>
                                )}
                              </Link>
                            </td>
                            <td className="text-center">
                              {Messages.isOnline(f.emp_id) ? (
                                <p>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    className="fa-1x text-success mx-2"
                                  />
                                  online
                                </p>
                              ) : (
                                <p>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    className="fa-1x mx-2"
                                  />
                                  offline
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </MDBTableBody>
                  </MDBTable>
                </div>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        ) : (
          <div className="container mt-5">
            <div className="row">
              <div className="col-lg-12">
                <h2 className="text-center">No Employees registered</h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
