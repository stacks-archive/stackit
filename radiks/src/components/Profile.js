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

class InvitationTest extends Model {
  static className = 'InvitationTest';

  static schema = {
    invitedUser: {
      type: String,
      decrypted: true
    },
    invitationId: {
      type: String,
      decrypted: true
    }
  }


}

// want to send an invite that auto-accepts
// then query for Invites that you're now shared on that have a little more info you have to accept
// we have two layers because we want someone accepting a block invite to know info like
// the owner, task, and deadline, but we don't want anyone who queries for that user to be able
// to see it, since the username is non-encrypted for the end-user to be able to access
// to be able to access the block

// how do you pass the group id used to query for other models associated with that id

class InvitationInvite extends Model {
  static className = 'InvitationInvite';

  static schema = {
    invitedUser: {
      type: String,
      decrypted: true
    },
    invitationId: {
      type: String,
      decrypted: true
    }
  }
}

class AdvertiseBlock extends Model {
  static className = 'AdvertiseBlock'
  
  static schema = {
    block: {
      type: String,
      decrypted:true,
    },
    description: {
      type: String,
      decrypted: true
    },
    deadline: {
      type: String,
      decrypted: true
    },
    owner: {
      type: String,
      decrypted: true
    }
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
    completed: {
      type: Boolean,
      decrypted: true,
    },
    completionMessage: String,
    advertise: {
      type: Boolean,
      decrypted: true,
    },
    userGroupId: String,
    noCollaborators: Number,
    completeCollaborators: Number,
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
    };
    
    this.loadTasks = this.loadTasks.bind(this);
    this.addBlock = this.addBlock.bind(this);
    this.removeBlock = this.removeBlock.bind(this);
    this.completeBlock = this.completeBlock.bind(this);

  }


  async loadTasks() {
    var blocks = await BlockTest.fetchOwnList({ });
    this.setState({ blocks });
  }


  async addBlock(blockArray) {
    const block = new BlockTest({
      block: blockArray[0],
      description: blockArray[1],
      deadline: blockArray[2],
      completed: false,
    })
    await block.save();
    this.loadTasks();
  }

  async removeBlock(id) {
    const block = await BlockTest.findById(id);
    await block.destroy();
    this.loadTasks();
  }

  async completeBlock(id, message) {
    const block = await BlockTest.findById(id);
    const updatedStatus = {
      completed: true,
      completionMessage: message,
    }
    block.update(updatedStatus);
    await block.save();
    this.loadTasks();
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

export { BlockTest, InvitationTest, InvitationInvite };
