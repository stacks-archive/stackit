import React, { Component } from 'react';


function Waiting() {
  return (
    <div>
      <p>Waiting for collaborator to accept</p>
    </div>
  );
}
  


function Accept(props) {
  return (
    <div>
      <a id="blackHref" href="#" onClick={() => props.acceptBlock(props.id)}>Accept</a>
    </div>
  )
}


export default class InviteStatus extends Component {
  render() {
    let status;
    const owned = (this.props.owner === this.props.username);
    if (owned) {
      status = <Waiting />;
    } else {
      status = <Accept id={this.props.id}
                       acceptBlock={this.props.acceptBlock} />
    }

    return (
      <div> 
        {status}
      </div>
    );
  }
}
