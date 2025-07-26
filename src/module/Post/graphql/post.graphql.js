import { Post } from "../../../DB/model/Post.model.js";
export const allPosts = async (_, args, context) => {
  console.log({ context });
  const post = await Post.find().populate("user");
  return {
    success: true,
    statusCode: 200,
    results: post,
  };
};
export const onePost = async (_, args, context) => {
  const { id } = args;
  const post = await Post.findById(id);
  return {
    success: true,
    statusCode: 200,
    results: post,
  };
};
