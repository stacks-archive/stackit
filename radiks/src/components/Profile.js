import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Switch, Route, Redirect } from 'react-router-dom'
import NavBar from './NavBar'
import Dashboard from './Dashboard'
import CreateBlock from './CreateBlock'
import YourStacks from './YourStacks'
import Invitations from './Invitations'
import '../styles/Profile.css'
import { Model, UserGroup, GroupInvitation } from 'radiks';



const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';


// want to send an invite that auto-accepts
// then query for Invites that you're now shared on that have a little more info you have to accept
// we have two layers because we want someone accepting a block invite to know info like
// the owner, task, and deadline, but we don't want anyone who queries for that user to be able
// to see it, since the username is non-encrypted for the end-user to be able to access
// to be able to access the block

// how do you pass the group id used to query for other models associated with that id

class Invitation extends Model {
  static className = 'Invitation';

  static schema = {
    invitedUser: {
      type: String,
      decrypted: true,
    },
    invitationId: {
      type: String,
      decrypted: true
    },
    blockUserGroupId: {
      type: String,
      decrypted: true
    }
  }
}

class Block extends Model {
  static className = 'block';

  static schema = {
    block: String,
    description: String,
    deadline: String,
    owner: String,
    collaborator: String,
    activated: Boolean,
    color: {
      type: String,
      decrypted: true
    },
    completionMessage: String,
    xCoord: Number,
    yCoord: Number,
    accepted: Boolean,
    completionLevel: Number,
    userGroupId: String,
  }
}




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
      blocks: [],
      publicInvites: [], 
      previews: [],
    };
    
    this.load= this.load.bind(this);
    this.addBlock = this.addBlock.bind(this);
    this.removeBlock = this.removeBlock.bind(this);
    this.completeBlock = this.completeBlock.bind(this);
    this.loadUpdates = this.loadUpdates.bind(this);
    this.acceptBlock = this.acceptBlock.bind(this);

  }

  async loadUpdates() {
    const ownBlocks = await Block.fetchList({owner: username, accepted: true});
    const collabBlocks = await Block.fetchList({collaborator: username, accepted: true});
    const blocks = ownBlocks.concat(collabBlocks);

    const previews = await Block.fetchList({collaborator: username, activated: true, accepted: false});
    this.setState({ blocks, previews });
  }

  async load() {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    //const ownBlocks = await BlockTest.fetchOwnList({ accepted: true });
    //const profile = this.props.userSession.loadUserData();
    //const username = profile.username; 

    //const collabBlocks = await BlockTest.fetchList({ collaborator: username })
    //const blocks = ownBlocks.concat(collabBlocks);
    //const invites = await PreviewInvite.fetchList({invitedUser: username});

    const invites = await Invitation.fetchList({ invitedUser: username });
    invites.forEach(async function(invite) {
      const { invitationId, blockUserGroupId } = invite.attrs;
      await invite.destroy();

      const invitation = await GroupInvitation.findById(invitationId);
      await invitation.activate();

      const block = await Block.fetchList({ userGroupId: blockUserGroupId });
      block.update({
        activated: true
      });
      await block.save();
    });

    this.loadUpdates();
  }


  async addBlock(blockArray) {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    const blockGroup = new UserGroup({ name: blockArray[0] + username });
    await blockGroup.create();
    //console.log("created blockGroup")

    //const previewGroup = new UserGroup({ name: blockArray[0] + username});
    //await previewGroup.create();
    //console.log("created previewGroup")

    const collaborator = blockArray[3];
    const blockInvitation = await blockGroup.makeGroupMembership(collaborator);
    //const previewInvitation = await previewGroup.makeGroupMembership(collaborator);
    //console.log("made both group memberships")

    const invite = new Invitation({
      invitedUser: collaborator,
      invitationId: blockInvitation._id,
      blockUserGroupId: blockGroup._id
    })
    await invite.save();

    const newBlock = new Block({
      block: blockArray[0],
      description: blockArray[1],
      deadline: blockArray[2],
      owner: username,
      collaborator: collaborator,
      activated: false,
      accepted: false,
      completionLevel: 0,
      userGroupId: blockGroup._id
    })
    await newBlock.save();
    
    //const block = new BlockTest({
    //  block: blockArray[0],
    //  description: blockArray[1],
    //  deadline: blockArray[2],
    //  completed: 0,
    //  accepted: false,
    //  owner: username,
    //  userGroupId: blockGroup._id
    //})
    //await block.save();
    //console.log("saved block")
 

    //const previewInvite = new PreviewInvite({
    //  invitedUser: collaborator,
    //  invitationId: previewInvitation._id,
    //  inviteGroupId: previewGroup._id
    //})
    //await previewInvite.save();
    //console.log("saved previewInvite")

    //const blockPreview = new BlockPreview({
    //  block: blockArray[0],
    //  description: blockArray[1],
    //  deadline: blockArray[2],
    //  owner: username,
    //  invitedUser: collaborator,
    //  activated: true,
    //  userGroupId: previewGroup._id,
      //invitationId: blockInvitation._id
      //blockGroupId: blockGroup._id

    //})
    //await blockPreview.save();
    //console.log("saved blockPreview")

    this.load();
  }

  async removeBlock(id) {
    const block = await Block.findById(id);
    await block.destroy();
    this.loadUpdates();
  }

  async completeBlock(id, message) {
    const block = await Block.findById(id);
    const { completionLevel } = block.attrs
    const newStatus = completionLevel + 1;
    const updatedStatus = {
      completionLevel: newStatus,
      completionMessage: message,
    }
    block.update(updatedStatus);
    await block.save();
    this.loadUpdates();
  }

  async acceptBlock(id) {
    const block = await Block.findById(id);
    block.update({
      accepted: true
    })
    await block.save();
    this.loadUpdates();
  }

  render() {
    const { person } = this.state;

    if(window.location.pathname === '/') {
      return (
        <Redirect to='dash' />
      )
    }

    return (
      <div className="Profile">
        <NavBar name={person.name()} signOut={this.props.handleSignOut}/>
        <Switch>
          <Route
            path='/dash'
            render={
              routeProps => <Dashboard
              userSession={this.props.userSession}
              blocks={this.state.blocks}
              removeBlock={this.removeBlock}
              completeBlock={this.completeBlock}
              {...routeProps} />
            }
          />
          <Route
            path='/create'
            render={
              routeProps => <CreateBlock
              userSession={this.props.userSession}
              addBlock = {this.addBlock}
              {...routeProps} />
            }
          /> 
          <Route
            path='/stacks'
            render={
              routeProps => <YourStacks
              userSession={this.props.userSession}
              blocks={this.state.blocks}
              {...routeProps} />
            }
          />
          <Route
            path='/invitations'
            render={
              routeProps => <Invitations
              userSession={this.props.userSession}
              previews={this.state.previews}
              acceptBlock={this.accetpBlock}
              {...routeProps} />
            }
          /> 
        </Switch>
      </div>
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
    this.load();
  }
}

export { Invitation, Block };
