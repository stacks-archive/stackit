import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import '../styles/CreateBlock.css'
import InviteRow from './InviteRow'


const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Invitations extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
      }, 
    };    
  }


  render() {
    const profile = this.props.userSession.loadUserData();
    const username = profile.username; 
    return (
      <div className="col-sm-11">
        <table className="table table-hover">
          <thead className="thead">
            <tr>
              <th scope="col">Block</th>
              <th scope="col">Description</th>
              <th scope="col">Deadline</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {this.props.previews.map((preview, i) =>
              <InviteRow preview={preview}
                         acceptBlock={this.props.acceptBlock}
                         username={username} />
            )}
            {this.props.publicBlocks.map((preview, i) =>
              <InviteRow preview={preview}
                         acceptBlock={this.props.pickUpBlock}
                         username={username} />
            )}
          </tbody>
      </table>
      </div>
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }
}
