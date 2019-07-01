import React, { Component } from "react";
import "./BarChartCard.css";
import Chart from "chart.js";

class BarChartCard extends Component {
  buildChart(data) {
    let context = document.getElementById("defBarChart").getContext("2d");

    new Chart(context, {
      type: "bar",
      data: {
        labels: this.props.chartData.labels,
        datasets: [
          {
            data: this.props.chartData.data,
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
              console.log(data);
              console.log(tooltipItem);
              return "Average Time      " + tooltipItem.value + "h";
            },
            afterLabel: function() {
              return "Pull Requests     XX";
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
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  componentDidUpdate() {
    if (this.props.chartData != null) {
      this.buildChart();
    }
  }

  render() {
    return (
      <div className="thin-shadow bg-white">
        <div className="text-card-head">
          <span className="text-head">
            {this.props.titleText ? this.props.titleText : "No data to display"}
          </span>
        </div>
        <div className="bar-chart-card-body">
          <div>
            <canvas id="defBarChart" />
          </div>
        </div>
      </div>
    );
  }
}

export default BarChartCard;