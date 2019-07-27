import React, { Component } from 'react';
import '../styles/TableRow.css'
import Status from './Status'

export default class TableRow extends Component {

  render() {
    const blockModel = this.props.block;
    const { block, description, deadline, completionMessage } = blockModel.attrs;
    return (
      <tr>
        <td>
        <a id="blackHref" data-toggle="collapse" href={"#description" + this.props.index} aria-expanded="false" aria-controls={"#description" + this.props.index}>{block}</a>
          <div class="collapse" id={"description" + this.props.index}>
            <div class="card card-body">
              {description} 
            </div>
          </div>
        </td>
        <td>{deadline}</td>
        <td></td>
        <td>
           <Status index={this.props.index} 
                   id={this.props.block._id}
                   completeBlock={this.props.completeBlock}
                   completionMessage={completionMessage}
                   block={this.props.block}/>
        </td>
        <td>
          <a id="blackHref" href="#" onClick={() => this.props.removeBlock(this.props.block._id)}>X</a>
        </td>
      </tr>
    );
  }
}
