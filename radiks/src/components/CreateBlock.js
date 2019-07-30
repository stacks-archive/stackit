import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../styles/CreateBlock.css'


const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class CreateBlock extends Component {
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
      block: '',
      description: '',
      deadline: '',  
      collaborator: '',
      redirectToHome: false, 
    };
    
    this.addBlock = this.addBlock.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const name = e.target.name; 
    const value = e.target.value;

    this.setState({
      [name]: value
    });
  }

  addBlock(e) {
    e.preventDefault();
    const block = this.state.block;
    const description = this.state.description;
    const deadline = this.state.deadline;
    const collaborator = this.state.collaborator;

    if (block != '' && description != '' && deadline != '' && collaborator != '') {

      this.props.addBlock([block,
                           description,
                           deadline,
                           collaborator]);

      this.setState({
        block: '',
        description: '',
        deadline: '',
        collaborator: '',
        redirectToHome: true,
      })
    }
  
  }

  render() {
    const redirectToHome = this.state.redirectToHome;
    if (redirectToHome) {
      return <Redirect to="/dash" />
    }
    return (
      <div>
        <h1 className="landing-heading" id="create-heading">Create a block</h1>
        <div className="form">
          <form id="create-form" className="align-content-center" onSubmit={this.addBlock}>
            <input type="text" 
                   className="form-control" 
                   name="block" 
                   value={this.state.block}
                   onChange={this.handleChange}
                   placeholder="Block name">
            </input>
            <textarea type="text" 
                      className="form-control" 
                      name="description" 
                      value={this.state.description}
                      onChange={this.handleChange}
                      placeholder="Description"></textarea>
            <input type="text" 
                   className="form-control" 
                   name="collaborator" 
                   value={this.state.collaborator}
                   onChange={this.handleChange}
                   placeholder="Collaborator's Blockstack ID">
            </input>
            <label for="date">Deadline</label>
            <input type="date" 
                   className="form-control" 
                   name="deadline" 
                   value={this.state.deadline}
                   onChange={this.handleChange}
                   placeholder="Description"></input>
            <input type="submit" className="btn btn-primary" value="Create block"/>
          </form>
        </div>
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
