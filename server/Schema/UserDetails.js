const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt
  } = require('graphql');


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString},
        name: { type: GraphQLString},
        mail_id: { type: GraphQLString},
        // DOB: { type: GraphQLString},
        password: { type: GraphQLString}
    })
  });

  module.exports = UserType;