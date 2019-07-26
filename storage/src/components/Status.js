import React, { Component } from 'react';
import {
  Person, doPublicKeysMatchIssuer,
} from 'blockstack';


function Pending(props) {
  return (
    <div>
      <p>Pending</p>
      <a id="blackHref" data-toggle="collapse" href={"#collapseSubmit" + props.index} aria-expanded="false" aria-controls={"#collapseSubmit" + props.index}>&#10004;</a>
      <div class="collapse" id={"collapseSubmit" + props.index}>
        <div class="card card-body">
          <textarea type="text" 
                  className="form-control" 
                  name="description" 
                  value={props.submitMessage}
                  onChange={props.handleChange}
                  placeholder="Enter a message to display on your completed block."></textarea>
          <input onClick={props.completeBlock} type="submit" id="completeButton" className="btn btn-primary" value="Complete"/>
        </div>
      </div>
    </div>
  );
}
  


function Complete(props) {
  return (
    <div>
      <a id="blackHref" data-toggle="collapse" href={"#collapseMessage" + props.index} aria-expanded="false" aria-controls={"#collapseMessage" + props.index}>Completed</a>
      <div class="collapse" id={"collapseMessage" + props.index}>
        <div class="card card-body">
          {props.block[4]}
        </div>
      </div>
    </div>
  )
}


export default class Status extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitMessage : ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.completeBlock = this.completeBlock.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({submitMessage: value});
  }

  completeBlock() {
    this.props.completeBlock(this.props.index, this.state.submitMessage);
    this.setState({submitMessage: ''});
  }
  

  render() {
    let status;
    const completed = this.props.block[3];
    if (completed) {
      status = <Complete block={this.props.block} index={this.props.index}/>;
    } else {
      status = <Pending block={this.props.block} 
                        index={this.props.index} 
                        completeBlock = {this.completeBlock}
                        handleChange = {this.handleChange} />
    }

    return (
      <div> 
        {status}
      </div>
    );
  }

 
}
