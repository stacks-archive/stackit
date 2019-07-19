import React, { Component } from 'react';
import '../styles/NavButton.css'

export default class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <button id="nav-button"
          className="btn btn-primary btn-lg"
      >
          {this.props.name}
      </button>
    );
  }
}