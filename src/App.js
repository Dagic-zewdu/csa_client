import React, { useEffect, useReducer, useState } from "react";
import "./css/Main.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Admin from "./components/system Admin/admin";
import Employee from "./components/system Admin/employee/employee";
import { StoreContext } from "./components/contexts/contexts";
import { empState, employeeReducer } from "./store/Reducers/employeeReducers";
import DepartmentDashboard from "./components/system Admin/Department/Dashboard";
import {
  departmentReducer,
  depState,
} from "./store/Reducers/departmentReducer";
import PlaceDashbord from "./components/system Admin/place/placeDashbord";
import { placeState, placeReducer } from "./store/Reducers/placReducers";
import Signup from "./components/users/signup";
import Login from "./components/users/Login";
import { UserReducer, UserState } from "./store/Reducers/usersReducer";
import Users from "./components/system Admin/user/Users";
import FieldDashboard from "./components/system Admin/FieldAllowance/FieldDashboard";
import {
  fieldAllowanceReducer,
  fieldAllowanceState,
} from "./store/Reducers/FieldAllowance";
import ScripTag from "react-script-tag";
import CreateConfigaration from "./components/system Admin/configuration/CreateConfigaration";
import { configReducer, configState } from "./store/Reducers/configReducer";
import Configure from "./components/system Admin/configuration/Configure";
import CreateCompany from "./components/system Admin/company/CreateCompany";
import { CompanyReducer, companyState } from "./store/Reducers/companyReducer";
import Company from "./components/system Admin/company/Company";
import AdminSignup from "./components/users/AdminSignup";
import Home from "./components/routes/Home";
import Letter from "./components/routes/Letter";
import { lettersReducer, letterState } from "./store/Reducers/lettersReducer";
import Allowance from "./components/routes/Allowance";
import {
  allowanceReducer,
  allowanceState,
} from "./store/Reducers/allowanceReducer";
import ClimateDashboard from "./components/system Admin/place/ClimatePlaces/ClimateDashboard";
import {
  climatePlacesReducer,
  climatePlaceState,
} from "./store/Reducers/climatePlacesReducer";
import Deduction from "./components/routes/Deduction";
import {
  deductionReducer,
  deductionState,
} from "./store/Reducers/deductionReducer";
import Test from "./components/test/Test";
import DoDeduction from "./components/Deduction/Finance_Employee/DeductionCalculation.js/DoDeduction";
import Edit from "./components/Deduction/Finance_Employee/DeductionCalculation.js/Edit";
import ContactEmployee from "./components/routes/ContactEmployee";
import ChatRoom from "./components/routes/ChatRoom";
import { messageReducer, messageState } from "./store/Reducers/MessageReducer";
import { connReducer, connState } from "./store/Reducers/connectionReducer";
import OutBoxLetters from "./components/routes/OutBoxLetters";
import InBoxLetters from "./components/routes/InBoxLetters";
import Reports from "./components/routes/Reports";

const App = () => {
  const [typing, setTyping] = useState(""); //chat typing
  const [Ltyping, setLTyping] = useState(""); //letter creating typing
  const [socket, setSocket] = useState("");
  const [employees, dispatchEmployees] = useReducer(employeeReducer, empState);
  const [department, dispatchDepartment] = useReducer(
    departmentReducer,
    depState
  );
  const [place, dispatchPlaces] = useReducer(placeReducer, placeState);
  const [users, dispatchUsers] = useReducer(UserReducer, UserState);
  const [fieldEmployees, dispatchFieldEmplooyees] = useReducer(
    fieldAllowanceReducer,
    fieldAllowanceState
  );
  const [config, dispatchConfig] = useReducer(configReducer, configState);
  const [company, dispatchCompany] = useReducer(CompanyReducer, companyState);
  const [letters, dispatchLetters] = useReducer(lettersReducer, letterState);
  const [allowances, dispatchAllowances] = useReducer(
    allowanceReducer,
    allowanceState
  );
  const [climatePlaces, dispatchClimatePlaces] = useReducer(
    climatePlacesReducer,
    climatePlaceState
  );
  const [deductions, dispatchDeductions] = useReducer(
    deductionReducer,
    deductionState
  );
  const [messages, dispatchMessages] = useReducer(messageReducer, messageState);
  const [connections, dispatchConnections] = useReducer(connReducer, connState);
  return (
    <StoreContext.Provider
      value={{
        socket,
        setSocket,
        messages,
        dispatchMessages,
        typing,
        setTyping,
        Ltyping,
        setLTyping, //user interaction when typing
        connections,
        dispatchConnections,
        allowances,
        dispatchAllowances,
        employees,
        dispatchEmployees,
        department,
        dispatchDepartment,
        place,
        dispatchPlaces,
        users,
        dispatchUsers,
        fieldEmployees,
        dispatchFieldEmplooyees,
        config,
        dispatchConfig,
        company,
        dispatchCompany,
        letters,
        dispatchLetters,
        climatePlaces,
        dispatchClimatePlaces,
        deductions,
        dispatchDeductions,
      }}
    >
      <ScripTag
        isHydrating={true}
        type="text/javascript"
        src="./css/assets/scripts/main.js"
      />
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/message/:id">
            <ChatRoom />
          </Route>
          <Route path="/message">
            <Letter />
          </Route>
          <Route path="/allowance">
            <Allowance />
          </Route>
          <Route path="/editDeduction/:id">
            <Edit />
          </Route>
          <Route path="/deduction/:id">
            <DoDeduction />{" "}
          </Route>
          <Route path="/deduction">
            <Deduction />
          </Route>
          <Route path="/contact">
            <ContactEmployee />
          </Route>
          <Route path="/outbox">
            <OutBoxLetters />
          </Route>
          <Route path="/inbox">
            <InBoxLetters />
          </Route>
          <Route path="/reports">
            <Reports />
          </Route>
          {/**user routes */}
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          {/**admin routes */}
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/fieldAllowance">
            <FieldDashboard />
          </Route>
          <Route path="/employee">
            <Employee />
          </Route>
          <Route path="/company">
            <Company />
          </Route>
          <Route path="/places">
            <PlaceDashbord />
          </Route>
          <Route path="/department">
            <DepartmentDashboard />
          </Route>
          <Route path="/configuration">
            <Configure />
          </Route>
          <Route path="/climate_places">
            <ClimateDashboard />
          </Route>
          {/**system configuration route */}
          <Route path="/adminSignUp">
            <AdminSignup />
          </Route>
          <Route path="/createCompany">
            <CreateCompany />
          </Route>
          <Route path="/createConfiguration">
            <CreateConfigaration />
          </Route>
          {/**test routes */}
          <Route path="/test">
            <Test />
          </Route>
        </Switch>
      </BrowserRouter>
    </StoreContext.Provider>
  );
};

export default App;
