import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import posts from "../data/Post.js";
import comments from "../data/Comment.js";
import userData from "./user-seeds.json" with { type: "json" };
import postData from "./post-seeds.json" with { type: "json" };
import commentData from "./comment-seeds.json" with { type: "json" }; 
import { users } from "../config/mongoCollections.js";
import { User } from "../data/index.js";
import { ObjectId } from "mongodb";

const db = await dbConnection();
await seed();
await closeConnection();

async function seed() {
  await db.dropDatabase();
  try {
    await seedUsers();
    await seedPosts();
    await seedComments();
  } catch (e) {
    console.log(e);
  }
  console.log("Done seeding database");
}
async function seedUsers() {
  const userCollection = await users();
  if (!userCollection) {
    throw "Database error";
  }
  for (let i in userData) {
    try {
      const u = userData[i];
      const res = await User.create(
        u.username,
        u.email,
        u.password,
        u.isAdmin
      );
    const user1=await User.getByEmail(u.email);
    const filter = { _id: new ObjectId(user1._id) };
    const options = { upsert: false };
    const updateDoc = {
      $set: {
        phone: u.phone,
        avatar: {
          destination: "public/uploads/",
          filename: u.avatar
        },
      },
    };
    // Update the first document that matches the filter
    const result = await userCollection.updateOne(filter, updateDoc, options);
    if (!result.modifiedCount) {
      throw "error";
    }
      // console.log(res);
    } catch (e) {
      console.log(e);
    }
  }
}
async function seedPosts() {
  const us = await User.getAll();
  const lus = us.length;
  for (let i in postData) {
    try {
      const p = postData[i];
      p.author_id = us[i % lus]._id;
      const res = await posts.create(
        p.title,
        p.content,
        p.image,
        p.category,
        p.date,
        p.location,
        p.lostOrFound,
        p.author_id
      );
    } catch (e) {
      console.log(e);
    }
  }
}
async function seedComments() {
  const us = await User.getAll();
  const lus = us.length;
  const ps = await posts.getAllLatest();
  let lps = ps.length;
  for (let i in commentData) {
    try {
      const c = commentData[i];
      c.author_id = us[i % lus]._id;
      c.post_id = ps[i % lps]._id;
      const res = await comments.create(c.post_id, c.author_id, c.comment);
    } catch (e) {
      console.log(e);
    }
  }
}