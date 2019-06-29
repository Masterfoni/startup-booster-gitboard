import axios from "axios";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});

export default class RequestHelper {
  static sendRequest = graphQuery => {
    return axiosGitHubGraphQL.post("", { query: graphQuery });
  };
}
