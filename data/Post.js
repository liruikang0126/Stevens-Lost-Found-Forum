import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import helper from "../utils/helpers.js";
import User from "./User.js";

const exportedMethods = {

  //创建
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

  //获取
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

  //编辑
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

  //删除
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


  //声明认领
  async claimPost11(postId, userId) {
    postId = helper.checkId(postId, "postId");

    const postCollection = await posts();
    // 验证请求者是否有权领取该物品
    const post = await postCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      throw "Post not found";
    }
    if (post.author_id.toString() !== userId.toString() && !post.claimed) {
      throw "Unauthorized to claim this post";
    }
    const updateInfo = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { claimed: { claimedBy: new ObjectId(userId), claimedAt: new Date() } } }
    );
    if (!updateInfo.matchedCount) {
      throw "Could not claim post";
    }
    return { postId: postId, claimed: true, claimedBy: userId, claimedAt: new Date() };
  },


  //claim
  async claimPost(postId, userId) {

    postId = helper.checkId(postId, "postId");
    const postCollection = await posts(); // Get the posts collection
    const post = await postCollection.findOne({ _id: new ObjectId(postId) });

    // Check if the post exists
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the post is already completed
    if (post.isCompleted) {
      throw new Error("This item has already been claimed");
    }

    // Authorization check: Ensure only the original poster or a designated finder can claim the item
    if (post.author_ID !== userId) {
      throw new Error("Unauthorized to claim this post");
    }

    // Update the post to mark it as completed and record the completer
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          isCompleted: true,
          Completer_ID: userId,  // Assuming userID is a string; adjust type if necessary
          status: "claimed"  // Optionally update the status if you maintain such a field
        }
      }
    );

    if (!updateResult.matchedCount) {
      throw new Error("Could not update the post");
    }

    return {
      postId: postId,
      isCompleted: true,
      Completer_ID: userId,
      status: "claimed"
    };
  }



};

export default exportedMethods;
