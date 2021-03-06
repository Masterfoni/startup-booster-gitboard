import React, { useState } from "react";
import "./Dashboard.css";
import RepoSearch from "../../components/repo-search/RepoSearch";
import AverageMergeTime from "../../components/average-merge-time/AverageMergeTime";
import MonthSummary from "../../components/month-summary/MonthSummary";
import TimeTextCard from "../../components/time-text-card/TimeTextCard";
import { ToastContainer, toast } from "react-toastify";
import { LoadingProvider } from "../../contexts/LoadingContext";

export const Dashboard = ({match}) => {

  const [mergedPullRequestList, setMergedPullRequestList] = useState([]);
  const [averageIssueCloseTime, setAverageIssueCloseTime] = useState(null);
  const [averagePullRequestMergeTime, setAveragePullRequestMergeTime] = useState(null);
  const [monthSummaryData, setMonthSummaryData] = useState(null);

  const handleAlert = alertMessage => {
    toast(alertMessage, {
      className: "gitboard-default-toast",
      progressClassName: "gitboard-default-toast-progress"
    });
  };

  const handleDataFetched = gitHubData => {
    setMergedPullRequestList(gitHubData.mergedPullRequestList);
    setAverageIssueCloseTime(gitHubData.averageIssueCloseTime);
    setAveragePullRequestMergeTime(gitHubData.averagePullRequestMergeTime);
    setMonthSummaryData(gitHubData.monthSummaryData);
  };

  return (
    <>
      <LoadingProvider>
        <>
        <div className="container-fluid bg-light">
          <div className="row thin-shadow mb-4 bg-white sticky-top">
            <div className="col-md-12">
              <span />
              <RepoSearch
                ownerName={match.params.ownerName}
                repoName={match.params.repoName}
                onDataFetched={handleDataFetched}
                onAlertMessage={handleAlert}
              />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4 first-row">
            <div className="col-12">
              <AverageMergeTime
                mergedPullRequestList={mergedPullRequestList}
                titleText={"Average Merge Time by Pull Request Size"}
              />
            </div>
          </div>

          <div className="row ml-2 mr-2">
            <div className="col-sm-12 col-md-6  mb-4">
              <TimeTextCard
                titleText={"Average Pull Request Merge Time"}
                time={averagePullRequestMergeTime}
              />
            </div>

            <div className="col-sm-12 col-md-6 mb-4">
              <TimeTextCard
                titleText={"Average Issue Close Time"}
                time={averageIssueCloseTime}
              />
            </div>
          </div>

          <div className="row ml-2 mr-2 mb-4">
            <div className="col-12">
              <MonthSummary
                monthSummaryData={monthSummaryData}
                titleText={"Month Summary"}
              />
            </div>
          </div>
        </div>
        </>
      </LoadingProvider>
      <ToastContainer />
    </>
  );
}

export default Dashboard;
