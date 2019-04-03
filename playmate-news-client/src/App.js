import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {ApolloProvider, ApolloConsumer, Query, Mutation} from "react-apollo";
import ApolloClient from "apollo-boost";
import {ALL_NEWS, SEARCH_NEWS, ADD_NEWS} from "./Queries";


const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

let searchPattern = "coding";
let addLink = "http://www.testlink.com"
let addDescription = "test description";
let addUser = "testUser";

let link = "http://www.woowoo.com"
let description = "mario test description";
let user = "mario";

// contains the Apollo query for getting all the news from the server
const AllNewsEntries = () => {

  return(
    <Query 
      query ={ALL_NEWS}
      pollInterval={500}>

        {({ loading, error, data }) => {
        if (loading) return "<p>Loading...</p>";
        if (error) return  "<p>Error :(</p>";
        return outputNewsEntries(data.entries);
      }}
    </Query>
  );
};

// contains the Apollo query for getting search reults from the server
const SearchNewsEntries = () => {


  let map : { [key: string]: string} = {};
  map["pattern"] = searchPattern;

  return(
    <Query 
      query ={ SEARCH_NEWS }
      variables = {map}
      >

        {({ loading, error, data }) => {
        if (loading) return "<p>Loading...</p>";
        if (error) return  "<p>Error :(</p>";
        
        return outputSearchEntries(data.search);
      }}
    </Query>
  );
};


/**
/
*/
const AddResultsFiller = () => {
  return React.createElement('div', { className: "newsHeader"}, 'Nothing added yet');
}

let AddResults= AddResultsFiller;

const AddNewsEntry = () => {

      let map : { [key: string]: string} = {};
      map["link"] = addLink;
      map["description"] = addDescription;
      map["user"] = addUser;

      alert("link is " + map["link"]);
      alert("description is " + map["description"]);
      alert("user is " + map["user"]);

      return (

        <Mutation 
          mutation={ADD_NEWS}
          variables={map}
          ignoreResults={false}
          client={client}>

            {({ loading, error, data , called, client}) => {

              if (loading) return React.createElement('div', { className: "newsHeader"}, 'Loading ...');
              if (error) return  React.createElement('div', { className: "newsHeader"}, '*** ERROR ***');

alert("loading is " + loading);
alert("error is " + error);
alert("data is " + data);
alert(" the mutate was called? " + called);
alert("the client shoudl be an object? " + client )
              return outputNewsEntries(data.insertEntry);
            }}
        </Mutation>

      );
    };

// used to display either allnews entries or search results
let PlaymateNewsEntries =  AllNewsEntries;


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


  user = "mario"
  description = "description"
  link = "http://www.test.com"

  variables : { [key: string]: string} = {};
  addEntryComplete (data){

    console.log("add is complete with " + data);

  }

  saveDescription(input){
    console.log("saving description: " + input )
    this.variables["addDescription"] = input;
    description = input;
    this.description = input;
  }
  saveLink(input){
    console.log("saving input: " + input )
    this.variables["addLink"] = input;
    link = input;
    this.link = input
  }

  saveUser(input){
    console.log("saving user: " + input )
    this.variables["addUser"] = input;
    user = input;
    this.user = input;
  }


  getVariables = ()=>{
    alert ("I'm in the getVariables")
    
    this.variables["link"] = this.addLink;
    this.variables["user"] = this.addUser;
    this.variables["myDescription"] = this.addDescription ;

   // let list = {this.link, this.description, this.user};



   // return list
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

        <Mutation mutation={ADD_NEWS} onCompleted={this.addEntryComplete.bind(this)}>
        {insertEntry=>(
          <form onSubmit={e=> {
            e.preventDefault();
           
            insertEntry({variables: {link, description, user} })
          }}>

            <div className="newsHeader">
              ADD NEW NEWS 
            </div>

            <div className="addRow">
              <div className="addLabel">Description:</div>
              <input className="textInput" ref="addDescription" onBlur={e=>(this.saveDescription(e.target.value))}></input>
            </div>
            <div className="addRow">
              <div className="addLabel">Link: </div>
              <input className="textInput"  ref="addLink" onBlur={e=>(this.saveLink(e.target.value))}></input>
            </div>
            <div className="addRow">
              <div className="addLabel">User Name:</div>
              <input className="textInput"  ref="addUser" onBlur={e=>(this.saveUser(e.target.value))}></input>
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


