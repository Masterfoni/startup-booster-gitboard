import React, { Component } from "react";
import "./Sidenav.css";
import logo from "../../assets/images/liferay_icon.PNG";

class Sidenav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    return (
      <div className="sidenav">
        <img
          className="mx-auto d-block"
          src={logo}
          width="50"
          alt="Liferay's logo."
        />
      </div>
    );
  }
}

export default Sidenav;
