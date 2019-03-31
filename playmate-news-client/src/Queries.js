import { gql } from 'apollo-boost'

export const ALL_NEWS = gql `query { 
        entries 
        { 
          link 
          description 
          user 
          votes 
          created 
          id 
        } 
      }`

 export const SEARCH_NEWS = gql `query seach($pattern: String!) { 
        search( 
          pattern: $pattern
        ) 
        { 
          link 
          description 
          user 
          votes 
          created 
          id 
        } 
      }`

export const ADD_NEWS = gql `mutation insertEntry
	(
		$link: String!
		$description: String!
		$user: String!
	){ 
        insertEntry
        ( 
          link: $link  
          description: $description
          user:  $user 
        )
        { 
          link 
          description 
          user 
          votes 
          created 
          id
        } 
      }`