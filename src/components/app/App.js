import React, { Component } from "react";
import "./App.css";
import RepoSearch from "../repo-search/RepoSearch";
import TextCard from "../text-card/TextCard";
import DateTimeUtils from "../../utils/date-time-utils";
import BarChartCard from "../bar-chart-card/BarChartCard";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      averageMergeTimeText: null,
      averageCloseTimeText: null,
      organizedPullRequestData: null
    };
  }

  handleDataFetched = gitHubData => {
    console.log("Data fetched!", gitHubData);
    this.setState({
      averageMergeTimeText: this.buildAverageTimeText(
        gitHubData.averagePullRequestMergeTime
      ),
      averageCloseTimeText: this.buildAverageTimeText(
        gitHubData.averageIssueCloseTime
      ),
      organizedPullRequestData: this.buildBarChartData(
        gitHubData.organizedPullRequestData
      )
    });
  };

  buildBarChartData(pullRequestData) {
    const smallPullRequestAverageTime = pullRequestData.smallPullRequestsData.getAverageTime();
    const mediumPullRequestAverageTime = pullRequestData.mediumPullRequestsData.getAverageTime();
    const largePullRequestAverageTime = pullRequestData.largePullRequestsData.getAverageTime();

    return {
      labels: ["Small", "Medium", "Large"],
      data: [
        DateTimeUtils.getTotalHours(smallPullRequestAverageTime),
        DateTimeUtils.getTotalHours(mediumPullRequestAverageTime),
        DateTimeUtils.getTotalHours(largePullRequestAverageTime)
      ]
    };
  }

  buildAverageTimeText(totalMiliseconds) {
    const totalDaysHoursMinutes = DateTimeUtils.getTotalDaysHoursMinutes(
      totalMiliseconds
    );

    return (
      totalDaysHoursMinutes.days +
      "days " +
      totalDaysHoursMinutes.hours +
      "h" +
      totalDaysHoursMinutes.minutes +
      "m"
    );
  }

  render() {
    return (
      <div className="App">
        <div className="container-fluid bg-light">
          <div className="row thin-shadow mb-4 bg-white">
            <div className="col-md-12">
              <RepoSearch onDataFetched={this.handleDataFetched} />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4">
            <div className="col-12">
              <BarChartCard
                chartData={this.state.organizedPullRequestData}
                titleText={"Average Merge Time by Pull Request Size"}
              />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4">
            <div className="col-sm-12 col-md-6">
              <TextCard
                titleText={"Average Pull Request Merge Time"}
                bodyText={this.state.averageMergeTimeText}
              />
            </div>

            <div className="col-sm-12 col-md-6">
              <TextCard
                titleText={"Average Issue Close Time"}
                bodyText={this.state.averageCloseTimeText}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
