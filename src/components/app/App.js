import React, { Component } from "react";
import "./App.css";
import RepoSearch from "../repo-search/RepoSearch";
import TextCard from "../text-card/TextCard";
import DateTimeUtils from "../../utils/date-time-utils";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      averageMergeTimeText: null,
      averageCloseTimeText: null
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
      )
    });
  };

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
          <div className="row shadow mb-4 bg-white">
            <div className="col-md-12">
              <RepoSearch onDataFetched={this.handleDataFetched} />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4">
            <div className="col-md-6">
              <TextCard
                titleText={"Average Pull Request Merge Time"}
                bodyText={this.state.averageMergeTimeText}
              />
            </div>

            <div className="col-md-6">
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
