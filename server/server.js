const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // optional if you're using express.json()
const schema = require('./Schema/schema'); // GraphQL schema
const authMiddleware = require('./auth');

// Mongo URI (replace with env variable in production)
const MONGO_URI = 'mongodb+srv://patil311299:A6FOHzVLUuqJnWId@cluster0.ieupq.mongodb.net/Movie_Recommendation?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGO_URI) {
  throw new Error('You must provide a Mongo Atlas URI');
}

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json()); // or use app.use(express.json());

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('✅ Connected to Mongo Atlas instance.'))
  .on('error', (error) =>
    console.log('❌ Error connecting to Mongo Atlas:', error)
  );

const server = new ApolloServer({
  schema,
  context: ({ req }) => authMiddleware(req), // Add authentication context
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();

module.exports = app;
