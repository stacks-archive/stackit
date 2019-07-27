import React, { Component } from 'react';
import '../styles/TableRow.css'
import Status from './Status'

export default class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      block: '',
      description: '',
      deadline: '',
      collaborators: '',
      completed: false,
      completionMessage: '',
    }

    this.loadBlock = this.loadBlock.bind(this);
  }

  async loadBlock() {
    const id = this.props.block._id;
    const block = await BlockTest.findById(id);
    const { block, description, deadline, 
            collaborators, completed, completionMesssage } = block.attrs;
    this.setState({ block, description, deadline, collaborators,
                    completed, completionMessage });
  } 

  componentWillMount() {
    this.loadBlock();
  }

  render() {
    return (
      <tr>
        <td>
        <a id="blackHref" data-toggle="collapse" href={"#description" + this.props.index} aria-expanded="false" aria-controls={"#description" + this.props.index}>{this.state.block}</a>
          <div class="collapse" id={"description" + this.props.index}>
            <div class="card card-body">
              {this.state.description} 
            </div>
          </div>
        </td>
        <td>{this.state.deadline}</td>
        <td></td>
        <td>
           <Status completed={this.state.completed} 
                   index={this.props.index} 
                   id={this.props.block._id}
                   completeBlock={this.props.completeBlock}
                   completionMessage={this.state.completionMessage}/>
        </td>
        <td>
          <a id="blackHref" href="#" onClick={() => this.props.removeBlock(this.props.index)}>X</a>
        </td>
      </tr>
    );
  }
}
