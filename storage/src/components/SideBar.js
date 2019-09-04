import React, { Component } from 'react';
import NavButton from './NavButton'

export default class SideBar extends Component {

  render() {

    return (
      <div className="col">
        <NavButton name="Create block" link="/create"/>
        <NavButton name="View your stacks" link="/stacks" />
      </div>
    );
  }
}
