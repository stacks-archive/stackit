import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';

import NavBar from './NavBar'
import SideBar from './SideBar'
import '../styles/Profile.css'

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
  	};
  }

  render() {
    const { person } = this.state;
    return (
      <div className="Dashboard">
        <NavBar name={person.name()} signOut={this.props.handleSignOut}/>
        <div className="row">
          <div className="col-sm-3">
            <SideBar />
          </div>
          <div className="col-sm-9">.col-9</div>
        </div>
      </div>
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }
}
