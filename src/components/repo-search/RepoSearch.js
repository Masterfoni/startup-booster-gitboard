import React, { Component } from "react";
import "./RepoSearch.css";
import RequestHelper from "../../utils/request-helper";
import DateTimeUtils from "../../utils/date-time-utils";
import PullRequestData from "../../domain/pull-request-data";
import moment from "moment";

class RepoSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerValue: "",
      repoValue: ""
    };

    this.handleOwnerChange = this.handleOwnerChange.bind(this);
    this.handleRepoChange = this.handleRepoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOwnerChange = event =>
    this.setState({ ownerValue: event.target.value });

  handleRepoChange = event => this.setState({ repoValue: event.target.value });

  handleDataFetched = gitHubData => {
    this.props.onDataFetched(gitHubData);
  };

  handleSubmit = event => {
    event.preventDefault();

    if (!this.state.ownerValue || !this.state.repoValue) {
      alert("Please inform both Owner and Repository name values.");
    } else {
      const ISSUE_STATE_QUALIFIER = `states: CLOSED`;
      const ONWER_QUALIFIER = `owner: "${this.state.ownerValue}"`;
      const NAME_QUALIFIER = `name: "${this.state.repoValue}"`;
      const LAST_MONTH_QUALIFIER = `filterBy: { since: "${DateTimeUtils.getLastMonth()}" }`;
      const QUANTITY_QUALIFIER = `last: 100`;

      const PULL_REQUEST_MERGED_STATE_QUALIFIER = `states: MERGED`;
      const PULL_REQUEST_OPEN_STATE_QUALIFIER = `states: OPEN`;
      const PULL_REQUEST_CLOSED_STATE_QUALIFIER = `states: CLOSED`;

      const GET_REPO = `{
        repository(${ONWER_QUALIFIER}, ${NAME_QUALIFIER}) {
          mergedPullRequests: pullRequests(${PULL_REQUEST_MERGED_STATE_QUALIFIER}, ${QUANTITY_QUALIFIER}) {
            edges {
              node {
                createdAt
                mergedAt
                additions
                deletions
              }
            }
            totalCount
          }
          openPullRequests: pullRequests(${PULL_REQUEST_OPEN_STATE_QUALIFIER}, ${QUANTITY_QUALIFIER}) {
            edges {
              node {
                createdAt
              }
            }
            totalCount
          }
          closedPullRequests: pullRequests(${PULL_REQUEST_CLOSED_STATE_QUALIFIER}, ${QUANTITY_QUALIFIER}) {
            edges {
              node {
                closedAt
              }
            }
            totalCount
          }
          issues(${ISSUE_STATE_QUALIFIER}, ${LAST_MONTH_QUALIFIER}, ${QUANTITY_QUALIFIER}) {
            edges {
              node {
                createdAt
                closedAt
              }
            }
            totalCount
          }
        }
      }`;

      RequestHelper.sendRequest(GET_REPO).then(
        result => {
          var errorMessages = this.getErrorMessages(result);
          if (errorMessages.length > 0) {
            alert(errorMessages);
          } else {
            console.log(result);
            var mergedPullRequestList = this.getPullRequestList(
              result,
              "mergedPullRequests"
            );
            var openPullRequestList = this.getPullRequestList(
              result,
              "openPullRequests"
            );
            var closedPullRequestList = this.getPullRequestList(
              result,
              "closedPullRequests"
            );
            var issueList = this.getIssueList(result);

            this.handleDataFetched({
              averagePullRequestMergeTime: this.calculateAveragePullRequestMergeTime(
                mergedPullRequestList
              ),
              averageIssueCloseTime: this.calculateAverageIssueCloseTime(
                issueList
              ),
              organizedPullRequestData: this.organizePullRequestData(
                mergedPullRequestList
              ),
              monthSummaryData: this.getMonthSummaryData(
                mergedPullRequestList,
                openPullRequestList,
                closedPullRequestList
              )
            });
          }
        },
        error => {
          console.log(error);
          alert(error.errors.map(err => err.message));
        }
      );
    }
  };

  getMonthSummaryData(
    mergedPullRequestList,
    openPullRequestList,
    closedPullRequestList
  ) {
    var monthSummaryData = [];

    for (let i = 30; i >= 0; i--) {
      monthSummaryData.push({
        day: moment()
          .subtract(i, "days")
          .format("DD MMM"),
        totalMerged: 0,
        totalOpen: 0,
        totalClosed: 0
      });
    }

    mergedPullRequestList.forEach(pullRequest => {
      let foundIndex = monthSummaryData.findIndex(
        summaryData =>
          summaryData.day ===
          moment(new Date(pullRequest.mergedAt)).format("DD MMM")
      );

      if (foundIndex !== -1) {
        monthSummaryData[foundIndex].totalMerged++;
      }
    });

    openPullRequestList.forEach(pullRequest => {
      let foundIndex = monthSummaryData.findIndex(
        summaryData =>
          summaryData.day ===
          moment(new Date(pullRequest.createdAt)).format("DD MMM")
      );

      if (foundIndex !== -1) {
        monthSummaryData[foundIndex].totalOpen++;
      }
    });

    closedPullRequestList.forEach(pullRequest => {
      let foundIndex = monthSummaryData.findIndex(
        summaryData =>
          summaryData.day ===
          moment(new Date(pullRequest.closedAt)).format("DD MMM")
      );

      if (foundIndex !== -1) {
        monthSummaryData[foundIndex].totalClosed++;
      }
    });

    return monthSummaryData;
  }

  organizePullRequestData(pullRequests) {
    const smallPullRequestsData = new PullRequestData(0, 0);
    const mediumPullRequestsData = new PullRequestData(0, 0);
    const largePullRequestsData = new PullRequestData(0, 0);

    pullRequests.forEach(pullRequest => {
      let totalModifications = pullRequest.additions + pullRequest.deletions;

      if (totalModifications <= 100) {
        smallPullRequestsData.totalCount++;
        smallPullRequestsData.totalTime += Math.abs(
          new Date(pullRequest.mergedAt).getTime() -
            new Date(pullRequest.createdAt).getTime()
        );
      } else if (totalModifications <= 1000) {
        mediumPullRequestsData.totalCount++;
        mediumPullRequestsData.totalTime += Math.abs(
          new Date(pullRequest.mergedAt).getTime() -
            new Date(pullRequest.createdAt).getTime()
        );
      } else {
        largePullRequestsData.totalCount++;
        largePullRequestsData.totalTime += Math.abs(
          new Date(pullRequest.mergedAt).getTime() -
            new Date(pullRequest.createdAt).getTime()
        );
      }
    });

    return {
      smallPullRequestsData,
      mediumPullRequestsData,
      largePullRequestsData
    };
  }

  calculateAveragePullRequestMergeTime(pullRequests) {
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

  calculateAverageIssueCloseTime(issues) {
    let averageTime = 0;

    if (issues.length > 0) {
      averageTime =
        issues.reduce(
          (previousTime, issue) =>
            previousTime +
            Math.abs(
              new Date(issue.closedAt).getTime() -
                new Date(issue.createdAt).getTime()
            ),
          0
        ) / issues.length;
    }

    return averageTime;
  }

  getPullRequestList(queryResult, pullRequestState) {
    return queryResult.data.data.repository[pullRequestState].edges.map(
      edge => edge.node
    );
  }

  getIssueList(queryResult) {
    return queryResult.data.data.repository.issues.edges.map(edge => edge.node);
  }

  getErrorMessages(queryResult) {
    return queryResult.data.errors
      ? queryResult.data.errors.map(err => err.message)
      : [];
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          placeholder="Owner"
          type="text"
          value={this.state.ownerValue}
          onChange={this.handleOwnerChange}
        />

        <input
          placeholder="Repo"
          type="text"
          className="blurred"
          value={this.state.repoValue}
          onChange={this.handleRepoChange}
        />
        <input type="submit" value="Submit" hidden />
      </form>
    );
  }
}

export default RepoSearch;
