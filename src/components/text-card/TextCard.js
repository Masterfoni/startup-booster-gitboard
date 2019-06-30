import React, { Component } from "react";
import "./TextCard.css";

class TextCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    return (
      <div className="shadow bg-white">
        <div className="text-card-head">
          <span className="text-head">
            {this.props.titleText ? this.props.titleText : "No data to display"}
          </span>
        </div>
        <div className="text-card-body">
          <div>
            {this.props.bodyText ? this.props.bodyText : "No data to display"}
          </div>
        </div>
      </div>
    );
  }
}

export default TextCard;
