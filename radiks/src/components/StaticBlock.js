import React, { Component } from 'react';

// https://codepen.io/techniq/pen/yVEeOx?editors=0010



export default class StaticBlock extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      color: '',
    };

    this.loadBlock = this.loadBlock.bind(this);

  }

  componentWillMount() {
    this.loadBlock();
  }

  loadBlock() {
    const { color } = this.props.block.attrs;
    this.setState({color});
  }


  render() {
    const { color } = this.state;
    const x = Math.floor((Math.random() * this.props.width) + 1);
    const y = Math.floor((Math.random() * this.props.height) + 1);

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
