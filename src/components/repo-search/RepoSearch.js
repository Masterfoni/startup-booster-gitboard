import React, { useState, useEffect, useContext } from "react";
import "./RepoSearch.css";
import GithubRequestHelper from "../../helpers/github-request-helper";
import { LoadingContext } from "../../contexts/LoadingContext";

const RepoSearch = ({ownerName, repoName, onDataFetched, onAlertMessage}) => {

  const [ownerValue, setOwnerValue] = useState("");
  const [repoValue, setRepoValue] = useState("");

  const {setLoading} = useContext(LoadingContext);

  useEffect(() => {
    handleOwnerChange(ownerName);
    handleRepoChange(repoName);

    if (ownerName && repoName) {
      fetchData(ownerName, repoName);
    }
  }, []);

  /**
   * @description Handles the change event of the owner input, passing down it's value to the
   * ownerValue state property via setState, this event is triggered by both input field and
   * parent passing down props
   * @param  {Event}  event     Input's event object or data passed down by the parent
   */
  const handleOwnerChange = event => {
    if (event && event.target) {
      setOwnerValue(event.target.value);
    } else if (event) {
      setOwnerValue(event);
    }
  };

  /**
   * @description Handles the change event of the repo name input, passing down it's value to the
   * repoValue state property via setState, this event is triggered by both input field and
   * parent passing down props
   * @param  {Event}  event     Input's event object or data passed down by the parent
   */
  const handleRepoChange = event => {
    if (event && event.target) {
      setRepoValue(event.target.value);
    } else if (event) {
      setRepoValue(event);
    }
  };

  /**
   * @description Handles the data fetched from the github api after it has been processed
   * by this component, ready to pass to it's parent
   * @param  {Oject}  githubData     Repository processed data
   */
  const handleDataFetched = gitHubData => {
    onDataFetched(gitHubData);
  };

  /**
   * @description Handles the loading event, passing to the parent if there is a request in progress or not
   * via the isLoading flag
   * @param  {boolean}  isLoading   Whether or not a request is loading (waiting for response)
   */
  const handleToggleLoading = isLoading => {
    setLoading(isLoading);
  };

  /**
   * @description Notifies the parent that there is an alert message to be shown
   * @param  {String}  alertMessage   Alert message to be shown in a toast by the parent
   */
  const handleAlert = alertMessage => {
    onAlertMessage(alertMessage);
  };

  /**
   * @description Function responsible for managing the form submit action (after user hits enter)
   * this function checks if the input fields are filled and calls fetchData
   * @param  {Event} Event             Event object, used only to stop the default propagation
   */
  const handleSubmit = event => {
    event.preventDefault();

    if (!ownerValue || !repoValue) {
      handleAlert("Please inform both Owner and Repository name values.");
    } else {
      fetchData(ownerValue, repoValue);
    }
  };

  /**
   * @description Function responsible for making a request to the github API (V4) and build
   * the data in a way that the dasboard component can use to pass down for its children.
   * @param  {String} ownerName       The name of the user/organization in github
   * @param  {String} repoName        The name of the repository
   */
  const fetchData = (ownerName, repoName) => {
    handleToggleLoading(true);

    GithubRequestHelper.sendDashboardRequest(ownerName, repoName).then(
      result => {
        handleToggleLoading(false);

        var errorMessages = getErrorMessages(result);
        if (errorMessages.length > 0) {
          errorMessages.forEach(errorMessage => handleAlert(errorMessage));
        } else {
          var mergedPullRequestList = getPullRequestList(
            result,
            "mergedPullRequests"
          );
          var openPullRequestList = getPullRequestList(
            result,
            "openPullRequests"
          );
          var closedPullRequestList = getPullRequestList(
            result,
            "closedPullRequests"
          );

          var openIssueList = getIssueList(result, "openIssues");
          var closedIssueList = getIssueList(result, "closedIssues");

          handleDataFetched({
            mergedPullRequestList: mergedPullRequestList,
            averageIssueCloseTime: calculateAverageIssueCloseTime(
              closedIssueList
            ),
            averagePullRequestMergeTime: calculateAveragePullRequestMergeTime(
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
      () => {
        handleAlert("An unexpected error ocurred, try again.");
      }
    );
  };

  /**
   * @description Calculate the average time for an issue to be closed based on an issue list
   * @param  {Array} Issues       List of closed issues having the createdAt and closedAt properties
   * @return {Number}             Average time in miliseconds
   */
  const calculateAverageIssueCloseTime = issues => {
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
  const calculateAveragePullRequestMergeTime = pullRequests => {
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
  const getPullRequestList = (queryResult, pullRequestState) => {
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
  const getIssueList = (queryResult, issueState) => {
    return queryResult.data.data.repository[issueState].edges.map(
      edge => edge.node
    );
  };

  /**
   * @description Parse the errors that the query returns and extracts the error messages only
   * @param  {Object} queryResult       Actual raw api result
   * @return {Array}                    List of error messages
   */
  const getErrorMessages = queryResult => {
    return queryResult.data.errors
      ? queryResult.data.errors.map(err => err.message)
      : [];
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Owner"
        type="text"
        value={ownerValue}
        onChange={handleOwnerChange}
      />

      <input
        placeholder="Repo"
        type="text"
        className="blurred"
        value={repoValue}
        onChange={handleRepoChange}
      />
      <input type="submit" value="Submit" hidden />
    </form>
  );
}

export default RepoSearch;
