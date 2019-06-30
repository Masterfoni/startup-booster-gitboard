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

  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.ownerValue || !this.state.repoValue) {
      alert("Please inform both Owner and Repository name values.");
    } else {
      const ISSUE_STATE_QUALIFIER = `states: CLOSED`;
      const ONWER_QUALIFIER = `owner: ${this.state.ownerValue}`;
      const NAME_QUALIFIER = `name: ${this.state.repoValue}`;
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

          }
          issues(${ISSUE_STATE_QUALIFIER}, ${LAST_MONTH_QUALIFIER}, ${QUANTITY_QUALIFIER}) {
            edges {
              node {
                createdAt
                closedAt
              }
            }
          }
        }
      }`;

      RequestHelper.sendRequest(GET_REPO).then(
        result => {
          if (result.data.errors) {
            alert(result.data.errors.map(err => err.message));
          } else {
            console.log(result);

            console.log(
              "Average issue close time: ",
              this.calculateAverageIssueCloseTime(
                result.data.data.repository.issues.edges
              )
            );

            console.log(
              "Average pull request merge time: ",
              this.calculateAveragePullRequestMergeTime(
                result.data.data.repository.pullRequests.edges
              )
            );

            this.organizePullRequestsBySize(
              result.data.data.repository.pullRequests.edges
            );
          }
        },
        error => {
          console.log(error);
          alert(error.errors.map(err => err.message));
        }
      );
    }
  }

  organizePullRequestsBySize(pullRequests) {
    this.setState({
      smallPullRequests: [],
      mediumPullRequests: [],
      largePullRequests: []
    });

    pullRequests.forEach(pullRequest => {
      let totalModifications =
        pullRequest.node.additions + pullRequest.node.deletions;

      if (totalModifications <= 100) {
        this.setState({
          smallPullRequests: this.state.smallPullRequests.concat([
            pullRequest.node
          ])
        });
      } else if (totalModifications <= 1000) {
        this.setState({
          mediumPullRequests: this.state.mediumPullRequests.concat([
            pullRequest.node
          ])
        });
      } else {
        this.setState({
          largePullRequests: this.state.largePullRequests.concat([
            pullRequest.node
          ])
        });
      }
    });

    console.log("Small PR`s organized: ", this.state.smallPullRequests);
    console.log("Medium PR`s organized: ", this.state.mediumPullRequests);
    console.log("Large PR`s organized: ", this.state.largePullRequests);
  }

  calculateAveragePullRequestMergeTime(pullRequests) {
    return DateTimeUtils.getTotalDaysHoursMinutes(
      pullRequests.reduce(
        (previousTime, issue) =>
          previousTime +
          Math.abs(
            new Date(issue.node.mergedAt).getTime() -
              new Date(issue.node.createdAt).getTime()
          ),
        0
      ) / pullRequests.length
    );
  }

  calculateAverageIssueCloseTime(issues) {
    return DateTimeUtils.getTotalDaysHoursMinutes(
      issues.reduce(
        (previousTime, issue) =>
          previousTime +
          Math.abs(
            new Date(issue.node.closedAt).getTime() -
              new Date(issue.node.createdAt).getTime()
          ),
        0
      ) / issues.length
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
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
        </div>
      </div>
    );
  }
}

export default RepoSearch;
