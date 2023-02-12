import React from "react";
import ReactDOM from "react-dom";

console.log("app")

export default class App extends React.Component {
  render() {
    return <h1>Hello World in React</h1>;
  }
}

ReactDOM.render(<App />, document.getElementById("app-container"));