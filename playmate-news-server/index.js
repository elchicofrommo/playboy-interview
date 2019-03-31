// Declare imports

import {
    importSchema
} from 'graphql-import'
import {
    makeExecutableSchema
} from 'graphql-tools'
import {
    DateTime,
    NonPositiveInt,
    PositiveInt,
    NonNegativeInt,
    NegativeInt,
    NonPositiveFloat,
    PositiveFloat,
    NonNegativeFloat,
    NegativeFloat,
    EmailAddress,
    URL,
    PhoneNumber,
    PostalCode,
} from '@okgrow/graphql-scalars';

// now declare constants
const {
    ApolloServer,
    gql
} = require('apollo-server');
// id generator
let entryCount = 0

// in memory map of link entries
const entries = [{
    link: 'https://graphql.org/code/#javascript',
    description: "you can't see me",
    votes: 0,
    user: 'Mario',
    id: `${entryCount++}`,
    created: new Date()
}, {
    link: 'https://medium.com/codingthesmartway-com-blog/rest-vs-graphql-418eac2e3083',
    description: "you can't see me",
    votes: 0,
    user: 'Mario',
    id: `${entryCount++}`,
    created: new Date()
}, {
    link: 'https://www.npmjs.com/package/graphql',
    description: "you can't see me",
    votes: 0,
    user: 'Luigi',
    id: `${entryCount++}`,
    created: new Date()
}];

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    DateTime,
    NonPositiveInt,
    PositiveInt,
    NonNegativeInt,
    NegativeInt,
    NonPositiveFloat,
    PositiveFloat,
    NonNegativeFloat,
    NegativeFloat,
    EmailAddress,
    URL,
    PhoneNumber,
    PostalCode,
    Query: {
        entries: () => entries,
        search: (parent, args) => {
            return searchInEntries(args.pattern, entries)
        }
    },
    Mutation: {
        insertEntry: (parent, args) => {
            return insertEntry(args.link, args.description, args.user)
        }
    }
};

/** inserts an Entry into the in-memory map of entries
*/
function insertEntry(link, description, user) {
    var entry = {
        link: link,
        description: description,
        user: user,
        votes: 0,
        id: `${entryCount++}`,
        created: new Date()
        
    }
    entries.push(entry)
    
    console.log("pushed in another entry, link is " + link);
    return entry
}
/** searches all entries and returns an array of the entries that have pattern matches in either the link or description field
*/
function searchInEntries(pattern, entries) {

    console.log("search pattern is " + pattern)
    var len = entries.length,
        i = 0;
    var returnEntries = []
    for (; i < len; i++) {
        console.log('entry is ' + entries[i]  )
         if (entries[i].description.includes(pattern)) {
          console.log('matched by description ' )
          returnEntries.push(entries[i])
         } else if (entries[i].link.includes(pattern)) {
          console.log('matched by link ')
          returnEntries.push(entries[i])
         }
        
    }
    return returnEntries;
};

const typeDefs = importSchema('schmea.graphql');
// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
    typeDefs,
    resolvers
});
// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({
    url
}) => {
    console.log(`🚀  Server ready at ${url}`);
});