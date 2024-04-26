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
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add user";
    return { insertedUser: true };
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
