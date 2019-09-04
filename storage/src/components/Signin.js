import React, { Component } from 'react';

export default class Signin extends Component {

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="panel-landing" id="section-1">
        <h1 className="landing-heading">Stackit</h1>
        <br/>
        <button
          className="btn btn-primary btn-lg"
          onClick={ handleSignIn.bind(this) }
        >
          Sign in with Blockstack
        </button>
      </div>
    );
  }
}
