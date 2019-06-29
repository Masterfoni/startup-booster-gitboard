import React, { Component } from "react";
import "./App.css";
import RepoSearch from "../repo-search/RepoSearch";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container-fluid bg-light">
          <div className="shadow mt-2 bg-white">
            <RepoSearch />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
