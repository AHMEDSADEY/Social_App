
import { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import * as PostGraphServices from "./post.graphql.js";
import { allPostResponse, onePostResponse } from "./types/post.types.response.js";
import { onePostRequest } from "./types/post.types.request.js";

export const postQuery = {
  onePost:{
    type:new GraphQLObjectType({
      name:"onePostResponse",
      fields:{
          success:{type:GraphQLBoolean},
          statusCode:{type:GraphQLInt},
          results:{type:onePostResponse}
        }
    }),
    args:onePostRequest,
    resolve:PostGraphServices.onePost
  },
  allPost:{
    type:new GraphQLObjectType({
      name:"allPostResponse",
      fields:{
        success:{type:GraphQLBoolean},
        statusCode:{type:GraphQLInt},
        results:{type:allPostResponse}
      }
    }),
    resolve:PostGraphServices.allPosts,
  }
}