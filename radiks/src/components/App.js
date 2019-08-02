import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import { appConfig } from '../constants'
import { User, getConfig, configure, } from 'radiks';
import { UserSession } from 'blockstack';



export default class App extends Component {

  constructor(props) {
    super(props);
    this.userSession = new UserSession({ appConfig });

  }

  async handleSignIn(e) {
    const { userSession } = getConfig();
    e.preventDefault();
    if (userSession.isSignInPending()) {
      await userSession.handlePendingSignIn();
      await User.createWithCurrentUser();
      window.location = '/';
    }
    userSession.redirectToSignIn();
  }

  handleSignOut(e) {
    const { userSession } = getConfig();
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !this.userSession.isUserSignedIn() ?
            <Signin userSession={this.userSession} handleSignIn={ this.handleSignIn } />
            : <Profile userSession={this.userSession} handleSignOut={ this.handleSignOut } />
          }
        </div>
      </div>
    );
  }

  async componentWillMount() {
    configure({
      apiServer: 'http://localhost:1260',
      userSession: this.userSession,
    });
    const { userSession } = getConfig();
    if (userSession.isSignInPending()) {
      await userSession.handlePendingSignIn();
      window.location = '/';
    }
  }
}
