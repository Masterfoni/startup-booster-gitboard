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

  /**
   * @description Handles the change event of the owner input, passing down it's value to the
   * ownerValue state property via setState
   * @param  {Event}  event     Input's event object
   */
  handleOwnerChange = event =>
    this.setState({ ownerValue: event.target.value });

  /**
   * @description Handles the change event of the repo name input, passing down it's value to the
   * repoValue state property via setState
   * @param  {Event}  event     Input's event object
   */
  handleRepoChange = event => this.setState({ repoValue: event.target.value });

  /**
   * @description Handles the data fetched from the github api after it has been processed
   * by this component, ready to pass to it's parent
   * @param  {Oject}  githubData     Repository processed data
   */
  handleDataFetched = gitHubData => {
    this.props.onDataFetched(gitHubData);
  };

  /**
   * @description Handles the loading event, passing to the parent if there is a request in progress or not
   * via the isLoading flag
   * @param  {boolean}  isLoading   Whether or not a request is loading (waiting for response)
   */
  handleToggleLoading = isLoading => {
    this.props.onToggleLoading(isLoading);
  };

  /**
   * @description Notifies the parent that there is an alert message to be shown
   * @param  {String}  alertMessage   Alert message to be shown in a toast by the parent
   */
  handleAlert = alertMessage => {
    this.props.onAlertMessage(alertMessage);
  };

  /**
   * @description Function responsible for managing the form submit action (after user hits enter)
   * this function make a request to the github API (V4) and build the data in a way that the
   * dasboard component can use to pass down for its children.
   * @param  {Event} Event             Event object, uset only to stop the default propagation
   */
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
          this.handleAlert("Ocorreu um erro inesperado, tente novamente.");
        }
      );
    }
  };

  /**
   * @description Calculate the average time for an issue to be closed based on an issue list
   * @param  {Array} Issues       List of closed issues having the createdAt and closedAt properties
   * @return {Number}             Average time in miliseconds
   */
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

  /**
   * @description Calculate the average time for a pull request to be merged based on a pull request list
   * @param  {Array} pullRequests       List of merged pull requests having the createdAt and mergedAt properties
   * @return {Number}                   Average time in miliseconds
   */
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

  /**
   * @description Parse the edge and nodes that the query returns in a list of more friendly pull requests objects
   * based on the desired pull request state
   * @param  {Object} queryResult       Actual raw api result contaning edge and pull request nodes
   * @param  {String} pullRequestState  Alias name of the pull request specified in the query, to be accessed
   * @return {Array}                    List of pull requests
   */
  getPullRequestList = (queryResult, pullRequestState) => {
    return queryResult.data.data.repository[pullRequestState].edges.map(
      edge => edge.node
    );
  };

  /**
   * @description Parse the edge and nodes that the query returns in a list of more friendly issue objects
   * based on the desired issue state
   * @param  {Object} queryResult       Actual raw api result contaning edge and issue nodes
   * @param  {String} pullRequestState  Alias name of the issue specified in the query, to be accessed
   * @return {Array}                    List of issues
   */
  getIssueList = (queryResult, issueState) => {
    return queryResult.data.data.repository[issueState].edges.map(
      edge => edge.node
    );
  };

  /**
   * @description Parse the errors that the query returns and extracts the error messages only
   * @param  {Object} queryResult       Actual raw api result
   * @return {Array}                    List of error messages
   */
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
