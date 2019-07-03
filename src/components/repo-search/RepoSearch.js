import React, { Component } from "react";
import "./RepoSearch.css";
import RequestHelper from "../../utils/request-helper";
import DateTimeUtils from "../../utils/date-time-utils";
import moment from "moment";

class RepoSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerValue: "",
      repoValue: "",
      isLoading: false
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

  handleToggleLoading = isLoading => {
    this.props.onToggleLoading(isLoading);
  };

  handleSubmit = event => {
    event.preventDefault();

    if (!this.state.ownerValue || !this.state.repoValue) {
      alert("Please inform both Owner and Repository name values.");
    } else {
      const ONWER_QUALIFIER = `owner: "${this.state.ownerValue}"`;
      const NAME_QUALIFIER = `name: "${this.state.repoValue}"`;
      const LAST_MONTH_QUALIFIER = `filterBy: { since: "${DateTimeUtils.getLastMonth()}" }`;
      const QUANTITY_QUALIFIER = `last: 100`;

      const PULL_REQUEST_MERGED_STATE_QUALIFIER = `states: MERGED`;
      const PULL_REQUEST_OPEN_STATE_QUALIFIER = `states: OPEN`;
      const PULL_REQUEST_CLOSED_STATE_QUALIFIER = `states: CLOSED`;

      const ISSUE_CLOSED_STATE_QUALIFIER = `states: CLOSED`;
      const ISSUE_OPEN_STATE_QUALIFIER = `states: OPEN`;

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
          closedIssues: issues(${ISSUE_CLOSED_STATE_QUALIFIER}, ${LAST_MONTH_QUALIFIER}, ${QUANTITY_QUALIFIER}) {
            edges {
              node {
                createdAt
                closedAt
              }
            }
            totalCount
          }
          openIssues: issues(${ISSUE_OPEN_STATE_QUALIFIER}, ${LAST_MONTH_QUALIFIER}, ${QUANTITY_QUALIFIER}) {
            edges {
              node {
                createdAt
              }
            }
            totalCount
          }
        }
      }`;

      this.handleToggleLoading(true);

      RequestHelper.sendRequest(GET_REPO).then(
        result => {
          this.handleToggleLoading(false);

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

            var openIssueList = this.getIssueList(result, "openIssues");
            var closedIssueList = this.getIssueList(result, "closedIssues");

            this.handleDataFetched({
              mergedPullRequestList: mergedPullRequestList,
              averageIssueCloseTime: this.calculateAverageIssueCloseTime(
                closedIssueList
              ),
              monthSummaryData: this.getMonthSummaryData(
                mergedPullRequestList,
                openPullRequestList,
                closedPullRequestList,
                openIssueList,
                closedIssueList
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
    closedPullRequestList,
    openIssueList,
    closedIssueList
  ) {
    var monthSummaryData = [];

    for (let i = 30; i >= 0; i--) {
      monthSummaryData.push({
        day: moment()
          .subtract(i, "days")
          .format("DD MMM"),
        totalPullRequestsMerged: 0,
        totalPullRequestsOpen: 0,
        totalPullRequestsClosed: 0,
        totalIssuesOpened: 0,
        totalIssuesClosed: 0
      });
    }

    monthSummaryData.forEach(dayData => {
      dayData.totalIssuesClosed = closedIssueList.filter(
        issue =>
          dayData.day === moment(new Date(issue.closedAt)).format("DD MMM")
      ).length;

      dayData.totalIssuesOpened = openIssueList.filter(
        issue =>
          dayData.day === moment(new Date(issue.createdAt)).format("DD MMM")
      ).length;

      dayData.totalPullRequestsMerged = mergedPullRequestList.filter(
        pullRequest =>
          dayData.day ===
          moment(new Date(pullRequest.mergedAt)).format("DD MMM")
      ).length;

      dayData.totalPullRequestsOpen = openPullRequestList.filter(
        pullRequest =>
          dayData.day ===
          moment(new Date(pullRequest.createdAt)).format("DD MMM")
      ).length;

      dayData.totalPullRequestsClosed = closedPullRequestList.filter(
        pullRequest =>
          dayData.day ===
          moment(new Date(pullRequest.closedAt)).format("DD MMM")
      ).length;
    });

    return monthSummaryData;
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

  getIssueList(queryResult, issueState) {
    return queryResult.data.data.repository[issueState].edges.map(
      edge => edge.node
    );
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
