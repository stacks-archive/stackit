import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Redirect } from 'react-router-dom'
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
      color: '#000000',
      noCollab: false,
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
    var collaborator = this.state.collaborator;
    const color = this.state.color;
    const noCollab = this.state.noCollab

    if (block !== '' && description !== '' && deadline !== '' && (collaborator !== '' || noCollab)) {

      if (noCollab) {
        collaborator = false
      }
      this.props.addBlock([block,
                           description,
                           deadline,
                           collaborator,
                           color]);

      this.setState({
        block: '',
        description: '',
        deadline: '',
        collaborator: '',
        color: '#000000',
        redirectToHome: true,
      })
    }

    //window.location.reload();

  
  }

  render() {
    const redirectToHome = this.state.redirectToHome;
    if (redirectToHome) {
      return <Redirect to="/dash" />

    }
    else {
      //window.location.reload();

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
            <input className="form-check-input" 
                   type="checkbox" 
                   value={this.state.noCollab} 
                   id="noCollab" 
                   name="noCollab"
                   onChange={this.handleChange}></input>
            <label className="form-check-label" htmlFor="noCollab">
              No collaborator
            </label>
            <br></br>
            <label htmlFor="date">Deadline</label>
            <input type="date" 
                   className="form-control" 
                   name="deadline" 
                   value={this.state.deadline}
                   onChange={this.handleChange}
                   placeholder="Description"></input>
            <label htmlFor="color">Block color</label>
            <input type="color" 
                   name="color" 
                   className="form-control" 
                   id="color"
                   onChange={this.handleChange}></input>
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
    //window.location.reload();

  }
}
