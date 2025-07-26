import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString , } from "graphql"

export const onePostResponse = new GraphQLObjectType({
  name:"AllPosts",
  fields:{
        content: {
            type:GraphQLString
        },
        attachments:{ type:new GraphQLList(new GraphQLObjectType({
          name:"attachments",
          fields:{
            secure_url:{type:GraphQLString},
            public_id:{type:GraphQLString}
          }
        }))},
        likes:{type:new GraphQLList(GraphQLID)},
        tags:{type:new GraphQLList(GraphQLID)},
        //comments:[{type:Types.ObjectId , ref:'Comment'}]
        createdBy:{type:GraphQLID},
        updateBy:{type:GraphQLID},
        deleteBy:{type:GraphQLID},
        isDeleted:{type:  GraphQLBoolean},
        _id:{type:GraphQLID},
        createdAt:{type:GraphQLString},
        updateAt:{type:GraphQLString},
  }
})
export const allPostResponse = new GraphQLList(onePostResponse)