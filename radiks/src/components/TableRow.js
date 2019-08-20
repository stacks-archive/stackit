import React, { Component } from 'react';
import '../styles/TableRow.css'
import Status from './Status'

export default class TableRow extends Component {

  constructor(props) {
  	super(props);

  	this.state = {
      blockEdit: '',
      descEdit: ''
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.editBlockName = this.editBlockName.bind(this);
    this.editBlockDesc = this.editBlockDesc.bind(this);

  }

  handleChange(e) {
    const name = e.target.name; 
    const value = e.target.value;

    this.setState({
      [name]: value
    });
  }

  editBlockName() {
    const blockName = this.state.blockEdit;

    if (blockName !== '') {
      this.props.editBlockName(this.props.block._id, blockName)
    }

    this.setState({blockEdit: ''});
  }

  editBlockDesc() {
    const blockDesc = this.state.descEdit;
    console.log(blockDesc);

    if (blockDesc !== '') {
      this.props.editBlockDesc(this.props.block._id, blockDesc)
    }

    this.setState({descEdit: ''});
    console.log("reset state");
  }

  render() {
    const blockModel = this.props.block;
    const { block, description, deadline, completionMessage, collaborator, owner } = blockModel.attrs;
    var collab;
    if (collaborator === this.props.username) {
      collab = owner;
    }
    else {
      collab = collaborator;
    }

    return (
      <tr>
        <td>
        <a id="blackHref" data-toggle="collapse" href={"#description" + this.props.index} aria-expanded="false" aria-controls={"#description" + this.props.index}>{block}</a>
          <div className="collapse" id={"description" + this.props.index}>
            <div className="card card-body">
              {description} 
            </div>
          </div>
        </td>
        <td>{deadline}</td>
        <td>{collab}</td>
        <td>
           <Status index={this.props.index} 
                   id={this.props.block._id}
                   completeBlock={this.props.completeBlock}
                   completionMessage={completionMessage}
                   block={this.props.block}
                   username={this.props.username}/>
        </td>
        <td>
          <a id="blackHref" href="#" onClick={() => this.props.removeBlock(this.props.block._id)}>X</a>
        </td>
        <td>
        <a id="blackHref" data-toggle="collapse" href={"#editblock" + this.props.index} aria-expanded="false" aria-controls={"#editblock" + this.props.index}>Edit block</a>
        <div className="collapse" id={"editblock" + this.props.index}>
          <div className="card card-body">
            <textarea type="text" 
                    className="form-control" 
                    name="blockEdit" 
                    value={this.state.blockEdit}
                    onChange={this.handleChange}></textarea>
            <input onClick={this.editBlockName} type="submit" id="completeButton" className="btn btn-primary" value="Submit Edit"/>
          </div>
        </div>
        <br></br>
        <a id="blackHref" data-toggle="collapse" href={"#editdesc" + this.props.index} aria-expanded="false" aria-controls={"#editdesc" + this.props.index}>Edit description</a>
        <div className="collapse" id={"editdesc" + this.props.index}>
          <div className="card card-body">
            <textarea type="text" 
                    className="form-control" 
                    name="descEdit" 
                    value={this.state.descEdit}
                    onChange={this.handleChange}></textarea>
            <input onClick={this.editBlockDesc} type="submit" id="completeButton" className="btn btn-primary" value="Submit Edit"/>
          </div>
        </div>
        </td>
      </tr>
    );
  }
}
