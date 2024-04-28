import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import helper from "../utils/helpers.js";
import User from "./User.js";

const exportedMethods = {
  async create(title, content, author_id) {
    title = helper.checkString(title, 100, "title");
    content = helper.checkString(content, 2000, "content");
    author_id = helper.checkId(author_id, "author_id");
    const user = await User.getByAuthorId(author_id);
    const author = user.username;
    const postCollection = await posts();
    const createdAt = new Date();
    const updatedAt = new Date();
    const newPost = {
      title,
      content,
      author_id: new ObjectId(author_id),
      author,
      createdAt,
      updatedAt,
      comments: [],
    };
    const insertInfo = await postCollection.insertOne(newPost);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add user";
    return { insertedPost: true };
  },
  async getAll() {
    const postCollection = await posts();
    let postList = await postCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    if (!postList) throw "Could not get all posts";
    postList = postList.map((e) => {
      return helper.stringifyPost(e);
    });
    return postList;
  },
  async getByPostId(postId) {
    postId = helper.checkId(postId, "postId");
    const postCollection = await posts();
    let post = await postCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) throw "No post with that id";
    post = helper.stringifyPost(post);
    return post;
  },
  async getByAuthorId(author_id) {
    const id = helper.checkId(author_id, "author_id");
    const postCollection = await posts();
    let postList = await postCollection
      .find({ author_id: new ObjectId(id) })
      .toArray();
    postList = postList.map((e) => {
      return helper.stringifyPost(e);
    });
    return postList;
  },
  async update(postId, title, content, author_id) {
    postId = helper.checkId(postId, "postId");
    title = helper.checkString(title, 100, "title");
    content = helper.checkString(content, 2000, "content");
    author_id = helper.checkId(author_id, "author_id");
    const postCollection = await posts();
    const postToUpdate = await this.getByPostId(postId);
    if (!postToUpdate) throw "Post not found";
    if (author_id !== postToUpdate.author_id) {
      throw "You are not the post owner, therefore you are not allowed to edit this post";
    }
    let updatedAt = new Date();
    let newPost = {
      _id: postToUpdate._id,
      title,
      content,
      author_id,
      createdAt: postToUpdate.createdAt,
      updatedAt,
      comments: postToUpdate.comments,
    };
    newPost = helper.unstringifyPost(newPost);
    let updateInfo = await postCollection.findOneAndReplace(
      { _id: new ObjectId(postId) },
      newPost,
      { returnDocument: "after" }
    );
    if (!updateInfo)
      throw `Error: Update failed! Could not update post with id ${postId}`;
    updateInfo = helper.stringifyPost(updateInfo);
    return updateInfo;
  },
  async destroy(postId) {
    postId = helper.checkId(postId, "postId");
    const postCollection = await posts();
    const deletionInfo = await postCollection.findOneAndDelete({
      _id: new ObjectId(postId),
    });
    if (!deletionInfo) {
      throw `Could not delete post with id of ${postId}`;
    }
    return { _id: deletionInfo._id.toString(), deleted: true };
  },
};

export default exportedMethods;
