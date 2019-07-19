import React, { Component } from 'react';
import '../styles/BlockTable.css'

export default class TableRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <tr>
        <th scope="row">1</th>
        <td>Hello</td>
        <td>Block</td>
        <td>Testing</td>
        <td>Testing</td>
      </tr>
    );
  }
}