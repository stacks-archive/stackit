import React, { Component } from 'react';
import '../styles/BlockTable.css'
import TableRow from './TableRow'

export default class BlockTable extends Component {
  render() {

    // <th scope="col">#</th>

    return (
      <table className="table table-hover">
        <thead className="thead">
          <tr>
            <th scope="col">Block</th>
            <th scope="col">Deadline</th>
            <th scope="col">Collaborator(s)</th>
            <th scope="col">Status</th>
            <th scope="col">Remove</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {this.props.blocks.map((block, i) =>
            <TableRow block={block} 
                      index={i} 
                      removeBlock={this.props.removeBlock}
                      completeBlock={this.props.completeBlock}
                      username={this.props.username}
                      editBlockName={this.props.editBlockName}
                      editBlockDesc={this.props.editBlockDesc}/>
          )}
        </tbody>
      </table>
    );
  }
}