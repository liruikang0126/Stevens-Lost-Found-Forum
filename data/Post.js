import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import helper from "../utils/helpers.js";
import User from "./User.js";
import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
__dirname = __dirname.substring(0, __dirname.lastIndexOf("\\"));

const exportedMethods = {
  async create(
    title,
    content,
    image,
    category,
    date,
    location,
    lostOrFound,
    author_id
  ) {
    title = helper.checkString(title, 100, "title");
    content = helper.checkString(content, 2000, "content");
    category = helper.checkCategory(category);
    location = helper.checkLocation(location);
    date = helper.checkDate(date);
    lostOrFound = helper.checkLOF(lostOrFound);
    image = helper.checkImage(image);
    author_id = helper.checkId(author_id, "author_id");

    const user = await User.getByAuthorId(author_id);
    const author = user.username;
    const postCollection = await posts();
    const createdAt = new Date();
    const updatedAt = new Date();
    const newPost = {
      title,
      author_id: new ObjectId(author_id),
      author,
      content,
      image,
      category,
      date,
      location,
      lostOrFound,
      isCompleted: false,
      completer_id: null,
      createdAt,
      updatedAt,
      comments: [],
    };
    const insertInfo = await postCollection.insertOne(newPost);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add user";
    return { insertedPost: true };
  },
  async getAllLatest() {
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
  async getAllHottest() {
    const postCollection = await posts();
    let postList = await postCollection.find({}).toArray();
    postList.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    if (!postList) throw "Could not get all posts";
    postList = postList.map((e) => {
      return helper.stringifyPost(e);
    });
    return postList;
  },
  async getByFilter(lostOrFound, category, date1, date2, location) {
    category = helper.checkCategory(category);
    location = helper.checkLocation(location);
    date1 = helper.checkDate(date1);
    date2 = helper.checkDate(date2);
    lostOrFound = helper.checkLOF(lostOrFound);

    const postCollection = await posts();
    let postList = await postCollection.find({}).toArray();
    postList.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    postList = postList.filter((e) => {
      const date = new Date(e.date);
      const condition =
        e.lostOrFound == lostOrFound &&
        e.category == category &&
        date >= d1 &&
        date <= d2 &&
        e.location == location;
      return condition;
    });
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
      .sort({ createdAt: -1 })
      .toArray();
    postList = postList.map((e) => {
      return helper.stringifyPost(e);
    });
    return postList;
  },
  async update(
    postId,
    title,
    content,
    image,
    category,
    date,
    location,
    lostOrFound,
    author_id
  ) {
    postId = helper.checkId(postId, "postId");
    title = helper.checkString(title, 100, "title");
    content = helper.checkString(content, 2000, "content");
    author_id = helper.checkId(author_id, "author_id");
    category = helper.checkCategory(category);
    location = helper.checkLocation(location);
    date = helper.checkDate(date);
    lostOrFound = helper.checkLOF(lostOrFound);
    image = helper.checkImage(image);

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
      author_id,
      author: postToUpdate.author,
      content,
      image,
      category,
      date,
      location,
      lostOrFound,
      isCompleted: postToUpdate.isCompleted,
      completer_id: postToUpdate.completer_id,
      createdAt: postToUpdate.createdAt,
      updatedAt,
      comments: postToUpdate.comments,
    };
    newPost = helper.unstringifyPost(newPost);
    // update
    let updateInfo = await postCollection.findOneAndReplace(
      { _id: new ObjectId(postId) },
      newPost,
      { returnDocument: "after" }
    );
    if (!updateInfo)
      throw `Error: Update failed! Could not update post with id ${postId}`;
    updateInfo = helper.stringifyPost(updateInfo);

    // delete the previous image
    const deletePath = path.join(
      __dirname,
      `${postToUpdate.image.destination}${postToUpdate.image.filename}`
    );
    fs.unlink(deletePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          throw "Image does not exist.";
        } else {
          throw err;
        }
      }
    });

    return updateInfo;
  },
  async complete(postId, completer_id) {
    postId = helper.checkId(postId, "postId");
    completer_id = helper.checkId(completer_id, "completer_id");
    const postCollection = await posts();
    const postToUpdate = await this.getByPostId(postId);
    if (!postToUpdate) throw "Post not found";
    // update
    let updateInfo = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          isCompleted: true,
          completer_id: completer_id,
        },
      },
      { upsert: false }
    );
    if (!updateInfo.modifiedCount)
      throw `Error: Complete failed! Could not complete post with id ${postId}`;
    return { complete: true };
  },
  async destroy(postId) {
    postId = helper.checkId(postId, "postId");

    const post = await this.getByPostId(postId);
    const deletePath = path.join(
      __dirname,
      `${post.image.destination}${post.image.filename}`
    );
    // Asynchronously delete a file
    fs.unlink(deletePath, (err) => {
      if (err) {
        // Handle specific error if any
        if (err.code === "ENOENT") {
          throw "Image does not exist.";
        } else {
          throw err;
        }
      }
    });

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
