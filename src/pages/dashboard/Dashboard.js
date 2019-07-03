import React, { Component } from "react";
import "./Dashboard.css";
import RepoSearch from "../../components/repo-search/RepoSearch";
import AverageMergeTime from "../../components/average-merge-time/AverageMergeTime";
import MonthSummary from "../../components/month-summary/MonthSummary";
import Sidenav from "../../components/sidenav/Sidenav";
import TimeTextCard from "../../components/time-text-card/TimeTextCard";
import { ToastContainer, toast } from "react-toastify";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mergedPullRequestList: [],
      averageIssueCloseTime: null,
      averagePullRequestMergeTime: null,
      monthSummaryData: null,
      isLoading: false
    };
  }

  handleAlert = alertMessage => {
    toast.info(alertMessage);
  };

  handleToggleLoading = isLoading => {
    this.setState({
      isLoading: isLoading
    });
  };

  handleDataFetched = gitHubData => {
    this.setState({
      mergedPullRequestList: gitHubData.mergedPullRequestList,
      averageIssueCloseTime: gitHubData.averageIssueCloseTime,
      averagePullRequestMergeTime: gitHubData.averagePullRequestMergeTime,
      monthSummaryData: gitHubData.monthSummaryData
    });
  };

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
                onAlertMessage={this.handleAlert}
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
                monthSummaryData={this.state.monthSummaryData}
                titleText={"Month Summary"}
                isLoading={this.state.isLoading}
              />
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }
}

export default Dashboard;
