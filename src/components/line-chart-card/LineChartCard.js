import React, { Component } from "react";
import "./LineChartCard.css";
import Chart from "chart.js";
import "chartjs-plugin-style";

class LineChartCard extends Component {
  buildChart() {
    let context = document.getElementById("defLineChart").getContext("2d");
    const self = this;

    return new Chart(context, {
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
            borderColor: "green",
            pointBackgroundColor: "green",
            fill: false
          },
          {
            data: self.props.chartData.map(dayInfo => dayInfo.totalClosed),
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
              console.log("boa noite", tooltipItem);
              console.log("boa noite", data);
              return "Average Time      " + tooltipItem.value + "h";
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
    });
  }

  componentDidUpdate() {
    var myChart = this.buildChart();
    document.getElementById(
      "chartjsLegend"
    ).innerHTML = myChart.generateLegend();
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
                <div className="col-2 selector active">
                  <span className="selector-title">Pull Requests</span>
                  <br />
                  <span className="selector-quantity">38</span>
                </div>
                <div className="col-2 selector inactive">
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
                "No data to display"
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LineChartCard;
