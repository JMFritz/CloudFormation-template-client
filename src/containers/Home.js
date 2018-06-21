import React, { Component } from "react";
import "./styles/Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>CloudFormation Storage</h1>
          <p>Keep track and visualize your CloudFormation templates!</p>
        </div>
      </div>
    );
  }
}
