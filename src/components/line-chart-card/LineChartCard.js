import React, { Component } from "react";
import "./LineChartCard.css";
import Chart from "chart.js";

class LineChartCard extends Component {
  buildChart() {
    let context = document.getElementById("defLineChart").getContext("2d");
    const self = this;

    return new Chart(context, {
      type: "line",
      data: {
        labels: ["20 Jun", "25 Jun", "26 Jun", "30 Jun", "01 Jul", "02 Jul"],
        datasets: [
          {
            data: [15, 25, 10, 25, 20, 26],
            label: "Merged",
            borderColor: "purple",
            fill: false
          },
          {
            data: [30, 35, 40, 33, 62, 53],
            label: "Opened",
            borderColor: "green",
            fill: false
          },
          {
            data: [5, 2, 10, 8, 20, 23],
            label: "Closed",
            borderColor: "red",
            fill: false
          }
        ]
      },
      options: {
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

  componentDidMount() {
    var myChart = this.buildChart();
    document.getElementById(
      "chartjsLegend"
    ).innerHTML = myChart.generateLegend();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  render() {
    return (
      <div className="thin-shadow bg-white">
        <div className="line-chart-card-head">
          {this.props.titleText ? this.props.titleText : "No data to display"}
        </div>
        <div className="line-chart-card-body">
          <div className="row mb-4 text-left pl-4">
            <div className="col-2 active">
              <span className="selector-title">Pull Requests</span>
              <br />
              <span className="selector-quantity">38</span>
            </div>
            <div className="col-2 inactive">
              <span className="selector-title">Issues</span>
              <br />
              <span className="selector-quantity">60</span>
            </div>
          </div>

          <div className="row pl-4">
            <div className="col-12">
              <canvas id="defLineChart" />
              <div id="chartjsLegend" className="chartjsLegend table" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LineChartCard;
