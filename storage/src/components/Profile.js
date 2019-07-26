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
import { BLOCKS_FILENAME } from '../constants.js'
import {jsonCopy} from '../utils.js'



const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

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
    this.saveBlocks = this.saveBlocks.bind(this);

  }


  loadTasks() {
    const options = { decrypt: true };
    this.props.userSession.getFile(BLOCKS_FILENAME, options)
    .then((content) => {
      if(content) {
        const blocks = JSON.parse(content);
        this.setState({blocks});
      } 
    })
  }


  addBlock(block) {
    const blocks = jsonCopy(this.state.blocks);
    blocks.push(block);
    this.saveBlocks(blocks);
  }

  removeBlock(index) {
    const blocks = jsonCopy(this.state.blocks);
    blocks.splice(index, 1); 
    this.saveBlocks(blocks);
  }

  completeBlock(index, message) {
    const blocks = jsonCopy(this.state.blocks)
    blocks[index][3] = !blocks[index][3]
    blocks[index].push(message)
    this.saveBlocks(blocks);
  }

  saveBlocks(blocks) {
    this.setState({blocks});
    const options = {encrypt : true};
    this.props.userSession.putFile(BLOCKS_FILENAME, JSON.stringify(blocks), options);
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
