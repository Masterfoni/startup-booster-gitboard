import React, { useContext } from "react";
import "./TimeTextCard.css";
import Loader from "../loader/Loader";
import DateTimeUtils from "../../helpers/date-time-utils";
import { LoadingContext } from "../../contexts/LoadingContext";

export const TimeTextCard = ({time, titleText}) => {

  const isLoading = useContext(LoadingContext);

  /**
   * @description Based on the time prop, render the total time in the following format:
   * XXdays XXhXXm
   * @return {String} The built text in the format described
   */
  const buildTimeText = () => {
    let dayPart = "";

    const totalDaysHoursMinutes = DateTimeUtils.getTotalDaysHoursMinutes(
      time
    );

    if (totalDaysHoursMinutes.days > 0) {
      dayPart =
        totalDaysHoursMinutes.days +
        (totalDaysHoursMinutes.days === 1 ? "day " : "days ");
    }

    return (
      dayPart +
      totalDaysHoursMinutes.hours +
      "h" +
      totalDaysHoursMinutes.minutes +
      "m"
    );
  };

  /**
   * @description Checks wether the component is loading or not and renders the loader component or the text itself
   * @return {Component} Loader component or the text that will be rendered on the body of the card
   */
  const checkLoading = () => {
    return isLoading ? (
      <Loader />
    ) : (
      <div>{time ? buildTimeText() : "No data to display"}</div>
    );
  };

  return (
    <div className="thin-shadow bg-white rounded">
      <div className="text-card-head">
        <span className="text-head">
          {titleText ? titleText : "No data to display"}
        </span>
      </div>
      <div className="text-card-body">{checkLoading()}</div>
    </div>
  );
}

export default TimeTextCard;
