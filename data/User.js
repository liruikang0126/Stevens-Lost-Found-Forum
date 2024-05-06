import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import helper from "../utils/helpers.js";
import bcrypt from "bcrypt";

const saltRounds = 6;
const exportedMethods = {
  async create(username, email, password, isAdmin) {
    username = helper.checkUsername(username);
    email = helper.checkEmail(email);
    password = helper.checkPassword(password);
    isAdmin = helper.checkIsAdmin(isAdmin);
    const userCollection = await users();
    if (!userCollection) {
      throw "Database error";
    }
    const findEmail = await userCollection.findOne({
      email: email,
    });
    if (findEmail) {
      throw "Email address supplied is already in the database";
    }
    const hash = await bcrypt.hash(password, saltRounds);
    let newUser = {
      username,
      email,
      password: hash,
      isAdmin,
      avatar: {
        destination: "public/uploads/",
        filename: "default.jpg",
      },
      phone: undefined,
      friends: [],
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add user";
    return { insertedUser: true };
  },
  async update(id, username, phone, avatar) {
    id = helper.checkId(id, "userId");
    username = helper.checkUsername(username);
    phone = helper.checkPhone(phone);
    avatar = helper.checkImage(avatar);
    const userCollection = await users();
    if (!userCollection) {
      throw "Database error";
    }
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: false };
    const updateDoc = {
      $set: {
        username: username,
        phone: phone,
        avatar: avatar,
      },
    };
    // Update the first document that matches the filter
    const result = await userCollection.updateOne(filter, updateDoc, options);
    if (!result.modifiedCount) {
      throw "error";
    }
    return true;
  },
  async addFriends(id1, id2) {
    id1 = helper.checkId(id1, "userId");
    id2 = helper.checkId(id2, "friendId");
    const userCollection = await users();
    if (!userCollection) {
      throw "Database error";
    }
    const filter = { _id: new ObjectId(id1) };
    const options = { upsert: false };
    const updateDoc = {
      $push: {
        friends: id2,
      },
    };
    // Update the first document that matches the filter
    const result = await userCollection.updateOne(filter, updateDoc, options);
    if (!result.modifiedCount) {
      throw "error";
    }
    const filter2 = { _id: new ObjectId(id2) };
    const updateDoc2 = {
      $push: {
        friends: id1,
      },
    };
    // Update the first document that matches the filter
    const result2 = await userCollection.updateOne(
      filter2,
      updateDoc2,
      options
    );
    if (!result2.modifiedCount) {
      throw "error";
    }
    return true;
  },
  async deleteFriends(id1, id2) {
    id1 = helper.checkId(id1, "userId");
    id2 = helper.checkId(id2, "friendId");
    const userCollection = await users();
    if (!userCollection) {
      throw "Database error";
    }
    const filter = { _id: new ObjectId(id1) };
    const options = { upsert: false };
    const updateDoc = {
      $pull: {
        friends: id2,
      },
    };
    // Update the first document that matches the filter
    const result = await userCollection.updateOne(filter, updateDoc, options);
    if (!result.modifiedCount) {
      throw "error";
    }
    const filter2 = { _id: new ObjectId(id2) };
    const updateDoc2 = {
      $pull: {
        friends: id1,
      },
    };
    // Update the first document that matches the filter
    const result2 = await userCollection.updateOne(
      filter2,
      updateDoc2,
      options
    );
    if (!result2.modifiedCount) {
      throw "error";
    }
    return true;
  },
  // Login using email
  // return the user object (_id returned in the form of string)
  async getByEmail(email) {
    email = helper.checkEmail(email);
    const userCollection = await users();
    const findEmail = await userCollection.findOne({
      email: email,
    });
    if (!findEmail) {
      return false;
    }
    findEmail._id = findEmail._id.toString();
    return findEmail;
  },
  async getByAuthorId(author_id) {
    author_id = helper.checkId(author_id, "author_id");
    const userCollection = await users();
    const find = await userCollection.findOne({
      _id: new ObjectId(author_id),
    });
    if (!find) {
      throw "AuthorId supplied is not in the database";
    }
    find._id = find._id.toString();
    return find;
  },
  async getAll() {
    const userCollection = await users();
    let userList = await userCollection.find({}).toArray();
    if (!userList) throw "Could not get all users";
    userList = userList.map((e) => {
      e._id = e._id.toString();
      return e;
    });
    return userList;
  },
  async checkPassword(dbUserData, password) {
    let compareResult = await bcrypt.compare(password, dbUserData.password);
    if (!compareResult) {
      return false;
    }
    return true;
  },
};

export default exportedMethods;
