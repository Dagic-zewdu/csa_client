import React, { useState, useContext } from "react";
import { LayoutContext, StoreContext } from "../contexts/contexts";
import Navbar from "../layout/Navbar/Navbar";
import SideNav from "../layout/SideNav/SideNav";
import { SpinnerLoading, DotLoading } from "../layout/Loading";
import { files_url } from "../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Home = () => {
  const [state, setState] = useState({
    collapse: "",
  });
  const { company } = useContext(StoreContext);
  const { state: COMPANY, loading, error } = company;
  const Company = COMPANY[0];
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
              {/* */}
              <div className="container mt-3">
                <div className="row">
                  {loading ? (
                    <div className="col-lg-12">
                      <div className="main-card mb-3 min-height card">
                        <h3 className="text-center">Loading...</h3>
                        <DotLoading className="mt-5" />
                      </div>
                    </div>
                  ) : error ? (
                    <div className="col-lg-12 ">
                      <div className="main-card mb-3 min-height card">
                        <h3 className="mt-5 text-center text-danger">
                          <FontAwesomeIcon
                            icon={faWindowClose}
                            className="fa-2x"
                          />
                          <br />
                          ...oops loading failed the server is down or not
                          active contact admin
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="col-lg-12">
                      <div className="main-card mb-3 card">
                        <div className="card-body">
                          <h2 className="text-center">{Company.name}</h2>
                          <div className="row">
                            <div className="col-lg-6 my-auto text-center">
                              <p className="text-center text-info display-2 font-weight-bold mx-auto">
                                CSA
                                <FontAwesomeIcon icon={faCalculator} />
                              </p>
                              <h5 className="text-center text-uppercase mx-auto font-weight-bold">
                                civil servant Allowance calculator
                              </h5>
                            </div>
                            <div className="col-lg-6 my-auto text-center">
                              <p className="text-center text-warning display-1 font-weight-bold mx-auto">
                                [M]
                              </p>
                              <p className="text-center text-secondary display-4 font-weight-bold mx-auto">
                                METRIX
                              </p>
                              <p className="text-center text-secondary display-5 font-weight-bold mx-auto">
                                TECHNOLOGIES
                              </p>
                            </div>
                            <div className="col-lg-12 mt-5">
                              <h3 className="text-center text-uppercase">
                                civil servant allowance calculator (version 1.0)
                              </h3>
                              <h5 className="text-center font-weight-bold mt-4">
                                Introduction
                              </h5>
                              <p className="text-center lead">
                                This allowance calculator developed and designed
                                by Metrix technologies helps customers for easy
                                allowance calculations,letter and tems of
                                referecence (tor) managment. It also have an
                                easy integration to do complicated deductions
                                with improved reporting and and stastical method
                              </p>
                              <h5 className="text-center font-weight-bold">
                                Users
                              </h5>
                              <p className="text-center lead">
                                The system is integerated with identifying users
                                with their role and protect confidentiallity. it
                                will not promote unauthorized usage of data
                              </p>
                              <h5 className="text-center font-weight-bold">
                                Calculations
                              </h5>
                              <p className="text-center lead">
                                The system is designed to calculate allowance
                                and other terms from the system admin. The
                                system admin is responsible for entering
                                relevant data declared from House of people
                                representative and prime minister office.
                              </p>
                              <h5 className="text-center font-weight-bold">
                                Security
                              </h5>
                              <p className="text-center lead">
                                it is secured by jwt authentication and AES
                                encryption with encrypted tokens. The two
                                technologies are far more secured and can stop
                                any brutal force attacks rised from any hackers
                                . But the user must be responsible for his
                                account when you finish doing any tasks please
                                logout from your account and don't let another
                                user to login to your account
                              </p>
                              <h5 className="text-center font-weight-bold">
                                Technolgy
                              </h5>
                              <p className="text-center lead">
                                Our developing team use React.js for front end
                                and Node.js for server development .React is
                                very fast reliable make development on client
                                side peace of cake. Node.js is powerful non
                                blocking server side programming it commits much
                                faster for enterprise application .The two
                                languages are the leading technologies on github
                                website (developers repository store)
                              </p>
                              <h5 className="text-center font-weight-bold">
                                Gratitude
                              </h5>
                              <p className="text-center lead">
                                we give huge thanks for developers Dagmawi zewdu
                                and worash abocher they have been domiant forces
                                from system planning to finall
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-center float-right ">
                        <Link to="/feedBack">
                          please send any feedbacks we will make an improvment
                          for next version
                        </Link>
                        <br />
                        <Link to="/briefs">
                          you can see system support and briefs for any miss
                          understanding <br />
                        </Link>
                        Designed and developed by Metrix technologies
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutContext.Provider>
    </div>
  );
};

export default Home;
