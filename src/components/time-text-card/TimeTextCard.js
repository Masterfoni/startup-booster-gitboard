import React, { Component } from "react";
import "./TimeTextCard.css";
import Loader from "../loader/Loader";
import DateTimeUtils from "../../utils/date-time-utils";

class TimeTextCard extends Component {
  buildTimeText() {
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
  }

  checkLoading() {
    return this.props.isLoading ? (
      <Loader />
    ) : (
      <div>{this.props.time ? this.buildTimeText() : "No data to display"}</div>
    );
  }

  render() {
    return (
      <div className="thin-shadow bg-white">
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
