import React, { useState } from "react";
import "./Dashboard.css";
import RepoSearch from "../../components/repo-search/RepoSearch";
import AverageMergeTime from "../../components/average-merge-time/AverageMergeTime";
import MonthSummary from "../../components/month-summary/MonthSummary";
import Sidenav from "../../components/sidenav/Sidenav";
import TimeTextCard from "../../components/time-text-card/TimeTextCard";
import { ToastContainer, toast } from "react-toastify";

export const Dashboard = ({match}) => {

  const [mergedPullRequestList, setMergedPullRequestList] = useState([]);
  const [averageIssueCloseTime, setAverageIssueCloseTime] = useState(null);
  const [averagePullRequestMergeTime, setAveragePullRequestMergeTime] = useState(null);
  const [monthSummaryData, setMonthSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAlert = alertMessage => {
    toast(alertMessage, {
      className: "gitboard-default-toast",
      progressClassName: "gitboard-default-toast-progress"
    });
  };

  const handleToggleLoading = isLoading => {
    setIsLoading(isLoading);
  };

  const handleDataFetched = gitHubData => {
    setMergedPullRequestList(gitHubData.mergedPullRequestList);
    setAverageIssueCloseTime(gitHubData.averageIssueCloseTime);
    setAveragePullRequestMergeTime(gitHubData.averagePullRequestMergeTime);
    setMonthSummaryData(gitHubData.monthSummaryData);
  };

  return (
    <>
      <Sidenav />
      <div className="container-fluid bg-light">
        <div className="row thin-shadow mb-4 bg-white">
          <div className="col-md-12">
            <span />
            <RepoSearch
              ownerName={match.params.ownerName}
              repoName={match.params.repoName}
              onDataFetched={handleDataFetched}
              onToggleLoading={handleToggleLoading}
              onAlertMessage={handleAlert}
            />
          </div>
        </div>

        <div className="row ml-2 mr-2 mb-4">
          <div className="col-12">
            <AverageMergeTime
              mergedPullRequestList={mergedPullRequestList}
              titleText={"Average Merge Time by Pull Request Size"}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="row ml-2 mr-2">
          <div className="col-sm-12 col-md-6  mb-4">
            <TimeTextCard
              titleText={"Average Pull Request Merge Time"}
              time={averagePullRequestMergeTime}
              isLoading={isLoading}
            />
          </div>

          <div className="col-sm-12 col-md-6 mb-4">
            <TimeTextCard
              titleText={"Average Issue Close Time"}
              time={averageIssueCloseTime}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="row ml-2 mr-2 mb-4">
          <div className="col-12">
            <MonthSummary
              monthSummaryData={monthSummaryData}
              titleText={"Month Summary"}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Dashboard;
