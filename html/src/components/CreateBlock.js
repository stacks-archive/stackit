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
  	};
  }

  render() {
    return (
      <div>
        <h1 className="landing-heading" id="create-heading">Create a block</h1>
        <div className="form">
          <form id="create-form" className="align-content-center">
            <input type="text" className="form-control" id="block" placeholder="Block name"></input>
            <textarea type="text" className="form-control" id="description" placeholder="Description"></textarea>
            <label for="date">Deadline</label>
            <input type="date" className="form-control" id="date" placeholder="Description"></input>
            <Link to='dash'
                  className="btn btn-primary" 
                  id="submit">
                  Submit
            </Link>
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
