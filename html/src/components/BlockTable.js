import React, { Component } from 'react';
import '../styles/BlockTable.css'
import TableRow from './TableRow'

export default class BlockTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <table className="table table-hover">
        <thead className="thead">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Block</th>
            <th scope="col">Deadline</th>
            <th scope="col">Collaborator(s)</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {this.props.blocks.map((block, i) =>
            <TableRow block={block} index={i} />
          )}
        </tbody>
      </table>
    );
  }
}