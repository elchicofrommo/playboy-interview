import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {ApolloProvider, ApolloConsumer, Query, Mutation} from "react-apollo";
import ApolloClient from "apollo-boost";
import {ALL_NEWS, SEARCH_NEWS, ADD_NEWS} from "./Queries";
import AllNews from "./AllNews";
import SearchNews from "./SearchNews";


const client = new ApolloClient({
  uri: "http://localhost:4000/"
});





/** 
(/  --- not sure why, but this squence fixes my editor sytax so I'm leaving it in.
  Class for primary react component
*/
export default class App extends React.Component {


  /**
  /
  */
  Filler = () => {
    return React.createElement('div', { }, '');
  }

  AddResults = this.Filler;


  // used to display either allnews entries or search results
  PlaymateNewsEntries =  AllNews;






  constructor(props){

    super(props)
    this.state = {
      user: '',
      description: '',
      link: ''
    }
    this.clearSearchResults = this.clearSearchResults.bind(this);
  }


  addEntryComplete (data){

    console.log("add is complete with " + data);

  }


  handleUserInput (e) {

    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value});

  }

  handleSearchInput(e) {

    SearchNews.handleUserInput(e);
  }

  /**
  Function to run the search query and display results
  */
  runSearchQuery(){
    this.PlaymateNewsEntries = SearchNews;
    ReactDOM.render(<App />, document.getElementById('root'));
  }// end of function runSearchQuery

  /* Function to clear search results and return to just the news feed
  */
  clearSearchResults(){

    console.log("clearing search restuls")
    this.PlaymateNewsEntries = AllNews;
    ReactDOM.render(<App />, document.getElementById('root'));
  }


  render() {


    return (
      <ApolloProvider client={client}>

      <div className="playmateNews">
        <div className="newsHeader">
          <img id="bunnyHeader" src="bunny-logo-feature-300.gif"/> PLAYMATE NEWS 
          <form onSubmit={ (e)=> {
            e.preventDefault(); 
            this.runSearchQuery();
          }}>
          <div className="searchBar">
            <button id="searchButton" >Search</button>
            <input type="text" onChange={(event) => this.handleSearchInput(event)} ></input>
          </div>
          </form>
        </div>
        <div className="newsEntries">
        <this.PlaymateNewsEntries postQuery={this.clearSearchResults}/>
        </div>

        <Mutation mutation={ADD_NEWS} onCompleted={this.addEntryComplete.bind(this)} variables={this.state}>
        {insertEntry=>(
          <form onSubmit={e=> {
            e.preventDefault();
           
            insertEntry()
          }}>

            <div className="newsHeader">
              ADD NEW NEWS 
            </div>

            <div className="addRow">
              <div className="addLabel">Description:</div>
              <input className="textInput" name="description" value={this.description} onChange={(event) => this.handleUserInput(event)}></input>
            </div>
            <div className="addRow">
              <div className="addLabel">Link: </div>
              <input className="textInput"  name="link" value={this.link} onChange={(event) => this.handleUserInput(event)}></input>
            </div>
            <div className="addRow">
              <div className="addLabel">User Name:</div>
              <input className="textInput"  name="user" value={this.user } onChange={(event) => this.handleUserInput(event)} ></input>
            </div>
            <div className="addRow" >
              <button>Add</button>
            </div>
            <div className="addRow">
              <this.AddResults />
            </div>
          </form>

        )}

        </Mutation>
      </div>


      </ApolloProvider>
    );
  }
}


