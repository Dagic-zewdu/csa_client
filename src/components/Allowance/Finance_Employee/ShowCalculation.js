import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../contexts/contexts";
import { PlaceClass } from "../../../controllers/Places";
import { FieldAllowance } from "../../../controllers/FieldAllowance";
import { Calculation } from "../../../controllers/Calculation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { encryptObject } from "../../auth/encrypt";
import { userInfo } from "../../users/userInfo";
import { host } from "../../config/config";
import axios from "axios";
import { climateClass } from "../../../controllers/climatePlaces";

const ShowCalculation = (props) => {
  const { allowance, tl, director } = props;
  const { seen: tlApproveSeen } = allowance.f_approve_tm;
  const { seen: drApproveSeen } = allowance.f_approve_dr;
  const {
    allowances,
    users,
    employees,
    config,
    place,
    fieldEmployees,
    climatePlaces,
  } = useContext(StoreContext);
  /**calculation class */
  const { _id: id, creater: emp_id } = allowance;
  const calculation = new Calculation(
    place.state,
    allowances.state,
    employees.state,
    users.state,
    config.state[0],
    climatePlaces.state
  );

  const Places = new PlaceClass(place.state);
  const fa = new FieldAllowance(fieldEmployees.state);
  /**climate  */
  const climate = new climateClass(climatePlaces.state);
  const date = new Date(allowance.f_pending_emp.calculated_date);
  /**set seen for approval manager */
  const approveTl = encryptObject({
    ...userInfo(),
    _id: allowance._id,
    f_approve_tm: {
      ...allowance.f_approve_tm,
      seen: true,
      seen_date: Date.now(),
    },
  });
  /**set seen for approval director */
  const approveDr = encryptObject({
    ...userInfo(),
    _id: allowance._id,
    f_approve_dr: {
      seen: true,
      seen_date: Date.now(),
    },
  });
  useEffect(() => {
    const saveSeen = async (data) => {
      const req = await axios.put(host + "/allowances", { data });
    };
    /**set seen for approval manager */
    if (tl && !tlApproveSeen) {
      saveSeen(approveTl);
    }
    /**set seen for director */
    if (!drApproveSeen && director) {
      saveSeen(approveDr);
    }
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <h3 className="text-center">Employee Info</h3>
            <h5 className="text-center font-weight-bold">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="mx-2 text-light"
              />
              {calculation.Name(allowance.creater)}
            </h5>
            <h5 className="text-center font-weight-bold">
              salary-{calculation.Salary(allowance.creater)}
            </h5>
            <h5 className="text-center font-weight-bold">
              Employee is official-
              {calculation.isOfficial(emp_id) ? "yes" : "No"}
            </h5>
            {fa.faCheck(emp_id) ? (
              <h5 className="text-center font-weight-bold">
                Employee is project Allowance -yes
              </h5>
            ) : (
              <h5 className="text-center font-weight-bold">
                Employee is project Allowance -No
              </h5>
            )}
          </div>
          <div className="card mt-2">
            <h3 className="text-center font-weight-bold">Calculated by</h3>
            <p className="text-center font-italic font-weight-bold">
              by- {calculation.Name(allowance.f_pending_emp.emp_id)}
            </p>
            <p className="text-center font-italic font-weight-bold">
              calculated day- {date.toUTCString()}
            </p>
          </div>
        </div>
        <div className="col-lg-6">
          {allowance.type === "living" ? (
            <div className="text-center font-weight-bold card">
              Destination place_name:
              {Places.findPlace(allowance.place_id)
                ? Places.findPlace(allowance.place_id).name
                : ""}{" "}
              <br />
              Destination place region:
              {Places.findPlace(allowance.place_id)
                ? Places.findPlace(allowance.place_id).region
                : allowance.region}{" "}
              <br />
              Destination place type:{allowance.place_type} <br />
              climate general place name:
              {climate.findClimatePlace(allowance.climate_id)
                ? climate.findClimatePlace(allowance.climate_id).general_name
                : ""}{" "}
              <br />
              climate place name:
              {climate.findClimatePlace(allowance.climate_id)
                ? climate.findClimatePlace(allowance.climate_id).name
                : ""}{" "}
              <br />
              climate place level:
              {climate.findClimatePlace(allowance.climate_id)
                ? climate.findClimatePlace(allowance.climate_id).level
                : ""}{" "}
              <br />
              Day allowance scale:{allowance.scale} <br />
              Duration days:{calculation.durationDate(id)} <br />
              living allowance : {allowance.living_allowance} <br />
              climate Allowance:{allowance.climate_allowance} <br />
              petrol and oil amount:{allowance.petrol_allowance} <br />
              reserve amount:{allowance.reserve_amount} <br />
              <hr />
              <h5 className="font-weight-bold">
                Totall:{allowance.totall_amount}
              </h5>
              <hr />
            </div>
          ) : allowance.type === "day" ? (
            <div className="card text-center font-weight-bold">
              <hr />
              Destination place_name:
              {Places.findPlace(allowance.place_id)
                ? Places.findPlace(allowance.place_id).name
                : ""}{" "}
              <br />
              Destination place region:
              {Places.findPlace(allowance.place_id)
                ? Places.findPlace(allowance.place_id).region
                : allowance.region}{" "}
              <br />
              Destination place type:{allowance.place_type} <br />
              climate general place name:
              {climate.findClimatePlace(allowance.climate_id)
                ? climate.findClimatePlace(allowance.climate_id).general_name
                : ""}{" "}
              <br />
              climate place name:
              {climate.findClimatePlace(allowance.climate_id)
                ? climate.findClimatePlace(allowance.climate_id).name
                : ""}{" "}
              <br />
              climate place level:
              {climate.findClimatePlace(allowance.climate_id)
                ? climate.findClimatePlace(allowance.climate_id).level
                : ""}{" "}
              <br />
              Day allowance scale:{allowance.scale} <br />
              Breakfast amount ={allowance.breakfast} <br />
              Lunch amount={allowance.lunch} <br />
              Dinner amount={allowance.dinner} <br />
              Bed amount={allowance.bed} <br />
              climate allowance={allowance.climate_allowance} <br />
              petrol and oil amount={allowance.petrol_allowance} <br />
              reserve amount={allowance.reserve_amount} <br />
              Totall Day allowance:{allowance.day_allowance}
              <hr />
              <h5 className="font-weight-bold">
                Totall:{allowance.totall_amount}
              </h5>
            </div>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowCalculation;
