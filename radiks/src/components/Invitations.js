import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../styles/CreateBlock.css'
import { PreviewInvite, BlockPreview, BlockTest } from './Profile'
import { GroupInvitation } from 'radiks'
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
      public: [],
      previews: []

    };
    
    this.loadInvites = this.loadInvites.bind(this);
    this.acceptBlock = this.acceptBlock.bind(this);
    
  }
// destroy invitationInvites after they've been accepted ? 

  componentWillMount() {
    this.loadInvites();
  }

  async loadInvites() {
    //const public = await AdvertiseBlock.fetchList({ }); 
    //this.setState({public});


    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    const previewInvites = await PreviewInvite.fetchList({invitedUser: username});

    const previews = this.state.previews;
    previewInvites.forEach(async function(invite) {
      const { invitationId, inviteGroupId } = invite.attrs; 
      const invitation = await GroupInvitation.findById(invitationId);
      await invitation.activate();
      await invite.destroy();
      const blockInvite = await BlockPreview.fetchList({userGroupId: inviteGroupId});
      previews.push(blockInvite);
    });

    this.setState({ previews })
  }

  async acceptBlock(previewId, blockInvitationId, blockGroupId) {
    const preview = await BlockPreview.findById({previewId});
    preview.destroy();

    const invitation = await GroupInvitation.findById(blockInvitationId);
    await invitation.activate();

    const block = await BlockTest.fetchList({userGroupId: blockGroupId});

    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    const updatedStatus = {
      accepted: true,
      collaborator: username
    }
    block.update(updatedStatus);
    await block.save();
    this.loadInvites();
  }


  render() {
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
            {this.props.invites.map((invite, i) =>
              <InviteRow invite={invite} />
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
