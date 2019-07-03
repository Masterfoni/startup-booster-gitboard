import React, { Component } from "react";
import "./Dashboard.css";
import DateTimeUtils from "../../utils/date-time-utils";
import RepoSearch from "../../components/repo-search/RepoSearch";
import AverageMergeTime from "../../components/average-merge-time/AverageMergeTime";
import TextCard from "../../components/text-card/TextCard";
import MonthSummary from "../../components/month-summary/MonthSummary";
import "chartjs-plugin-style";
import Sidenav from "../../components/sidenav/Sidenav";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      averageMergeTimeText: null,
      averageCloseTimeText: null,
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
      averageMergeTimeText: this.buildAverageTimeText(
        gitHubData.averagePullRequestMergeTime
      ),
      averageCloseTimeText: this.buildAverageTimeText(
        gitHubData.averageIssueCloseTime
      ),
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
              <TextCard
                titleText={"Average Pull Request Merge Time"}
                bodyText={this.state.averageMergeTimeText}
                isLoading={this.state.isLoading}
              />
            </div>

            <div className="col-sm-12 col-md-6">
              <TextCard
                titleText={"Average Issue Close Time"}
                bodyText={this.state.averageCloseTimeText}
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
