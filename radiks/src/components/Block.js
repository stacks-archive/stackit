import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';

// https://codepen.io/techniq/pen/yVEeOx?editors=0010



export default class Block extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      x: this.props.x,
      y: this.props.y
    };

  }


  handleMouseDown = (e) => {
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = (e) => {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;
    this.coords.x = e.pageX;
    this.coords.y = e.pageY;
    this.setState({
      x: this.state.x - xDiff,
      y: this.state.y - yDiff
    })
  }

  

  render() {
    const { x, y } = this.state;
    return ( 
      <rect x={x} y={y} 
            width="100" height="100" rx="20"
            fill="#888"
            className="draggable"
            draggable="true"
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
      />
    );
  }
}
