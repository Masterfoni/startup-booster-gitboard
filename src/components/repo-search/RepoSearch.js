import React, { Component } from "react";
import "./RepoSearch.css";
import GithubRequestHelper from "../../helpers/github-request-helper";

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

  handleAlert = alertMessage => {
    this.props.onAlertMessage(alertMessage);
  };

  handleSubmit = event => {
    event.preventDefault();

    if (!this.state.ownerValue || !this.state.repoValue) {
      this.handleAlert("Please inform both Owner and Repository name values.");
    } else {
      this.handleToggleLoading(true);

      GithubRequestHelper.sendDashboardRequest(
        this.state.ownerValue,
        this.state.repoValue
      ).then(
        result => {
          this.handleToggleLoading(false);

          var errorMessages = this.getErrorMessages(result);
          if (errorMessages.length > 0) {
            errorMessages.forEach(errorMessage =>
              this.handleAlert(errorMessage)
            );
          } else {
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
              averagePullRequestMergeTime: this.calculateAveragePullRequestMergeTime(
                mergedPullRequestList
              ),
              monthSummaryData: {
                mergedPullRequestList,
                openPullRequestList,
                closedPullRequestList,
                openIssueList,
                closedIssueList
              }
            });
          }
        },
        error => {
          error.errors.map(err => this.handleAlert(err.message));
        }
      );
    }
  };

  calculateAverageIssueCloseTime = issues => {
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
  };

  calculateAveragePullRequestMergeTime = pullRequests => {
    const pullRequestData = {
      totalCount: 0,
      totalTime: 0
    };

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

    return pullRequestData.totalCount > 0
      ? pullRequestData.totalTime / pullRequestData.totalCount
      : 0;
  };

  getPullRequestList = (queryResult, pullRequestState) => {
    return queryResult.data.data.repository[pullRequestState].edges.map(
      edge => edge.node
    );
  };

  getIssueList = (queryResult, issueState) => {
    return queryResult.data.data.repository[issueState].edges.map(
      edge => edge.node
    );
  };

  getErrorMessages = queryResult => {
    return queryResult.data.errors
      ? queryResult.data.errors.map(err => err.message)
      : [];
  };

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
