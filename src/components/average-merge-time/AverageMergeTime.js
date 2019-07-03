import React, { Component } from "react";
import "./AverageMergeTime.css";
import Chart from "chart.js";

class AverageMergeTime extends Component {
  buildChart() {
    let context = document.getElementById("defBarChart").getContext("2d");
    const self = this;

    new Chart(context, {
      type: "bar",
      data: {
        labels: this.props.chartData.labels,
        datasets: [
          {
            data: this.props.chartData.data.totalHours,
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

          callbacks: {
            label: function(tooltipItem, data) {
              return "Average Time      " + tooltipItem.value + "h";
            },
            afterLabel: function(tooltipItem) {
              return (
                "Pull Requests      " +
                self.props.chartData.data.totalCounts[tooltipItem.index]
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
                callback: function(value, index, values) {
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
    if (this.props.chartData) {
      this.buildChart();
    }
  }

  render() {
    return (
      <div className="thin-shadow bg-white">
        <div className="bar-chart-card-head">
          {this.props.titleText ? this.props.titleText : "No data to display"}
        </div>
        <div className="bar-chart-card-body">
          <div>
            {this.props.chartData ? (
              <canvas id="defBarChart" />
            ) : (
              "No data to display"
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AverageMergeTime;
