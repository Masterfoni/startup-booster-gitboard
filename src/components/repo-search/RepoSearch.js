import React, { Component } from "react";
import "./RepoSearch.css";
import RequestHelper from "../../utils/request-helper";

class RepoSearch extends Component {
  constructor(props) {
    super(props);

    this.state = { ownerValue: "", repoValue: "" };

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
      const GET_REPO = `{
        user(login: "${this.state.ownerValue}") {
          name
          url
          repository(name: "${this.state.repoValue}") {
            name
            url
          }
        }
      }`;

      RequestHelper.sendRequest(GET_REPO).then(
        result => {
          if (result.data.errors) {
            alert(result.data.errors.map(err => err.message));
          } else {
            console.log(result);
          }
        },
        error => {
          console.log(error);
          alert(error.errors.map(err => err.message));
        }
      );
    }
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
