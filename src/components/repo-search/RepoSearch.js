import React, { Component } from "react";
import "./RepoSearch.css";
import RequestHelper from "../../utils/request-helper";
import DateTimeUtils from "../../utils/date-time-utils";

class RepoSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerValue: "",
      repoValue: "",
      smallPullRequests: [],
      mediumPullRequests: [],
      largePullRequests: []
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

      const PULL_REQUEST_STATE_QUALIFIER = `states: MERGED`;

      const GET_REPO = `{
        repository(${ONWER_QUALIFIER}, ${NAME_QUALIFIER}) {
          pullRequests(${PULL_REQUEST_STATE_QUALIFIER}, ${QUANTITY_QUALIFIER}) {
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
            var pullRequestList = this.getPullRequestList(result);
            var issueList = this.getIssueList(result);

            this.handleDataFetched({
              averagePullRequestMergeTime: this.calculateAveragePullRequestMergeTime(
                pullRequestList
              ),
              averageIssueCloseTime: this.calculateAverageIssueCloseTime(
                issueList
              )
            });

            this.organizePullRequestsBySize(pullRequestList);
          }
        },
        error => {
          console.log(error);
          alert(error.errors.map(err => err.message));
        }
      );
    }
  };

  organizePullRequestsBySize(pullRequests) {
    this.setState({
      smallPullRequests: [],
      mediumPullRequests: [],
      largePullRequests: []
    });

    pullRequests.forEach(pullRequest => {
      let totalModifications = pullRequest.additions + pullRequest.deletions;

      if (totalModifications <= 100) {
        this.setState({
          smallPullRequests: this.state.smallPullRequests.concat([pullRequest])
        });
      } else if (totalModifications <= 1000) {
        this.setState({
          mediumPullRequests: this.state.mediumPullRequests.concat([
            pullRequest
          ])
        });
      } else {
        this.setState({
          largePullRequests: this.state.largePullRequests.concat([pullRequest])
        });
      }
    });

    console.log("Small PR`s organized: ", this.state.smallPullRequests);
    console.log("Medium PR`s organized: ", this.state.mediumPullRequests);
    console.log("Large PR`s organized: ", this.state.largePullRequests);
  }

  calculateAveragePullRequestMergeTime(pullRequests) {
    let averageTime = 0;

    if (pullRequests.length > 0) {
      averageTime =
        pullRequests.reduce(
          (previousTime, pullRequest) =>
            previousTime +
            Math.abs(
              new Date(pullRequest.mergedAt).getTime() -
                new Date(pullRequest.createdAt).getTime()
            ),
          0
        ) / pullRequests.length;
    }

    return averageTime;
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

  getPullRequestList(queryResult) {
    return queryResult.data.data.repository.pullRequests.edges.map(
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
