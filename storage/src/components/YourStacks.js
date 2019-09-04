import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import from 'react-router-dom'
import '../styles/YourStacks.css'
import Block from './Block'

// https://codepen.io/techniq/pen/yVEeOx?editors=0010

// referenced http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
// for making draggable SVGs

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';


export default class YourStacks extends Component {
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
      width: '',
      height: '',
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  render() {
    return (
      <div className="stacks">
        <svg width={this.state.width} height={this.state.height}>
          <Block x={0} y={0}/>
          <Block x={150} y={150}/>
        </svg>
      </div>
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }

  // https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmont() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight});
  }

}
