import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import {ApolloProvider, ApolloConsumer, Query, Mutation} from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

let searchPattern = "coding";

// contains the Apollo query for getting all the news from the server
const AllNewsEntries = () => (

  <Query query ={gql("query { entries { link description user votes created id } }") }>

      {({ loading, error, data }) => {
      if (loading) return "<p>Loading...</p>";
      if (error) return  "<p>Error :(</p>";
      return outputNewsEntries(data.entries);
    }}
  </Query>
);

// contains the Apollo query for getting search reults from the server
const SearchNewsEntries = () => (

  <Query query ={gql("query { search(pattern: \""+searchPattern+"\") { link description user votes created id } }") }>

      {({ loading, error, data }) => {
      if (loading) return "<p>Loading...</p>";
      if (error) return  "<p>Error :(</p>";
      
      return outputSearchEntries(data.search);
    }}
  </Query>
);

// used to display either allnews entries or search results
let PlaymateNewsEntries =  AllNewsEntries;
let AddResults = () => {
  return "<p>No Add Yet</p>";
}

/**
Adds a new News entry to the playmante news board
*/
function addNewsEntry(){
  var addLink = this.refs.addLink.value;
  var addDescription = this.refs.addDescription.value;
  var addUser = this.refs.addUser.value;
}

/**
Function to run the search query and display results
*/
function runSearchQuery(){
  searchPattern = this.refs.searchTerm.value;


  PlaymateNewsEntries = SearchNewsEntries;
  ReactDOM.render(<App />, document.getElementById('root'));
}// end of function runSearchQuery

/* Function to clear search results and return to just the news feed
*/
function clearSearchResults(){
  PlaymateNewsEntries = AllNewsEntries;

  ReactDOM.render(<App />, document.getElementById('root'));
}

/* Function to run the search query and display results
*/
function outputSearchEntries(myMap){

  let temp = 
  React.createElement('div', { className: 'clearSearchDiv'},
    React.createElement('button', { onClick: clearSearchResults.bind(this)}, 'Clear Results')
  );
  let list = [temp];
  list.push(outputNewsEntries(myMap));

  return list;
}

/* Common function between search results and all news, displays both in the same format
*/
function outputNewsEntries(myMap){
     var returnString =  myMap.map(({ link, description,user, votes, created, id }, index, x) => (

        <div key={id} className="newsEntry">
          <div className="id">{ index + 1}</div>
          <div className="description"><a href={link}>{description}</a> </div>
          <div className="stats">{votes} points by {user} added on {(new Date(created)).toLocaleDateString()} {(new Date(created)).toLocaleTimeString()}</div>

        </div>

      ));

      return returnString; 
}


/** 
(/  --- not sure why, but this squence fixes my editor sytax so I'm leaving it in.
  Class for primary react component
*/
export default class App extends React.Component {

  addLink = "";
  addDescription = "";
  addUser = ""; 
  client = new ApolloClient({
    uri: "http://localhost:4000/"
  });

  /**
  Adds a new News entry to the playmante news board
  */
  addNewsEntry(){
    this.addLink = this.refs.addLink.value;
    this.addDescription = this.refs.addDescription.value;
    this.addUser = this.refs.addUser.value;


    var AddNewsEntry = (link, user, description) => {

      var myQuery = this.generateAddQuery();

      alert(myQuery);

      return (
  //<Query query ={gql("query { search(pattern: \""+searchPattern+"\") { link description user votes created id } }") }>

        <Mutation mutation={gql("mutation { insertEntry( link: $link,  description: $description, user:  $user){ link, description, user, votes, created, id } }") }>

            {({ loading, error, data }) => {
              if (loading) return "<p>Loading...</p>";
              if (error) return  "<p>Error</p>";

              return "<p>success</p>";
            }}
        </Mutation>

      );
    };

    alert("before the AddNewsEntry function prototype");
    AddResults = AddNewsEntry.call(this.addLink, this.addDescription, this.addUser);
    alert("after the AddNewsEntry function prototype");
   // ReactDOM.render(this, document.getElementById('root'));

  }

  generateAddQuery(){
      var addEntry = "mutation { insertEntry( link: \""+this.addLink+"\",  description: \""+this.addDescription+"\", user:  \""+this.addUser+"\"){ link, description, user, votes, created, id } }"
      return addEntry;
  }


  render() {
    return (
      <ApolloProvider client={client}>

      <div className="playmateNews">
        <div className="newsHeader">
          <img id="bunnyHeader" src="bunny-logo-feature-300.gif"/> PLAYMATE NEWS 
          <div className="searchBar"><button id="searchButton" onClick={runSearchQuery.bind(this)}>Search</button><input type="text" id="searchTerm" ref="searchTerm" ></input></div>
        </div>
        <div className="newsEntries">
        <PlaymateNewsEntries/>
        </div>

        <div className="newsHeader">
          ADD NEW NEWS 
        </div>

        <div className="addRow">
          <div className="addLabel">Description:</div>
          <input className="textInput" ref="addDescription"></input>
        </div>
        <div className="addRow">
          <div className="addLabel">Link: </div>
          <input className="textInput"  ref="addLink"></input>
        </div>
        <div className="addRow">
          <div className="addLabel">User Name:</div>
          <input className="textInput"  ref="addUser"></input>
        </div>
        <div className="addRow" >
          <button onClick={this.addNewsEntry.bind(this)}>Add</button>
        </div>
        <div className="addRow">
          <AddResults />
        </div>
      </div>


      </ApolloProvider>
    );
  }
}


