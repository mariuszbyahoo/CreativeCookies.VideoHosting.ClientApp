import React, { Component } from "react";
import { Container } from "reactstrap";
import NavMenu from "./NavMenu";
import { ConsentProvider } from "./ConsentContext/ConsentContext";
import Footer from "./Footer";
import styles from "./Layout.module.css";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <>
        <div className={styles.siteContainer} style={{ minHeight: "100vh" }}>
          <ConsentProvider className={styles.contentWrap}>
            <NavMenu />
          </ConsentProvider>
          <Container tag="main">{this.props.children}</Container>
        </div>
        <Footer />
      </>
    );
  }
}
