import React, { useEffect, useState, useContext } from "react";
import "./MonthSummary.css";
import Chart from "chart.js";
import Loader from "../loader/Loader";
import moment from "moment";
import { LoadingContext } from "../../contexts/LoadingContext";

export const MonthSummary = ({monthSummaryData, titleText}) => {
  const [pullRequestMode, setPullRequestMode] = useState(true);

  const {loading} = useContext(LoadingContext);

  useEffect(() => {
    if (monthSummaryData) {
      var monthSummaryStatistics = getMonthSummaryStatistics();
      buildChart(monthSummaryStatistics);
    }
  });

  /**
   * @description Checks if the selected statistics to show are about issues or pull requests
   * and build a specific chart for each one
   * @param  {Object} monthSummaryStatistics       Object containing different lists of pull requests
   * grouped by state, and lists of issues grouped by state
   */
  const buildChart = monthSummaryStatistics => {
    const chartElement = document.getElementById("defLineChart");

    if (chartElement) {
      let context = chartElement.getContext("2d");

      const monthSummaryChart = new Chart(
        context,
        pullRequestMode
          ? getPullRequestModeOptions(monthSummaryStatistics)
          : getIssueModeOptions(monthSummaryStatistics)
      );

      document.getElementById(
        "chartjsLegend"
      ).innerHTML = monthSummaryChart.generateLegend();
    }
  };

  /**
   * @description Based on the props passed to this componnet, groups statistics of each day
   * over a period of a month (30 days ago until now)
   * @return {Array}  Array of objects representing days contaning pull requests and issue statistics
   */
  const getMonthSummaryStatistics = () => {
    const mergedPullRequestList = monthSummaryData
      .mergedPullRequestList;
    const openPullRequestList = monthSummaryData.openPullRequestList;
    const closedPullRequestList = monthSummaryData
      .closedPullRequestList;
    const openIssueList = monthSummaryData.openIssueList;
    const closedIssueList = monthSummaryData.closedIssueList;

    var monthSummaryStatistics = [];

    for (let i = 30; i >= 0; i--) {
      monthSummaryStatistics.push({
        day: moment()
          .subtract(i, "days")
          .format("DD MMM"),
        totalPullRequestsMerged: 0,
        totalPullRequestsOpen: 0,
        totalPullRequestsClosed: 0,
        totalIssuesOpened: 0,
        totalIssuesClosed: 0
      });
    }

    monthSummaryStatistics.forEach(dayData => {
      dayData.totalIssuesClosed = closedIssueList.filter(
        issue =>
          dayData.day === moment(new Date(issue.closedAt)).format("DD MMM")
      ).length;

      dayData.totalIssuesOpened = openIssueList.filter(
        issue =>
          dayData.day === moment(new Date(issue.createdAt)).format("DD MMM")
      ).length;

      dayData.totalPullRequestsMerged = mergedPullRequestList.filter(
        pullRequest =>
          dayData.day ===
          moment(new Date(pullRequest.mergedAt)).format("DD MMM")
      ).length;

      dayData.totalPullRequestsOpen = openPullRequestList.filter(
        pullRequest =>
          dayData.day ===
          moment(new Date(pullRequest.createdAt)).format("DD MMM")
      ).length;

      dayData.totalPullRequestsClosed = closedPullRequestList.filter(
        pullRequest =>
          dayData.day ===
          moment(new Date(pullRequest.closedAt)).format("DD MMM")
      ).length;
    });

    return monthSummaryStatistics;
  };

  /**
   * @description Get default line chart configuraion for the issues chart
   * @param {Array} monthSummaryStatistics Array of days with statistics about issues and pull requests
   * @return {Object} Options object that will configure style, tooltip and label functions of the chart
   */
  const getIssueModeOptions = monthSummaryStatistics => {
    return {
      type: "line",
      data: {
        labels: monthSummaryStatistics.map(dayInfo => dayInfo.day),
        datasets: [
          {
            data: monthSummaryStatistics.map(
              dayInfo => dayInfo.totalIssuesOpened
            ),
            label: "Opened",
            borderColor: "green",
            pointBackgroundColor: "green",
            fill: false
          },
          {
            data: monthSummaryStatistics.map(
              dayInfo => dayInfo.totalIssuesClosed
            ),
            label: "Closed",
            borderColor: "red",
            pointBackgroundColor: "red",
            fill: false
          }
        ]
      },
      options: {
        tooltips: {
          bodySpacing: 10,
          bodyFontSize: 14,
          bodyFontColor: "rgba(0, 0, 0, 1)",
          titleFontSize: 14,
          titleFontColor: "rgba(0, 0, 0, 1)",
          titleFontStyle: "normal",
          titleMarginBottom: 15,
          backgroundColor: "rgba(255, 255, 255, 1)",
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 5,
          shadowColor: "rgba(0, 0, 0, 0.3)",
          callbacks: {
            label: function(tooltipItem, data) {
              let builtLabel = "";

              if (tooltipItem.datasetIndex === 0) {
                builtLabel += "Opened    ";
              } else if (tooltipItem.datasetIndex === 1) {
                builtLabel += "Closed    ";
              }

              return builtLabel + tooltipItem.value;
            },
            title: function() {
              return "Issues";
            }
          }
        },
        legend: {
          display: false
        },
        elements: {
          line: {
            tension: 0
          }
        }
      }
    };
  };

  /**
   * @description Get default line chart configuraion for the pull request chart
   * @param {Array} monthSummaryStatistics Array of days with statistics about issues and pull requests
   * @return {Object} Options object that will configure style, tooltip and label functions of the chart
   */
  const getPullRequestModeOptions = monthSummaryStatistics => {
    return {
      type: "line",
      data: {
        labels: monthSummaryStatistics.map(dayInfo => dayInfo.day),
        datasets: [
          {
            data: monthSummaryStatistics.map(
              dayInfo => dayInfo.totalPullRequestsOpen
            ),
            label: "Opened",
            borderColor: "green",
            pointBackgroundColor: "green",
            fill: false
          },
          {
            data: monthSummaryStatistics.map(
              dayInfo => dayInfo.totalPullRequestsClosed
            ),
            label: "Closed",
            borderColor: "red",
            pointBackgroundColor: "red",
            fill: false
          },
          {
            data: monthSummaryStatistics.map(
              dayInfo => dayInfo.totalPullRequestsMerged
            ),
            label: "Merged",
            borderColor: "purple",
            pointBackgroundColor: "purple",
            fill: false
          }
        ]
      },
      options: {
        tooltips: {
          bodySpacing: 10,
          bodyFontSize: 14,
          bodyFontColor: "rgba(0, 0, 0, 1)",
          titleFontSize: 14,
          titleFontColor: "rgba(0, 0, 0, 1)",
          titleFontStyle: "normal",
          titleMarginBottom: 15,
          backgroundColor: "rgba(255, 255, 255, 1)",
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 5,
          shadowColor: "rgba(0, 0, 0, 0.3)",
          callbacks: {
            label: function(tooltipItem) {
              let builtLabel = "";

              if (tooltipItem.datasetIndex === 0) {
                builtLabel += "Opened    ";
              } else if (tooltipItem.datasetIndex === 1) {
                builtLabel += "Closed    ";
              } else if (tooltipItem.datasetIndex === 2) {
                builtLabel += "Merged    ";
              }

              return builtLabel + tooltipItem.value;
            },
            title: function() {
              return "Pull Requests";
            }
          }
        },
        legend: {
          display: false
        },
        elements: {
          line: {
            tension: 0
          }
        }
      }
    };
  };

  /**
   * @description Count the total number of pull requests across all states
   * @return {Number}     Total number of pull requests
   */
  const getTotalPullRequestsCount = () => {
    return getMonthSummaryStatistics().reduce(
      (previousTotal, dayInfo) =>
        previousTotal +
        dayInfo.totalPullRequestsMerged +
        dayInfo.totalPullRequestsClosed +
        dayInfo.totalPullRequestsOpen,
      0
    );
  };

  /**
   * @description Count the total number of issues across all states
   * @return {Number}     Total number of issues
   */
  const getTotalIssuesCount = () => {
    return getMonthSummaryStatistics().reduce(
      (previousTotal, dayInfo) =>
        previousTotal + dayInfo.totalIssuesClosed + dayInfo.totalIssuesOpened,
      0
    );
  };

  /**
   * @description Checks wether the component is loading or not and renders the loader component or the chart content
   * @return {Component} Loader component or the chart and tabs will be rendered on the body of the card
   */
  const checkLoading = () => {
    return loading ? (
      <Loader />
    ) : (
      <>
        {monthSummaryData ? (
          <>
            <div className="row mb-4 text-left pl-4">
              <div
                onClick={() => setPullRequestMode(true)}
                className={
                  "col-md-2 col-sm-4 selector " +
                  (pullRequestMode ? "active" : "inactive")
                }
              >
                <span className="selector-title">Pull Requests</span>
                <br />
                <span className="selector-quantity">
                  {getTotalPullRequestsCount()}
                </span>
              </div>
              <div
                onClick={() => setPullRequestMode(false)}
                className={
                  "col-md-2 col-sm-4 selector " +
                  (pullRequestMode ? "inactive" : "active")
                }
              >
                <span className="selector-title">Issues</span>
                <br />
                <span className="selector-quantity">
                  {getTotalIssuesCount()}
                </span>
              </div>
            </div>
          </>
        ) : null}

        <div className="row pl-4">
          <div className="col-12">
            {monthSummaryData ? (
              <>
                <canvas id="defLineChart" />
                <div id="chartjsLegend" className="chartjsLegend table" />
              </>
            ) : (
              <div className="no-data">No data to display</div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="thin-shadow bg-white rounded">
      <div className="line-chart-card-head">
        {titleText ? titleText : "No data to display"}
      </div>
      <div className="line-chart-card-body">{checkLoading()}</div>
    </div>
  );
}

export default MonthSummary;
