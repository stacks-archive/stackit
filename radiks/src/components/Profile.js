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

// Don't want to clutter the final models with buggy instances so this is a test model
// This model represents an invite to a UserGroup
// All fields are decrypted
class TestInv extends Model {
  static className = 'TestInv';

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
      type: Boolean,
      decrypted: true
    }
  }
}

class TestBl extends Model {
  static className = 'TestBl';

  static schema = {
    block: String,
    description: String,
    deadline: String,
    owner: {
      type: String,
      decrypted: true
    },
    collaborator: {
      type: String,
      decrypted: true
    },
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
    
    this.load = this.load.bind(this);
    this.addBlock = this.addBlock.bind(this);
    this.removeBlock = this.removeBlock.bind(this);
    this.completeBlock = this.completeBlock.bind(this);
    this.loadUpdates = this.loadUpdates.bind(this);
    this.acceptBlock = this.acceptBlock.bind(this);

  }

  async loadUpdates() {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    const ownBlocks = await TestBl.fetchList({owner: username}, {decrypt: true});
    const collabBlocks = await TestBl.fetchList({collaborator: username}, {decrypt: true});

    function isAccepted(block) {
      const { accepted } = block.attrs;
      return accepted ;
    }
    function isPending(block) {
      return !isAccepted(block);
    }

    const allBlocks = ownBlocks.concat(collabBlocks);
    const blocks = allBlocks.filter(isAccepted);
    const previews = allBlocks.filter(isPending);

    this.setState({ blocks, previews });
  }

  async load() {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    // fetch all the invites that this user has pending
    const invites = await TestInv.fetchList({ invitedUser: username, activated: false });

    if (Array.isArray(invites) && invites.length) {
      invites.forEach(async function(invite) {
        const { invitationId } = invite.attrs;      

        // activate invitation
        const invitation = await GroupInvitation.findById(invitationId);
        await invitation.activate();
        invite.update({
          activated: true,
        });
        await invite.save();
      });
    }

    this.loadUpdates();
  }


  async addBlock(blockArray) {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    // create UserGroup
    const blockGroup = new UserGroup({ name: username + blockArray[0] });
    await blockGroup.create();
    
    const collaborator = blockArray[3];

    // create invitation
    const blockInvitation = await blockGroup.makeGroupMembership(collaborator);

    // create invitation model instance (unencrypted)
    const invite = new TestInv({
      invitedUser: collaborator,
      invitationId: blockInvitation._id,
      blockUserGroupId: blockGroup._id,
      activated: false
    })
    await invite.save();

    const attrs = {
      block: blockArray[0],
      description: blockArray[1],
      deadline: blockArray[2],
      owner: username,
      collaborator: collaborator,
      color: 'blue',
      completionMessage: '',
      xCoord: 0,
      yCoord: 0,
      accepted: false,
      completionLevel: 0,
    }

    attrs.userGroupId = blockGroup._id;

    // create and save a new block
    const newBlock = new TestBl(attrs);
    await newBlock.save();
    
    this.load();
  }

  async removeBlock(id) {
    const block = await TestBl.findById(id);
    await block.destroy();
    this.loadUpdates();
  }

  async completeBlock(id, message) {
    const block = await TestBl.findById(id);
    const { completionLevel } = block.attrs
    const newStatus = completionLevel + 1;
    var newMessage;
    if (newStatus === 1) {
      newMessage = message;
    }
    else {
      const { completionMessage } = block.attrs;
      newMessage = "1. " + completionMessage + " 2. " + message ;
    }
    var updatedStatus = {
      completionLevel: newStatus,
      completionMessage: newMessage,
    }
    block.update(updatedStatus);
    await block.save();
    this.loadUpdates();
  }

  async acceptBlock(id) {
    const block = await TestBl.findById(id);
    block.update({
      accepted: true
    })
    await block.save();
    console.log("accepted block!");
    console.log(block);
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
              acceptBlock={this.acceptBlock}
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

export { TestInv, TestBl };
