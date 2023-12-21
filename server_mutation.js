const express = require('express');
const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server-express');
const fs = require('fs').promises; // Import the 'fs' module

const app = express();

// Function to read data from the local JSON file
const readDataFromFile = async () => {
  try {
    const data = await fs.readFile('data.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error.message);
    return [];
  }
};

// Sample data
let users = [];

// GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(name: String!, email: String!): User
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    users: async () => {
      return new Promise(async (resolve) => {
        // Read data from the local JSON file
        const data = await readDataFromFile();

        if (data.length > 0) {
          console.log('Data fetched from file.');
          users = data; // Update the in-memory users array
          resolve(users);
        } else {
          console.log('No data found in file.');
          resolve([]);
        }
      });
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      return new Promise(async (resolve) => {
        // Read data from the local JSON file
        const data = await readDataFromFile();

        console.log('Adding user...');

        const newUser = {
          id: String(data.length + 1),
          name: args.name,
          email: args.email,
        };

        data.push(newUser);

        // Write the updated data back to the JSON file
        try {
          await fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf-8');
          console.log('Data written to file.');
          users = data; // Update the in-memory users array
          resolve(newUser);
        } catch (error) {
          console.error('Error writing data to file:', error.message);
          resolve(null);
        }
      });
    },
  },
};

// Create an executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Apollo Server configuration
const server = new ApolloServer({
  schema,
  cacheControl: {
    defaultMaxAge: 60, // Default cache duration in seconds
  },
});

server.applyMiddleware({ app });

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
});
