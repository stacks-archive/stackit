import React, { Component } from 'react';
import '../styles/TableRow.css'
import Status from './Status'

export default class TableRow extends Component {

  render() {
    const blockModel = this.props.block;
    const { block, description, deadline, completionMessage, collaborator, owner } = blockModel.attrs;
    var collab;
    if (collaborator === this.props.username) {
      collab = owner;
    }
    else {
      collab = collaborator;
    }

    return (
      <tr>
        <td>
        <a id="blackHref" data-toggle="collapse" href={"#description" + this.props.index} aria-expanded="false" aria-controls={"#description" + this.props.index}>{block}</a>
          <div className="collapse" id={"description" + this.props.index}>
            <div className="card card-body">
              {description} 
            </div>
          </div>
        </td>
        <td>{deadline}</td>
        <td>{collab}</td>
        <td>
           <Status index={this.props.index} 
                   id={this.props.block._id}
                   completeBlock={this.props.completeBlock}
                   completionMessage={completionMessage}
                   block={this.props.block}
                   username={this.props.username}/>
        </td>
        <td>
          <a id="blackHref" href="/" onClick={() => this.props.removeBlock(this.props.block._id)}>X</a>
        </td>
      </tr>
    );
  }
}
