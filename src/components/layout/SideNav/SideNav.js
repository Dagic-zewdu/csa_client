import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LayoutContext, StoreContext } from "../../contexts/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faStamp,
  faCalculator,
  faMapMarker,
  faChartBar,
  faInfo,
  faUsers,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import DepartmentFetch from "../../fetchers/departmentFetch";
import PlaceFetchers from "../../fetchers/placeFetchers";
import EmployeeFetcher from "../../fetchers/employeeFetchers";
import UsersFetcher from "../../fetchers/UsersFetcher";
import FieldAllowanceFetcher from "../../fetchers/FieldAllowanceFetcher";
import ConfigFetch from "../../fetchers/configFetcher";
import CompanyFetcher from "../../fetchers/CompanyFetcher";
import LettersFetcher from "../../fetchers/LettersFetcher";
import AllowanceFetchers from "../../fetchers/AllowanceFetchers";
import ClimatePlacesFetcher from "../../fetchers/ClimatePlacesFetcher";
import DeductionFetcher from "../../fetchers/DeductionFetcher";
import { webSocket } from "../../../socket";
import { Donothing } from "../../../controllers/saveProcess";
import MessageFetchers from "../../fetchers/MessageFetchers";
import { UsersClass } from "../../../controllers/Users";
const SideNav = () => {
  const { setSocket, users, employees, socket } = useContext(StoreContext);
  const setToggler = useContext(LayoutContext);
  const { sidetheme } = setToggler.uiContents;
  const User = new UsersClass(users.state, employees.state);
  const isTL = User.isFinanceTeamLeader();
  const isFe = User.isFinanceEmployee();
  const isFd = User.isFinanceDirector();
  return (
    <div className={"app-sidebar sidebar-shadow " + sidetheme}>
      <div className="app-header__logo">
        <AllowanceFetchers />
        <EmployeeFetcher />
        <PlaceFetchers />
        <FieldAllowanceFetcher />
        <ConfigFetch />
        <CompanyFetcher />
        <DepartmentFetch />
        <UsersFetcher />
        <ClimatePlacesFetcher />
        <DeductionFetcher />
        <MessageFetchers />
        <div className="header__pane ml-auto">
          <div>
            <button
              type="button"
              className="hamburger close-sidebar-btn hamburger--elastic"
              data-classname="closed-sidebar"
            >
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="app-header__mobile-menu">
        <div>
          <button
            type="button"
            className="hamburger hamburger--elastic mobile-toggle-nav"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </div>
      <div className="app-header__menu">
        <span>
          <button
            type="button"
            className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav"
          >
            <span className="btn-icon-wrapper">
              <i className="fa fa-ellipsis-v fa-w-6"></i>
            </span>
          </button>
        </span>
      </div>{" "}
      <div className="scrollbar-sidebar">
        <div className="app-sidebar__inner">
          <ul className="vertical-nav-menu">
            <li className="app-sidebar__heading">Allowance System</li>
            <li>
              <NavLink to="/" className="mm-active">
                <FontAwesomeIcon
                  icon={faStamp}
                  className="metismenu-icon pe-7s-diamond fa-2x text-warning"
                />
              </NavLink>
            </li>

            <li className="app-sidebar__heading">
              <FontAwesomeIcon
                icon={faCalculator}
                className="metismenu-icon pe-7s-diamond fa-2x text-info mx-2"
              />
              calculate
            </li>

            <li>
              <NavLink to="/allowance">
                <i className="metismenu-icon pe-7s-display2"></i>
                <p className="font-weight-bold">Allowances</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/deduction">
                <i className="metismenu-icon pe-7s-display2"></i>
                <p className="font-weight-bold">Deductions</p>
              </NavLink>
            </li>

            <li className="app-sidebar__heading">
              <FontAwesomeIcon
                icon={faPaperclip}
                className="metismenu-icon pe-7s-diamond fa-2x text-info mx-2"
              />
              Document
            </li>

            <li>
              <NavLink to="/inbox">
                <i className="metismenu-icon pe-7s-display2"></i>
                <p className="font-weight-bold">Letter</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/message">
                <i className="metismenu-icon pe-7s-display2"></i>
                <p className="font-weight-bold">message</p>
              </NavLink>
            </li>
            <li className="app-sidebar__heading">
              <FontAwesomeIcon
                icon={faUsers}
                className="metismenu-icon pe-7s-diamond fa-2x text-info mx-2"
              />
              Employess
            </li>
            <li>
              <NavLink to="/contact">
                <i className="metismenu-icon pe-7s-display2"></i>
                <p className="font-weight-bold">contact</p>
              </NavLink>
            </li>
            {isTL || isFe || isFd ? (
              <li className="app-sidebar__heading">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="metismenu-icon pe-7s-diamond fa-2x text-info mx-2"
                />
                Summary
              </li>
            ) : (
              <p></p>
            )}
            {isTL || isFe || isFd ? (
              <li>
                <NavLink to="/reports">
                  <i className="metismenu-icon pe-7s-display2"></i>
                  <p className="font-weight-bold">Reports</p>
                </NavLink>
              </li>
            ) : (
              <p></p>
            )}

            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
