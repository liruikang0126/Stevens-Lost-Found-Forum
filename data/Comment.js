import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import helper from "../utils/helpers.js";
import Post from "./Post.js";
import User from "./User.js";

const exportedMethods = {
  // If you’re allowing the user to leave comments, each user should only be able to leave one comment.
  // This is so if someone is pissed off, they can’t spam your comments and skew the results.
  // Instead, give them the option to edit their existing comment in case they change their mind.
  async create(postId, author_id, content) {
    postId = helper.checkId(postId, "postId");
    author_id = helper.checkId(author_id, "author_id");
    content = helper.checkString(content, 2000, "content");
    const createdAt = new Date();
    const updatedAt = new Date();
    const postCollection = await posts();
    await Post.getByPostId(postId);
    await User.getByAuthorId(author_id);
    let newComment = {
      _id: new ObjectId(),
      postId,
      author_id,
      content,
      createdAt,
      updatedAt,
    };
    let newPost = await postCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $push: { comments: newComment } },
      { returnDocument: "after" }
    );
    if (!newPost) throw `Could not create the comment with postId ${postId}`;
    newPost = helper.stringifyPost(newPost);
    return newPost;
  },
  async getByCommentId(commentId) {
    commentId = helper.checkId(commentId, "commentId");
    const postCollection = await posts();
    let res = await postCollection.findOne({
      "comments._id": new ObjectId(commentId),
    });
    if (!res) {
      throw `could not find a comment with the commentId of ${commentId}`;
    }
    let rs = res.comments;
    let result = rs.filter((e) => {
      return e._id.toString() === commentId;
    });
    result[0]._id = result[0]._id.toString();
    return result[0];
  },
  async destroy(commentId) {
    commentId = helper.checkId(commentId, "commentId");
    let oldComment = await this.getByCommentId(commentId);
    oldComment._id = new ObjectId(oldComment._id);
    const postCollection = await posts();
    let findDocuments = {
      "comments._id": new ObjectId(commentId),
    };
    let updateInfo = await postCollection.findOneAndUpdate(
      findDocuments,
      { $pull: { comments: oldComment } },
      { returnDocument: "after" }
    );
    if (!updateInfo)
      throw `Error: Could not delete the comment with id of ${commentId}`;
    updateInfo = helper.stringifyPost(updateInfo);
    return updateInfo;
  },
  async getAll() {
    const postCollection = await posts();
    let postList = await postCollection.find({}).toArray();
    if (!postList) throw "Could not get all posts";
    let commentList = postList
      .map((e) => {
        e = helper.stringifyPost(e);
        return e.comments;
      })
      .flat(1);
    return commentList;
  },
};

export default exportedMethods;
