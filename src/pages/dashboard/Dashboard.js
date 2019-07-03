import React, { Component } from "react";
import "./Dashboard.css";
import DateTimeUtils from "../../utils/date-time-utils";
import RepoSearch from "../../components/repo-search/RepoSearch";
import AverageMergeTime from "../../components/average-merge-time/AverageMergeTime";
import MonthSummary from "../../components/month-summary/MonthSummary";
import "chartjs-plugin-style";
import Sidenav from "../../components/sidenav/Sidenav";
import TimeTextCard from "../../components/time-text-card/TimeTextCard";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      averagePullRequestMergeTime: null,
      averageIssueCloseTime: null,
      organizedPullRequestData: null,
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
      averagePullRequestMergeTime: gitHubData.averagePullRequestMergeTime,
      averageIssueCloseTime: gitHubData.averageIssueCloseTime,
      organizedPullRequestData: this.buildBarChartData(
        gitHubData.organizedPullRequestData
      ),
      monthSummaryData: gitHubData.monthSummaryData
    });
  };

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
                chartData={this.state.organizedPullRequestData}
                titleText={"Average Merge Time by Pull Request Size"}
                isLoading={this.state.isLoading}
              />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4">
            <div className="col-sm-12 col-md-6">
              <TimeTextCard
                titleText={"Average Pull Request Merge Time"}
                time={this.state.averagePullRequestMergeTime}
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
