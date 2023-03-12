import React from "react";
import { Outlet } from "react-router-dom";
import "../css/main.css";
import Header from "./Header";

export default class Main extends React.Component {
  render() {
    return (
      <>
        <Header />
        <main>
          <Outlet />
        </main>
      </>
    );
  }
}
