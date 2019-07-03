import React, { Component } from "react";
import "./MonthSummary.css";
import Chart from "chart.js";
import "chartjs-plugin-style";
import { thisExpression } from "@babel/types";

class MonthSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      pullRequestMode: true
    };
  }

  buildChart() {
    let context = document.getElementById("defLineChart").getContext("2d");
    let builtChart;

    builtChart = new Chart(
      context,
      this.state.pullRequestMode
        ? this.getPullRequestModeOptions()
        : this.getIssueModeOptions()
    );

    return builtChart;
  }

  getIssueModeOptions() {
    const self = this;

    return {
      type: "line",
      data: {
        labels: self.props.chartData.map(dayInfo => dayInfo.day),
        datasets: [
          {
            data: self.props.chartData.map(dayInfo => dayInfo.totalMerged),
            label: "Merged",
            borderColor: "purple",
            pointBackgroundColor: "purple",
            fill: false
          },
          {
            data: self.props.chartData.map(dayInfo => dayInfo.totalOpen),
            label: "Opened",
            borderColor: "red",
            pointBackgroundColor: "red",
            fill: false
          },
          {
            data: self.props.chartData.map(dayInfo => dayInfo.totalClosed),
            label: "Closed",
            borderColor: "green",
            pointBackgroundColor: "green",
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
          display: false,
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

  getPullRequestModeOptions() {
    const self = this;

    return {
      type: "line",
      data: {
        labels: self.props.chartData.map(dayInfo => dayInfo.day),
        datasets: [
          {
            data: self.props.chartData.map(dayInfo => dayInfo.totalMerged),
            label: "Merged",
            borderColor: "purple",
            pointBackgroundColor: "purple",
            fill: false
          },
          {
            data: self.props.chartData.map(dayInfo => dayInfo.totalOpen),
            label: "Opened",
            borderColor: "red",
            pointBackgroundColor: "red",
            fill: false
          },
          {
            data: self.props.chartData.map(dayInfo => dayInfo.totalClosed),
            label: "Closed",
            borderColor: "green",
            pointBackgroundColor: "green",
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
          display: false,
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

  componentDidUpdate() {
    var myChart = this.buildChart();
    document.getElementById(
      "chartjsLegend"
    ).innerHTML = myChart.generateLegend();
  }

  getTotalPullRequestsCount() {
    return this.props.chartData.reduce(
      (previousTotal, dayInfo) =>
        previousTotal +
        dayInfo.totalMerged +
        dayInfo.totalClosed +
        dayInfo.totalOpen,
      0
    );
  }

  render() {
    return (
      <div className="thin-shadow bg-white">
        <div className="line-chart-card-head">
          {this.props.titleText ? this.props.titleText : "No data to display"}
        </div>
        <div className="line-chart-card-body">
          {this.props.chartData ? (
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
              {this.props.chartData ? (
                <>
                  <canvas id="defLineChart" />
                  <div id="chartjsLegend" className="chartjsLegend table" />
                </>
              ) : (
                <div className="no-data">No data to display</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MonthSummary;
