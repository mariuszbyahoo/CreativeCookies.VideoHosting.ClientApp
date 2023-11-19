import React, { Component } from "react";
import { Container } from "reactstrap";
import NavMenu from "./NavMenu";
import { ConsentProvider } from "./ConsentContext/ConsentContext";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <ConsentProvider>
          <NavMenu />
        </ConsentProvider>
        <Container tag="main">{this.props.children}</Container>
      </div>
    );
  }
}
