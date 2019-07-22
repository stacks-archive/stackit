import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { Switch, Route, Redirect } from 'react-router-dom'
import '../styles/YourStacks.css'

// referenced http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
// for making draggable SVGs

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
      selectedElement: false,
    };
    
    this.startDrag = this.startDrag.bind(this);
    this.drop = this.drop.bind(this);
    this.endDrag = this.endDrag.bind(this);
    this.dragOver = this.dragOver.bind(this);
  }


  startDrag(e) {
    this.setState({selectedElement: e.target});
    console.log("staretd");
  } 

  drop(e) {
    if (this.state.selectedElement) {
      e.preventDefault();
      console.log(this.state.selectedElement);
      var x = parseFloat(this.state.selectedElement.gettAttributeNS(null, "x"));
      console.log(x);
      var selEl = this.state.selectedElement;
      selEl.setAttributeNS(null, "x", x + 0.1);
      this.setState({selectedElement: selEl});
      console.log(this.state.selectedElement);
    }
  }

  endDrag(e) {
    this.setState({selectedElement: null});
  }
  
  dragOver(e) {
    e.preventDefault();
  }

  

  render() {
    return (
      <div className="stacks">
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 20"
            onLoad={this.makeDraggable}>
          <rect x="4" y="5" 
                width="8" height="10"
                fill="#007bff"
                className="static"/>
          <rect x="18" y="5" 
                width="8" height="10"
                fill="#888"
                className="draggable"
                draggable="true"
                onDragStart={this.startDrag}
                onDrop={this.drop}
                onDragOver={this.dragOver}
                onDragEnd={this.endDrag}/>
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
}
