import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Switch, Route, Redirect } from 'react-router-dom'
import NavBar from './NavBar'
import Dashboard from './Dashboard'
import CreateBlock from './CreateBlock'
import YourStacks from './YourStacks'
import '../styles/Profile.css'
import { Model } from 'radiks';
import { BLOCKS_FILENAME } from '../constants.js'
import {jsonCopy} from '../utils.js'



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
   // const options = { decrypt: true };
    //this.props.userSession.getFile(BLOCKS_FILENAME, options)
    //.then((content) => {
    //  if(content) {
//const blocks = JSON.parse(content);
    //    this.setState({blocks});
    //  } 
    //})
    var blocks = await BlockTest.fetchOwnList({ });
    this.setState({ blocks });
  }


  async addBlock(blockArray) {
    const block = new BlockTest({
      block: blockArray[0],
      description: blockArray[1],
      deadline: blockArray[2],
      completed: false
    })
    await block.save();
    this.loadTasks();
  }

  async removeBlock(index, id) {
    const blocks = jsonCopy(this.state.blocks);
    blocks.splice(index, 1); 
    this.setState(blocks);
    const block = await BlockTest.findById(id);
    await block.destroy();
  }

  async completeBlock(id, message) {
    const block = await BlockTest.findById(id);
    const updatedStatus = {
      completed: true,
      completionMessage: message,
    }
    block.update(updatedStatus);
    await block.save();
    //console.log(block);
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

export { BlockTest, InvitationTest };
