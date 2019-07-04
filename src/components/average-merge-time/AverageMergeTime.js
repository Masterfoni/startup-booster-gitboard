import React, { Component } from "react";
import "./AverageMergeTime.css";
import Chart from "chart.js";
import Loader from "../loader/Loader";
import DateTimeUtils from "../../helpers/date-time-utils";

class AverageMergeTime extends Component {
  /**
   * @description Calculates the average given the sum and total number of elements
   * @param {Number} totalTime  Total time in miliseconds
   * @param {Number} totalCount Total number of elements
   * @return {Number} The average time
   */
  calculateAverageTime = (totalTime, totalCount) => {
    return totalCount > 0 ? totalTime / totalCount : 0;
  };

  /**
   * @description Builds the input needed for the chart to be rendered, containing
   * the labels and data needed
   * @param {Object} pullRequestData  Object containing data organized by pull request size
   * @return {Object} Object contaning the data needed for the chart do be rendered, including labels
   */
  buildBarChartData = pullRequestData => {
    const smallPullRequestAverageTime = this.calculateAverageTime(
      pullRequestData.smallPullRequestsData.totalTime,
      pullRequestData.smallPullRequestsData.totalCount
    );
    const mediumPullRequestAverageTime = this.calculateAverageTime(
      pullRequestData.mediumPullRequestsData.totalTime,
      pullRequestData.mediumPullRequestsData.totalCount
    );
    const largePullRequestAverageTime = this.calculateAverageTime(
      pullRequestData.largePullRequestsData.totalTime,
      pullRequestData.largePullRequestsData.totalCount
    );

    return {
      labels: ["Small", "Medium", "Large"],
      data: {
        totalHours: [
          DateTimeUtils.getTotalHours(smallPullRequestAverageTime),
          DateTimeUtils.getTotalHours(mediumPullRequestAverageTime),
          DateTimeUtils.getTotalHours(largePullRequestAverageTime)
        ],
        totalCounts: [
          pullRequestData.smallPullRequestsData.totalCount,
          pullRequestData.mediumPullRequestsData.totalCount,
          pullRequestData.largePullRequestsData.totalCount
        ]
      }
    };
  };

  /**
   * @description Organizes pull requests in different arrays grouped by pull request size
   * the pull request list is located on this component's props
   * @return {Object} Object contaning thre arrays, one for small, one for medium
   * and one for large pull requests
   */
  organizePullRequestData = () => {
    const smallPullRequestsData = {
      totalCount: 0,
      totalTime: 0
    };
    const mediumPullRequestsData = {
      totalCount: 0,
      totalTime: 0
    };
    const largePullRequestsData = {
      totalCount: 0,
      totalTime: 0
    };

    this.props.mergedPullRequestList.forEach(pullRequest => {
      let totalModifications = pullRequest.additions + pullRequest.deletions;

      if (totalModifications <= 100) {
        smallPullRequestsData.totalCount++;
        smallPullRequestsData.totalTime += Math.abs(
          new Date(pullRequest.mergedAt).getTime() -
            new Date(pullRequest.createdAt).getTime()
        );
      } else if (totalModifications <= 1000) {
        mediumPullRequestsData.totalCount++;
        mediumPullRequestsData.totalTime += Math.abs(
          new Date(pullRequest.mergedAt).getTime() -
            new Date(pullRequest.createdAt).getTime()
        );
      } else {
        largePullRequestsData.totalCount++;
        largePullRequestsData.totalTime += Math.abs(
          new Date(pullRequest.mergedAt).getTime() -
            new Date(pullRequest.createdAt).getTime()
        );
      }
    });

    return {
      smallPullRequestsData,
      mediumPullRequestsData,
      largePullRequestsData
    };
  };

  /**
   * @description Builds the chart element with the needed options
   * @param {Object} chartData  Object containing labels and data needed for the chart rendering
   */
  buildChart = chartData => {
    const chartElement = document.getElementById("defBarChart");
    if (chartElement) {
      let context = chartElement.getContext("2d");

      new Chart(context, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.data.totalHours,
              backgroundColor: [
                "rgba(54, 162, 235)",
                "rgba(54, 162, 235)",
                "rgba(54, 162, 235)"
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(54, 162, 235, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          tooltips: {
            bodySpacing: 10,
            bodyFontSize: 14,
            bodyFontColor: "rgba(0, 0, 0, 1)",
            titleFontSize: 0,
            titleFontColor: "rgba(0, 0, 0, 1)",
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
                return "Average Time      " + tooltipItem.value + "h";
              },
              afterLabel: function(tooltipItem) {
                return (
                  "Pull Requests      " +
                  chartData.data.totalCounts[tooltipItem.index]
                );
              }
            }
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {
                    return value + "h";
                  }
                }
              }
            ]
          }
        }
      });
    }
  };

  componentDidUpdate = () => {
    if (
      this.props.mergedPullRequestList &&
      this.props.mergedPullRequestList.length > 0
    ) {
      const organizedPullRequestList = this.organizePullRequestData();
      const chartData = this.buildBarChartData(organizedPullRequestList);
      this.buildChart(chartData);
    }
  };

  /**
   * @description Checks wether the component is loading or not and renders the loader component or the chart content
   * @return {Component} Loader component or the bar chart
   */
  checkLoading = () => {
    return this.props.isLoading ? (
      <Loader />
    ) : (
      <div>
        {this.props.mergedPullRequestList &&
        this.props.mergedPullRequestList.length > 0 ? (
          <canvas id="defBarChart" />
        ) : (
          "No data to display"
        )}
      </div>
    );
  };

  render() {
    return (
      <div className="thin-shadow bg-white rounded">
        <div className="bar-chart-card-head">
          {this.props.titleText ? this.props.titleText : "No data to display"}
        </div>
        <div className="bar-chart-card-body">{this.checkLoading()}</div>
      </div>
    );
  }
}

export default AverageMergeTime;
