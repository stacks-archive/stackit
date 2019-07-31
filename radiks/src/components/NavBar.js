import React, { Component } from 'react';
import '../styles/NavBar.css'

export default class NavBar extends Component {
  render() {

    return (
      <div className="navbar navbar-dark navbat-static-top">
          <a className="navbar-brand" href="/">
              <div className="nav-heading">
                Stackit Dashboard
              </div>
          </a>
          <div className="btn-group" id="settings">
            <button className="btn dropdown-toggle settings" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="settings-drop">
              {this.props.name}
            </button>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="settings-drop">
              <button className="dropdown-item" onClick={this.props.signOut.bind(this)}>Sign out</button>
            </div>
          </div>
      </div>

    );
  }
}