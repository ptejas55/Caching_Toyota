const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');

const app = express();

// Read data from a local JSON file
const rawData = fs.readFileSync('data.json');
const dataset = JSON.parse(rawData);

const typeDefs = gql`
  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
  }

  type User {
    id: ID!
    name: String
    email: String
  }
`;

const resolvers = {
  Query: {
    getUser: (parent, { id }, context, info) => {
      // Simulating a delay for illustrative purposes
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = context.dataset.find((user) => user.id === id);
          resolve(user);
        }, 100);
      });
    },
    getAllUsers: (parent, args, context, info) => {
      // Simulating a delay for illustrative purposes
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(context.dataset);
        }, 100);
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ dataset }),
});
async function initializeServer() {
    try {
      // Start the server
      await server.start();
  
      // Apply middleware after the server has started
      server.applyMiddleware({app});
  
      // Now you can continue with other server-related tasks
      // or start handling requests, etc.
    } catch (error) {
      console.error('Error initializing the server:', error);
    }
  }
  
  // Call the function to initialize the server
  initializeServer();
  
// server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
