import React, { Component } from 'react';
import '../styles/About.css'
export default class Signin extends Component {

  render() {
    return (
      <div className="about">
        <h2 align="left">About this app</h2>
          <p align="left">
            Stackit is a tutorial app for Blockstack meant to demonstrate its app generator;
            authentication process; storage (Gaia); and a framework for indexing, querying, and 
            sharing data (Radiks).
          </p>
          <p align="left">
            The app is made for gamified collaboration. Users can create blocks, invite others
            to share a block, and complete them together. Users can view their completed, stacked
            blocks on their stacks page and view a page with all users' anonymized, completed blocks.
            Users can also advertise a public for another user to pick up as a collaborator.
          </p>
          <p align="left">
            The accompanying Blockstack tutorial for this app walks users through exactly how
            to create Stackit, starting from the default Hello, Blockstack app generator and
            ending with this very product. 
            The source code for this app is <a href="https://github.com/blockstack/stackit">here.</a>
          </p>
        <br></br>
        <h2 align="left">About the creator</h2>
        <p align="left">
            Hi! I'm Sahana Srinivasan. I was Blockstack's first intern and worked there summer 2019,
            after my freshman year in college, as a software
            engineering intern. After spending the first half of the summer minifying, updating, and 
            debugging existing Blockstack sample apps and familiarizing myself with Blockstack's features,
            I developed this app as a capstone project to the summer with the intention of creating
            a more comprehensive, walkthrough Blockstack tutorial app. You can check out other things
            I've worked on <a href="https://github.com/Sahana-Srinivasan">here.</a>
          </p>
      </div>
    );
  }
}
