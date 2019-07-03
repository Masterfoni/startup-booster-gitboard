import React, { Component } from "react";
import "./AverageMergeTime.css";
import Chart from "chart.js";
import Loader from "../loader/Loader";
import DateTimeUtils from "../../utils/date-time-utils";
import PullRequestData from "../../domain/pull-request-data";

class AverageMergeTime extends Component {
  buildBarChartData(pullRequestData) {
    const smallPullRequestAverageTime = pullRequestData.smallPullRequestsData.getAverageTime();
    const mediumPullRequestAverageTime = pullRequestData.mediumPullRequestsData.getAverageTime();
    const largePullRequestAverageTime = pullRequestData.largePullRequestsData.getAverageTime();

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
  }

  organizePullRequestData() {
    const smallPullRequestsData = new PullRequestData(0, 0);
    const mediumPullRequestsData = new PullRequestData(0, 0);
    const largePullRequestsData = new PullRequestData(0, 0);

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
  }

  buildChart(chartData) {
    let context = document.getElementById("defBarChart").getContext("2d");

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

  componentDidUpdate() {
    if (
      this.props.mergedPullRequestList &&
      this.props.mergedPullRequestList.length > 0
    ) {
      const organizedPullRequestList = this.organizePullRequestData();
      const chartData = this.buildBarChartData(organizedPullRequestList);
      this.buildChart(chartData);
    }
  }

  checkLoading() {
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
  }

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
