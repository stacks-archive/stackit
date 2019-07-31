import React, { Component } from 'react';
import '../styles/TableRow.css'

export default class InviteRow extends Component {

  render() {
    const blockModel = this.props.preview;
    console.log("made it to InviteRow");
    console.log(blockModel);
    //const { block, description, deadline, owner, invitationId, blockGroupId } = blockPreviewModel.attrs;
    const { block, description, deadline, owner } = blockModel.attrs;
    return (
      <tr>
        <td>{block}</td>
        <td>{description}</td>
        <td>{deadline}</td>
        <td>{owner}
        </td>
        <td>
          <a id="blackHref" href="/" onClick={() => this.props.acceptBlock(this.props.preview._id)}>Accept</a>
        </td>
      </tr>
    );
  }
}
