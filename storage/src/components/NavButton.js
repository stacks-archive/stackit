import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../styles/NavButton.css'

export default class Button extends Component {

  render() {

    return (
      <Link to={this.props.link}
            className="btn btn-primary"
            id="nav-button">
            {this.props.name}
      </Link>
    );
  }
}
