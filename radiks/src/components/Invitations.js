import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../styles/CreateBlock.css'
import { InvitationTest, InvitationInvite } from './Profile'
import { GroupInvitation } from 'radiks'


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
      public: [],
      invites: [],

    };

    this.loadInvites = this.loadInvites.bind(this);
    
  }

  componentWillMount() {
    this.loadInvites();
  }

  async loadInvites() {
    const public = await AdvertiseBlock.fetchList({ }); 
    
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    const invitationInvite = await InvitationInvite.fetchList({invitedUser: username});
    const { inviteId } = invitationInvite.attrs;
    const invitation = await GroupInvitation.findById(inviteId);
    await invitation.activate();


    this.setState({public, inivtes})
  }


  render() {
    return (
      <div>
        <p>Publicly advertised blocks looking for a collaborator</p>
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
            {this.props.blocks.map((block, i) =>
              <TableRow block={block} 
                        index={i} 
                        removeBlock={this.props.removeBlock}
                        completeBlock={this.props.completeBlock}/>
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
