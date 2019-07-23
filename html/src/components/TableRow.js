import React, { Component } from 'react';
import '../styles/BlockTable.css'

export default class TableRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <tr>
        <th scope="row">{this.props.index+1}</th>
        <td>{this.props.block[0]}</td>
        <td>{this.props.block[2]}</td>
        <td>{this.props.block[2]}</td>
        <td>{this.props.block[3]?'Complete':'Pending'}</td>
      </tr>
    );
  }
}