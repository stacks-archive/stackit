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
import { Model } from 'radiks';



const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';


// want to send an invite that auto-accepts
// then query for Invites that you're now shared on that have a little more info you have to accept
// we have two layers because we want someone accepting a block invite to know info like
// the owner, task, and deadline, but we don't want anyone who queries for that user to be able
// to see it, since the username is non-encrypted for the end-user to be able to access
// to be able to access the block

// how do you pass the group id used to query for other models associated with that id

class PreviewInvite extends Model {
  static className = 'PreviewInvite';

  static schema = {
    invitedUser: {
      type: String,
      decrypted: true
    },
    invitationId: {
      type: String,
      decrypted: true
    },
    inviteGroupId: {
      type: String,
      decrypted: true
    }
  }
}

class BlockPreview extends Model {
  static className = 'AdvertiseBlock'
  
  static schema = {
    block: String, // first four used to preview block before invited user accepts
    description: String,
    deadline: String,
    owner: String,
    userGroupId: String, // used to find this preview based on the previewinvite
    invitationId: String, // id of the invite for the actual block
    blockGroupId: String // used to find the userGroup of the block associated with this preview / invitationId
  }
}

class BlockTest extends Model {

  static className = 'BlockTest';

  static schema = {
    block: String,
    description: String,
    deadline: String,
    color: {
      type: String,
      decrypted: true
    },
    completed: Number, // 0 for none, 1 for one checked off, 2 for completed
    completionMessage: String,
    accepted: Boolean,
    userGroupId: String,
    owner: String,
    collaborator: String,
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
      invites: [],
    };
    
    this.load= this.load.bind(this);
    this.addBlock = this.addBlock.bind(this);
    this.removeBlock = this.removeBlock.bind(this);
    this.completeBlock = this.completeBlock.bind(this);

  }


  async load() {
    const ownBlocks = await BlockTest.fetchOwnList({ accepted: true });
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    const collabBlocks = await BlockTest.fetchList({ collaborator: username })
    const blocks = ownBlocks.concat(collabBlocks);

    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    const invites = await PreviewInvite.fetchList({invitedUser: username});
    this.setState({ blocks, invites});
  }


  async addBlock(blockArray) {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    const block = new BlockTest({
      block: blockArray[0],
      description: blockArray[1],
      deadline: blockArray[2],
      completed: 0,
      accepted: false,
      owner: username
    })
    await block.save();
    this.load();
  }

  async removeBlock(id) {
    const block = await BlockTest.findById(id);
    await block.destroy();
    this.load();
  }

  async completeBlock(id, message) {
    const block = await BlockTest.findById(id);
    const { completed } = block.attrs
    const newStatus = completed + 1;
    const updatedStatus = {
      completed: newStatus,
      completionMessage: message,
    }
    block.update(updatedStatus);
    await block.save();
    this.load();
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
              publicInvites={this.state.publicInvites}
              invites={this.state.invites}
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
    this.loadTasks();
  }
}

export { BlockTest, PreivewInvite, BlockPreview };
