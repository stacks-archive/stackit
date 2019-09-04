import React, { Component } from 'react';
import '../styles/TableRow.css'
import Status from './Status'

export default class TableRow extends Component {

  render() {
    return (
      <tr>
        <td>
        <a id="blackHref" data-toggle="collapse" href={"#description" + this.props.index} aria-expanded="false" aria-controls={"#description" + this.props.index}>{this.props.block[0]}</a>
          <div class="collapse" id={"description" + this.props.index}>
            <div class="card card-body">
              {this.props.block[1]}
            </div>
          </div>
        </td>
        <td>{this.props.block[2]}</td>
        <td></td>
        <td>
           <Status block={this.props.block} index={this.props.index} completeBlock={this.props.completeBlock}/>
        </td>
        <td>
          <a id="blackHref" href="#" onClick={() => this.props.removeBlock(this.props.index)}>X</a>
        </td>
      </tr>
    );
  }


}
