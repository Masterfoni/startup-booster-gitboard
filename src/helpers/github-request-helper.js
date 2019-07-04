import axios from "axios";
import DateTimeUtils from "./date-time-utils";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});

export default class GithubRequestHelper {
  static sendDashboardRequest = (owner, repoName) => {
    const LAST_MONTH_QUALIFIER = `filterBy: { since: "${DateTimeUtils.getLastMonth()}" }`;

    const GET_REPO = `{
      repository(owner: "${owner}", name: "${repoName}") {
        mergedPullRequests: pullRequests(states: MERGED, last: 100) {
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
        openPullRequests: pullRequests(states: OPEN, last: 100) {
          edges {
            node {
              createdAt
            }
          }
          totalCount
        }
        closedPullRequests: pullRequests(states: CLOSED, last: 100) {
          edges {
            node {
              closedAt
            }
          }
          totalCount
        }
        closedIssues: issues(states: CLOSED, ${LAST_MONTH_QUALIFIER}, last: 100) {
          edges {
            node {
              createdAt
              closedAt
            }
          }
          totalCount
        }
        openIssues: issues(states: OPEN, ${LAST_MONTH_QUALIFIER}, last: 100) {
          edges {
            node {
              createdAt
            }
          }
          totalCount
        }
      }
    }`;

    return axiosGitHubGraphQL.post("", { query: GET_REPO });
  };
}
