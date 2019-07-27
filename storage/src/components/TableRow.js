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
    //this.handleChange = this.handleChange.bind(this);
    //this.completeBlock = this.completeBlock.bind(this);
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

  //handleChange(e) {
  //  const value = e.target.value;
//
  //  this.setState({
  //    submitMessage: value
  //  });
  //};

  //completeBlock() {
  //  this.props.completeBlock(this.props.index, this.state.submitMessage)
  //  this.setState({submitMessage: ''});
  //}

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
