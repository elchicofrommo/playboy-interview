import React, { Component } from 'react';
import {Query} from "react-apollo";
import {ALL_NEWS} from "./Queries";


/**
* Class for containing the All News GraphQL results
*/

export default class AllNews extends Component{

	constructor(postQuery){
		super(postQuery)
		this.postQuery = postQuery
	}

	render(){
	  return(
	    <Query 
	      query ={ALL_NEWS}
	      pollInterval={1000}>

	        {({ loading, error, data }) => {
	        if (loading) return "<p>Loading...</p>";
	        if (error) return  "<p>Error :(</p>";
	        return this.outputNewsEntries(data.entries);
	      }}
	    </Query>
	  );
	}

	/* Common function between search results and all news, displays both in the same format
	*/
	outputNewsEntries(myMap){
	     var returnString =  myMap.map(({ link, description,user, votes, created, id }, index, x) => (

	        <div key={id} className='newsEntry'>
	          <div className='id'>{index+1}</div>
	          <div className="description"><a href={link}>{description}</a> </div>
	          <div className="stats">{votes} points by {user} added on {(new Date(created)).toLocaleDateString()} {(new Date(created)).toLocaleTimeString()}</div>

	        </div>

	      ));

	      return returnString; 
	}

}