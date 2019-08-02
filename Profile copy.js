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

class InvitationTesting extends Model {
  static className = 'InvitationTesting';

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
    },
    activated: {
      type: String,
      decrypted: true
    }
  }
}

class BlockT extends Model {
  static className = 'BlockT';

  static schema = {
    block: String,
    description: String,
    deadline: String,
    owner: {
      type: String,
      decrypted: true
    },
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
    //userGroupId: String,
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
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    const ownBlocks = await BlockT.fetchList({});
    //const { collaborator } = ownBlocks[0].attrs;
    //console.log("this is owner");
    //console.log(collaborator);
    console.log("fetched ownBlocks");
    console.log(ownBlocks);
    
    const collabBlocks = await BlockT.fetchList({collaborator: username, accepted: true});
    console.log("fetched collabBlocks");
    console.log(collabBlocks);
    const blocks = ownBlocks.concat(collabBlocks);

    const previews = await BlockT.fetchList({collaborator: username, accepted: false});
    this.setState({ blocks, previews });
  }

  async load() {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    const invites = await InvitationTesting.fetchList({ invitedUser: username, activated: false });
    console.log("fetched invites");
    console.log(invites);
    if (Array.isArray(invites) && invites.length) {
      invites.forEach(async function(invite) {
        const { invitationId, blockUserGroupId } = invite.attrs;
        //await invite.destroy();
      
        const invitation = await GroupInvitation.findById(invitationId);
        await invitation.activate();
        invite.update({
          activated: true
        });
        await invite.save();
        console.log("activated and updated invitation as active");

        const block = await BlockT.fetchList({ userGroupId: blockUserGroupId });
        block.update({
          activated: true
        });
        console.log("marked block as activated");
        await block.save();
      });
    }

    this.loadUpdates();
  }


  async addBlock(blockArray) {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    const blockGroup = new UserGroup({ name: 'My Group Name' });
    await blockGroup.create();
    //await blockGroup.save();
    
    console.log("created blockGroup");
    const blockGroupId = blockGroup._id;

    const collaborator = blockArray[3];
    const group = await UserGroup.findById(blockGroupId);
    //const ownInvitation = await group.makeGroupMembership(username);
    //const ownInvitationId = ownInvitation._id;
    //const activeOwnInvitation = await GroupInvitation.findById(ownInvitationId);
    //await activeOwnInvitation.activate();

    const blockInvitation = await blockGroup.makeGroupMembership(collaborator);
    //await blockGroup.save();
    console.log("sent invitation");

    const invite = new InvitationTesting({
      invitedUser: collaborator,
      invitationId: blockInvitation._id,
      blockUserGroupId: blockGroup._id
    })
    await invite.save();
    console.log("created invite");

    const attrs = {
      block: blockArray[0],
      description: blockArray[1],
      deadline: blockArray[2],
      owner: username,
      collaborator: collaborator,
      activated: false,
      color: 'blue',
      completionMessage: '',
      xCoord: 0,
      yCoord: 0,
      accepted: false,
      completionLevel: 0
    }

    attrs.userGroupId = group._id;

    const newBlock = new BlockT(
      attrs
    )
    await newBlock.save();
    console.log(blockGroup._id);
    console.log("created block");
    
    this.load();
  }

  async removeBlock(id) {
    const block = await BlockT.findById(id);
    await block.destroy();
    this.loadUpdates();
  }

  async completeBlock(id, message) {
    const block = await BlockT.findById(id);
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
    const block = await BlockT.findById(id);
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

export { InvitationTesting, BlockT };
