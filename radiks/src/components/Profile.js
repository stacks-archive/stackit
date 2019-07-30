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
      type: Boolean,
      decrypted: true
    }
  }
}

class TestBlock extends Model {
  static className = 'TestBlock';

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

    // Supposed to fetch blocks this user has created (nothing shows up)
    const ownBlocks = await TestBlock.fetchOwnList({});

    console.log("fetched ownBlocks");
    console.log(ownBlocks);
    
    // intended to fetch blocks this user has been shared on 
    const collabBlocks = await TestBlock.fetchList({collaborator: username, accepted: true});
    console.log("fetched collabBlocks");
    console.log(collabBlocks);
    const blocks = ownBlocks.concat(collabBlocks);

    // fetching blocks the user has been shared on but has not yet accepted
    const previews = await TestBlock.fetchList({collaborator: username, accepted: false});
    this.setState({ blocks, previews });
  }

  async load() {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    // fetch all the invites that this user has pending
    const invites = await InvitationTesting.fetchList({ invitedUser: username, activated: false });
    console.log("fetched invites");
    console.log(invites);
    if (Array.isArray(invites) && invites.length) {
      invites.forEach(async function(invite) {
        const { invitationId, blockUserGroupId } = invite.attrs;      

        // activate invitation
        const invitation = await GroupInvitation.findById(invitationId);
        await invitation.activate();
        invite.update({
          activated: true
        });
        await invite.save();
        console.log("activated and updated invitation as active");

        // find the block that is associated with the user group that was just actiated
        const block = await TestBlock.fetchList({ userGroupId: blockUserGroupId });
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

    // create UserGroup
    const blockGroup = new UserGroup({ name: 'dummy name' });
    await blockGroup.create();
    
    console.log("created blockGroup");

    const collaborator = blockArray[3];


    // create invitation
    const blockInvitation = await blockGroup.makeGroupMembership(collaborator);
    console.log("sent invitation");

    // create invitation model instance (unencrypted)
    const invite = new InvitationTesting({
      invitedUser: collaborator,
      invitationId: blockInvitation._id,
      blockUserGroupId: blockGroup._id,
      activated: false
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
      completionLevel: 0,
    }

    attrs.userGroupId = blockGroup._id;

    // create and save a new block
    const newBlock = new TestBlock(attrs);
    await newBlock.save();
    console.log("created block");
    
    this.load();
  }

  async removeBlock(id) {
    const block = await TestBlock.findById(id);
    await block.destroy();
    this.loadUpdates();
  }

  async completeBlock(id, message) {
    const block = await TestBlock.findById(id);
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
    const block = await TestBlock.findById(id);
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

export { InvitationTesting, TestBlock };
