import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../styles/CreateBlock.css'


const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Dashbaord extends Component {
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

    this.props.addBlock([this.state.block,
                         this.state.description,
                         this.state.deadline,
                         false]);
    this.setState({
      block: '',
      description: '',
      deadline: '',
    })
    // redirect to dash
  }

  render() {
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
