import React, { Component } from 'react';
import NavButton from './NavButton'

export default class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="col">
        <NavButton name="Create block" /> 
        <NavButton name="View your stacks" />
      </div>
    );
  }
}