import React, { Component } from "react";
import "./TextCard.css";
import Loader from "../loader/Loader";

class TextCard extends Component {
  checkLoading() {
    return this.props.isLoading ? (
      <Loader />
    ) : (
      <div>
        {this.props.bodyText ? this.props.bodyText : "No data to display"}
      </div>
    );
  }

  render() {
    return (
      <div className="thin-shadow bg-white">
        <div className="text-card-head">
          <span className="text-head">
            {this.props.titleText ? this.props.titleText : "No data to display"}
          </span>
        </div>
        <div className="text-card-body">{this.checkLoading()}</div>
      </div>
    );
  }
}

export default TextCard;
