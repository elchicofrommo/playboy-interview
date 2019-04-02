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
/
*/
const Filler = () => {
  return React.createElement('div', { }, '');
}

let AddResults= Filler;


// used to display either allnews entries or search results
let PlaymateNewsEntries =  AllNews;



/**
Function to run the search query and display results
*/
function runSearchQuery(){
  PlaymateNewsEntries = SearchNews;
  ReactDOM.render(<App />, document.getElementById('root'));
}// end of function runSearchQuery

/* Function to clear search results and return to just the news feed
*/
function clearSearchResults(){
  PlaymateNewsEntries = AllNews;
  ReactDOM.render(<App />, document.getElementById('root'));
}




/** 
(/  --- not sure why, but this squence fixes my editor sytax so I'm leaving it in.
  Class for primary react component
*/
export default class App extends React.Component {

  constructor(props){

    super(props)
    this.state = {
      user: '',
      description: '',
      link: ''
    }
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


  render() {


    return (
      <ApolloProvider client={client}>

      <div className="playmateNews">
        <div className="newsHeader">
          <img id="bunnyHeader" src="bunny-logo-feature-300.gif"/> PLAYMATE NEWS 
          <form onSubmit={ (e)=> {
            e.preventDefault(); 
            runSearchQuery();
          }}>
          <div className="searchBar">
            <button id="searchButton" >Search</button>
            <input type="text" onChange={(event) => this.handleSearchInput(event)} ></input>
          </div>
          </form>
        </div>
        <div className="newsEntries">
        <PlaymateNewsEntries/>
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
              <AddResults />
            </div>
          </form>

        )}

        </Mutation>
      </div>


      </ApolloProvider>
    );
  }
}


