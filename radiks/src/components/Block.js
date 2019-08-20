import React, { Component } from 'react';

// https://codepen.io/techniq/pen/yVEeOx?editors=0010



export default class Block extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      x: 30,
      y: 30,
      color: '',
    };

    this.loadBlock = this.loadBlock.bind(this);

  }

  componentWillMount() {
    this.loadBlock();
  }

  loadBlock() {
    const { xCoord, yCoord, color } = this.props.block.attrs;
    console.log("color");
    console.log(color);
    this.setState({x: xCoord, y: yCoord, color});
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
    var newCoord = {
      xCoord: this.state.x,
      yCoord: this.state.y,
    }
    this.props.block.update(newCoord);
    this.props.block.save();
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
    const { x, y, color } = this.state;
    return ( 
      <rect x={x} y={y} 
            width="100" height="100" rx="20"
            fill={color}
            className="draggable"
            draggable="true"
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
      />

    );
  }
}
