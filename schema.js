const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema } = require('graphql')
const axios = require('axios')


//Launch Type
//This type is the information we need to request from our API
const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType }
  })
})

//Create relationships within Schema
//Notice the value to the type key in the rocket object


const RocketType = new GraphQLObjectType({
  name: 'Rocket',
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString }
  })
})

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'Root',
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        //In here we put the endpoint we need to hit
        //With GraphQL we only need to hit one endpoint 
        return axios.get('https://api.spacexdata.com/v3/launches')
          .then(res => res.data)
      }
    },
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
          .then(res => res.data)
      }
    }
  }
})


//Export our schema
module.exports = new GraphQLSchema({
  //Pass along our Rootquery
  query: RootQuery
})