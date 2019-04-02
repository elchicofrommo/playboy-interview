import React, { Component } from 'react';
import {Query} from "react-apollo";
import {SEARCH_NEWS} from "./Queries";
import AllNews from "./AllNews"

/**
* Class for containing the All News GraphQL results
*/

let counter = 0;

export default class SearchNews extends Component {

	static state = {
      pattern: 'coding'
    }

	constructor(props){
		super(props)
	    console.log("created a new SearchNews object, counter is at " + ++counter);
	}

	static handleUserInput (e) {

	    const name = e.target.name;
	    const value = e.target.value;
	    
	    SearchNews.state['pattern'] = value;
	    console.log("handling event inside SearchNews, settign the state to " + SearchNews.state['pattern']);

	}

	/* Common function between search results and all news, displays both in the same format
	*/
	outputNewsEntries(myMap){


	     var returnString =  myMap.map(({ link, description,user, votes, created, id }, index, x) => (

	        <div key={id} className='newsEntry'>
	          <div className='id'>{index+1}</div>
	          <div className="description"><a href={link}>{description}</a> blah blah blah</div>
	          <div className="stats">{votes} points by {user} added on {(new Date(created)).toLocaleDateString()} {(new Date(created)).toLocaleTimeString()}</div>

	        </div>

	      ));

	      return returnString; 
	}

	render(){

	  return(
	    <Query query ={SEARCH_NEWS} variables = {SearchNews.state}>

	        {({ loading, error, data }) => {
	        if (loading) return "<p>Loading...</p>";
	        if (error) return  "<p>Error :(</p>";
	        
	        return this.outputNewsEntries(data.search);
	      }}
	    </Query>
	  );
	}



}


