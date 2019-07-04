import React, { Component } from "react";
import "./MonthSummary.css";
import Chart from "chart.js";
import Loader from "../loader/Loader";
import moment from "moment";

class MonthSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pullRequestMode: true,
      monthSummaryData: null
    };
  }

  buildChart(monthSummaryStatistics) {
    const chartElement = document.getElementById("defLineChart");

    if (chartElement) {
      let context = chartElement.getContext("2d");

      new Chart(
        context,
        this.state.pullRequestMode
          ? this.getPullRequestModeOptions(monthSummaryStatistics)
          : this.getIssueModeOptions(monthSummaryStatistics)
      );
    }
  }

  getMonthSummaryStatistics() {
    const mergedPullRequestList = this.props.monthSummaryData
      .mergedPullRequestList;
    const openPullRequestList = this.props.monthSummaryData.openPullRequestList;
    const closedPullRequestList = this.props.monthSummaryData
      .closedPullRequestList;
    const openIssueList = this.props.monthSummaryData.openIssueList;
    const closedIssueList = this.props.monthSummaryData.closedIssueList;

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
  }

  getIssueModeOptions(monthSummaryStatistics) {
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
          labels: {
            usePointStyle: true,
            fontSize: 14,
            padding: 30
          },
          position: "bottom"
        },
        elements: {
          line: {
            tension: 0
          }
        }
      }
    };
  }

  getPullRequestModeOptions(monthSummaryStatistics) {
    return {
      type: "line",
      data: {
        labels: monthSummaryStatistics.map(dayInfo => dayInfo.day),
        datasets: [
          {
            data: monthSummaryStatistics.map(
              dayInfo => dayInfo.totalPullRequestsMerged
            ),
            label: "Merged",
            borderColor: "purple",
            pointBackgroundColor: "purple",
            fill: false
          },
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
                builtLabel += "Merged    ";
              } else if (tooltipItem.datasetIndex === 1) {
                builtLabel += "Opened    ";
              } else if (tooltipItem.datasetIndex === 2) {
                builtLabel += "Closed    ";
              }

              return builtLabel + tooltipItem.value;
            },
            title: function() {
              return "Pull Requests";
            }
          }
        },
        legend: {
          labels: {
            usePointStyle: true,
            fontSize: 14,
            padding: 30
          },
          position: "bottom"
        },
        elements: {
          line: {
            tension: 0
          }
        }
      }
    };
  }

  changeTab(isPullRequest) {
    this.setState({
      pullRequestMode: isPullRequest
    });
  }

  getTotalPullRequestsCount() {
    return this.getMonthSummaryStatistics().reduce(
      (previousTotal, dayInfo) =>
        previousTotal +
        dayInfo.totalPullRequestsMerged +
        dayInfo.totalPullRequestsClosed +
        dayInfo.totalPullRequestsOpen,
      0
    );
  }

  checkLoading() {
    return this.props.isLoading ? (
      <Loader />
    ) : (
      <>
        {this.props.monthSummaryData ? (
          <>
            <div className="row mb-4 text-left pl-4">
              <div
                onClick={() => this.setState({ pullRequestMode: true })}
                className={
                  "col-2 selector " +
                  (this.state.pullRequestMode ? "active" : "inactive")
                }
              >
                <span className="selector-title">Pull Requests</span>
                <br />
                <span className="selector-quantity">
                  {this.getTotalPullRequestsCount()}
                </span>
              </div>
              <div
                onClick={() => this.setState({ pullRequestMode: false })}
                className={
                  "col-2 selector " +
                  (this.state.pullRequestMode ? "inactive" : "active")
                }
              >
                <span className="selector-title">Issues</span>
                <br />
                <span className="selector-quantity">60</span>
              </div>
            </div>
          </>
        ) : null}

        <div className="row pl-4">
          <div className="col-12">
            {this.props.monthSummaryData ? (
              <canvas id="defLineChart" />
            ) : (
              <div className="no-data">No data to display</div>
            )}
          </div>
        </div>
      </>
    );
  }

  componentDidUpdate() {
    if (this.props.monthSummaryData) {
      var monthSummaryStatistics = this.getMonthSummaryStatistics();
      this.buildChart(monthSummaryStatistics);
    }
  }

  render() {
    return (
      <div className="thin-shadow bg-white rounded">
        <div className="line-chart-card-head">
          {this.props.titleText ? this.props.titleText : "No data to display"}
        </div>
        <div className="line-chart-card-body">{this.checkLoading()}</div>
      </div>
    );
  }
}

export default MonthSummary;