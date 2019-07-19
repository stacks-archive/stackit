import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../styles/NavButton.css'

export default class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Link to={this.props.link} 
                    className="btn btn-primary">{this.props.name}</Link>
    );
  }
}