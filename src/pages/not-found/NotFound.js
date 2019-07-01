import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

class NotFound extends Component {
  render() {
    return (
      <div className="container">
        <div className="row pt-4">
          <div className="col-12">
            <div className="jumbotron">
              <h1 className="display-4">404 Not Found</h1>
              <p className="lead">
                Sorry, we could not find the page that you're looking for.
              </p>
              <hr className="my-4" />
              <p className="lead">
                <Link className="btn btn-outline-primary btn-lg" to="/">
                  HOMEPAGE
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
