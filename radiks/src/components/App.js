import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import { appConfig } from '../assets/constants'

import {
  UserSession,
  AppConfig
} from 'blockstack';



export default class App extends Component {

  constructor(props) {
    super(props);
    this.userSession = new UserSession({ appConfig });

  }

  handleSignIn(e) {
    const { userSession } = getConfig();
    e.preventDefault();
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
          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            : <Profile userSession={userSession} handleSignOut={ this.handleSignOut } />
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
      await User.createWithCurrentUser();
      window.location = '/';
    }
  }
}
