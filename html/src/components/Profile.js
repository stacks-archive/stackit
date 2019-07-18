import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';

import NavBar from './NavBar'
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
