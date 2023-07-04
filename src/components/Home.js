import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";

export class Home extends Component {
  render() {
    return (
      <Card>
        <h1>Here's the homepage, a place to insert various stuff inside</h1>
        <h4 style={{ textAlign: "center" }}>
          Click <Link to="/films-list">Here</Link> to explore all films
        </h4>
      </Card>
    );
  }
}
