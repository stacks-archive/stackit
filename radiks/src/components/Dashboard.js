import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import SideBar from './SideBar'
import BlockTable from './BlockTable'
import '../styles/Profile.css'


const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Dashboard extends Component {
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
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    return (
      <div className="row">
        <div className="col-sm-3">
          <SideBar />
        </div>
        <div className="col-sm-8">
          <BlockTable blocks={this.props.blocks} 
                      removeBlock={this.props.removeBlock} 
                      completeBlock={this.props.completeBlock}
                      username={username} /> 
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
