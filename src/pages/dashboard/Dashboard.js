import React, { Component } from "react";
import "./Dashboard.css";
import RepoSearch from "../../components/repo-search/RepoSearch";
import AverageMergeTime from "../../components/average-merge-time/AverageMergeTime";
import MonthSummary from "../../components/month-summary/MonthSummary";
import "chartjs-plugin-style";
import Sidenav from "../../components/sidenav/Sidenav";
import TimeTextCard from "../../components/time-text-card/TimeTextCard";
import PullRequestData from "../../domain/pull-request-data";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mergedPullRequestList: [],
      averageIssueCloseTime: null,
      monthSummaryData: null,
      isLoading: false
    };
  }

  handleToggleLoading = isLoading => {
    this.setState({
      isLoading: isLoading
    });
  };

  handleDataFetched = gitHubData => {
    console.log("Data fetched!", gitHubData);
    this.setState({
      mergedPullRequestList: gitHubData.mergedPullRequestList,
      averageIssueCloseTime: gitHubData.averageIssueCloseTime,
      monthSummaryData: gitHubData.monthSummaryData
    });
  };

  calculateAveragePullRequestMergeTime() {
    const pullRequests = this.state.mergedPullRequestList;
    const pullRequestData = new PullRequestData(0, 0);

    if (pullRequests.length > 0) {
      pullRequestData.totalCount = pullRequests.length;
      pullRequestData.totalTime = pullRequests.reduce(
        (previousTime, pullRequest) =>
          previousTime +
          Math.abs(
            new Date(pullRequest.mergedAt).getTime() -
              new Date(pullRequest.createdAt).getTime()
          ),
        0
      );
    }

    return pullRequestData.getAverageTime();
  }

  render() {
    return (
      <>
        <Sidenav />
        <div className="container-fluid bg-light">
          <div className="row thin-shadow mb-4 bg-white">
            <div className="col-md-12">
              <RepoSearch
                onDataFetched={this.handleDataFetched}
                onToggleLoading={this.handleToggleLoading}
              />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4">
            <div className="col-12">
              <AverageMergeTime
                mergedPullRequestList={this.state.mergedPullRequestList}
                titleText={"Average Merge Time by Pull Request Size"}
                isLoading={this.state.isLoading}
              />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4">
            <div className="col-sm-12 col-md-6">
              <TimeTextCard
                titleText={"Average Pull Request Merge Time"}
                time={this.calculateAveragePullRequestMergeTime()}
                isLoading={this.state.isLoading}
              />
            </div>

            <div className="col-sm-12 col-md-6">
              <TimeTextCard
                titleText={"Average Issue Close Time"}
                time={this.state.averageIssueCloseTime}
                isLoading={this.state.isLoading}
              />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4">
            <div className="col-12">
              <MonthSummary
                chartData={this.state.monthSummaryData}
                titleText={"Month Summary"}
                isLoading={this.state.isLoading}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
