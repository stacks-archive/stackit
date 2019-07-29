import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../styles/CreateBlock.css'
import { PreviewInvite, BlockPreview, BlockTest } from './Profile'
import { GroupInvitation, UserGroup } from 'radiks'
import InviteRow from './InviteRow'


const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Invitations extends Component {
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
    console.log("Invitations.js")
    return (
      <div>
        <table className="table table-hover">
          <thead className="thead">
            <tr>
              <th scope="col">Block</th>
              <th scope="col">Description</th>
              <th scope="col">Deadline</th>
              <th scope="col">Owner</th>
              <th scope="col">Accept</th>
            </tr>
          </thead>
          <tbody>
            {this.props.previews.map((preview, i) =>
              <InviteRow preview={preview}
                         acceptBlock={this.props.acceptBlock} />
            )}
          </tbody>
      </table>
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
