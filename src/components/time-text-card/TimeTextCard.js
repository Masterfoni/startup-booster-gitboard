import React, { Component } from "react";
import "./TimeTextCard.css";
import Loader from "../loader/Loader";
import DateTimeUtils from "../../helpers/date-time-utils";

class TimeTextCard extends Component {
  /**
   * @description Based on the time prop, render the total time in the following format:
   * XXdays XXhXXm
   * @return {String} The built text in the format described
   */
  buildTimeText = () => {
    let dayPart = "";

    const totalDaysHoursMinutes = DateTimeUtils.getTotalDaysHoursMinutes(
      this.props.time
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
  checkLoading = () => {
    return this.props.isLoading ? (
      <Loader />
    ) : (
      <div>{this.props.time ? this.buildTimeText() : "No data to display"}</div>
    );
  };

  render() {
    return (
      <div className="thin-shadow bg-white rounded">
        <div className="text-card-head">
          <span className="text-head">
            {this.props.titleText ? this.props.titleText : "No data to display"}
          </span>
        </div>
        <div className="text-card-body">{this.checkLoading()}</div>
      </div>
    );
  }
}

export default TimeTextCard;
