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
class StackitInvitation extends Model {
  static className = 'StackitInvitation';

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

class StackitBlock extends Model {
  static className = 'StackitBlock';

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
    completionLevel: {
      type: Number,
      decrypted: true
    } // make this publci
    //userGroupId: String,
  }
}

class BlockAd extends Model {
  static className = 'BlockAd';

  static schema = {
    block: {
      type: String,
      decrypted: true
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
    },
    color: {
      type: String,
      decrypted: true
    },
    picked: {
      type: Boolean,
      decrypted: true
    }
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
      completedBlocks: [],
      previews: [],
      username: '',
      allUserCompleted: [],
      publicBlocks: []
    };
    
    this.load = this.load.bind(this);
    this.addBlock = this.addBlock.bind(this);
    this.removeBlock = this.removeBlock.bind(this);
    this.completeBlock = this.completeBlock.bind(this);
    this.loadUpdates = this.loadUpdates.bind(this);
    this.acceptBlock = this.acceptBlock.bind(this);
    this.editBlockName = this.editBlockName.bind(this);
    this.editBlockDesc = this.editBlockDesc.bind(this);
    this.pickUpBlock = this.pickUpBlock.bind(this);

  }

  async loadUpdates() {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 

    const ownBlocks = await StackitBlock.fetchList({owner: username}, {decrypt: true});
    const collabBlocks = await StackitBlock.fetchList({collaborator: username}, {decrypt: true});

    const allUserBlocks = await StackitBlock.fetchList({ });

    function isAccepted(block) {
      const { accepted } = block.attrs;
      return accepted ;
    }
    function isPending(block) {
      return !isAccepted(block);
    }
    function isComplete(block) {
      const { completionLevel } = block.attrs;
      return completionLevel === 3;
    }

    // fetch all public blocks
    const publicBlocks = await BlockAd.fetchList({ picked: false });
    console.log(publicBlocks);


    const allBlocks = ownBlocks.concat(collabBlocks);
    const blocks = allBlocks.filter(isAccepted);
    const previews = allBlocks.filter(isPending);
    const completedBlocks = blocks.filter(isComplete);
    const allUserCompleted = allUserBlocks.filter(isComplete)

    this.setState({ blocks, previews, completedBlocks, allUserCompleted, publicBlocks });
  }

  async load() {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    this.setState({username});

    // fetch all the invites that this user has pending
    const invites = await StackitInvitation.fetchList({ invitedUser: username, activated: false });


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

    if (!blockArray[3]) {
      console.log("Making ad!")
      const ad = new BlockAd({
        block: blockArray[0],
        description: blockArray[1],
        deadline: blockArray[2],
        owner: username,
        color: blockArray[4],
        picked: false
      })
      await ad.save();
    }
    else {
      console.log("adding block!")
      // create UserGroup
      const blockGroup = new UserGroup({ name: username + blockArray[0] });
      await blockGroup.create();
      
      const collaborator = blockArray[3];

      // create invitation
      const blockInvitation = await blockGroup.makeGroupMembership(collaborator);

      // create invitation model instance (unencrypted)
      const invite = new StackitInvitation({
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
        color: blockArray[4],
        completionMessage: '',
        xCoord: 0,
        yCoord: 0,
        accepted: false,
        completionLevel: 0,
      }

      attrs.userGroupId = blockGroup._id;

      // create and save a new block
      const newBlock = new StackitBlock(attrs);
      await newBlock.save();
      
      this.load();

    }
  }

  async pickUpBlock(id) {
    const blockAd = await BlockAd.findById(id);
    blockAd.update({
      picked: true
    })
    await blockAd.save();
    const { block, description, deadline, owner, color } = blockAd.attrs;

    this.addBlock([block,
                   description,
                   deadline,
                   owner,
                   color])


  }

  async removeBlock(id) {
    const block = await StackitBlock.findById(id);
    await block.destroy();
    this.loadUpdates();
  }

  async completeBlock(id, message) {
    const block = await StackitBlock.findById(id);
    const { completionLevel, owner, completionMessage} = block.attrs
    var newLevel; 
    var newMessage;
    if (completionLevel === 0 && owner === this.state.username) { // 0 means no one has completed
      newLevel = 1; // 1 means the owner has completed
      newMessage = message;
    } else if (completionLevel === 0) {
      newLevel = 2; // 2 means the collaborator has completed
      newMessage = message;
    }
    else {
      newLevel = 3; // 3 means both have completed
      newMessage = "1. " + completionMessage + " 2. " + message ;
    }
    var updatedStatus = {
      completionLevel: newLevel,
      completionMessage: newMessage,
    }
    block.update(updatedStatus);
    await block.save();
    this.loadUpdates();
  }

  async acceptBlock(id) {
    const block = await StackitBlock.findById(id);
    block.update({
      accepted: true
    })
    await block.save();
    this.loadUpdates();
  }

  async editBlockName(id, blockName) {
    const block = await StackitBlock.findById(id);
    block.update({
      block: blockName
    });
    await block.save();
    this.loadUpdates();
  }

  async editBlockDesc(id, blockDesc) {
    const block = await StackitBlock.findById(id);
    block.update({
      description: blockDesc
    });
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
              editBlockName={this.editBlockName}
              editBlockDesc={this.editBlockDesc}
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
              blocks={this.state.completedBlocks}
              all={false}
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
              publicBlocks={this.state.publicBlocks}
              pickUpBlock={this.pickUpBlock}
              {...routeProps} />
            }
          /> 
          <Route
            path='/all-stacks'
            render={
              routeProps => <YourStacks
              userSession={this.props.userSession}
              blocks={this.state.allUserCompleted}
              all={true}
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

export { StackitInvitation, StackitBlock };
