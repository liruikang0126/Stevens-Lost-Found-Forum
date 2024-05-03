import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import posts from "../data/Post.js";
import users from "../data/User.js";
import comments from "../data/Comment.js";
import userData from "./user-seeds.json" with { type: "json" };
import postData from "./post-seeds.json" with { type: "json" };
import commentData from "./comment-seeds.json" with { type: "json" };

const db = await dbConnection();
// await seed();
await debugPosts();
// await debugUsers();
// await debugComments();
await closeConnection();

async function seed(){
    await db.dropDatabase();
    try{
        await seedUsers();
        await seedPosts();
        await seedComments();
    }catch(e) {
        console.log(e);
    }
    console.log("Done seeding database");
}
async function seedUsers(){
    for(let i in userData){
        try{
            const u=userData[i]
            const res =await users.create(u.username,u.email,u.password,u.isAdmin)
            // console.log(res);
        }catch(e){
            console.log(e);
        }
    }
}
async function seedPosts(){
    const us=await users.getAll();
    const lus=us.length;
    for(let i in postData){
        try{
            const p=postData[i]
            p.author_id=us[i%lus]._id;
            const res =await posts.create(p.title,p.content,p.author_id)
        }catch(e){
            console.log(e);
        }
    }
}
async function seedComments(){
    const us=await users.getAll();
    const lus=us.length;
    const ps=await posts.getAllLatest();
    let lps=ps.length;
    for(let i in commentData){
        try{
            const c=commentData[i];
            c.author_id=us[i%lus]._id;
            c.post_id=ps[i%lps]._id;
            const res =await comments.create(c.post_id,c.author_id,c.comment);
        }catch(e){
            console.log(e);
        }
    } 
}
async function debugUsers(){
    const us=await users.getAll();
    try{
        const res=await users.getByEmail(us[0].email);
        // console.log(res);
    }catch(e){
        console.log(e);
    }
    try{
        const res =await users.getByAuthorId(us[0]._id)
        // console.log(res);
    }catch(e){
        console.log(e);
    }
}
async function debugPosts(){
    const ps=await posts.getAllLatest();
    const us=await users.getAll();
    try{
        const res =await posts.getAllHottest();
        // console.log(res);
    }catch(e){
        console.log(e);
    }
    try{
        const res =await posts.getByPostId(ps[0]._id);
        // console.log(res);
    }catch(e){
        console.log(e);
    }
    
    try{
        const res =await posts.getByAuthorId(us[0]._id)
        // console.log(res);
    }catch(e){
        console.log(e);
    } 
    try{
        const res =await posts.update(ps[0]._id,"I love Pebble", "I love daily reminders",us[0]._id)
        // console.log(res);
    }catch(e){
        console.log(e);
    }
    
    try{
        // const res =await posts.destroy(ps[0]._id)
        // console.log(res);
    }catch(e){
        console.log(e);
    } 
}
async function debugComments(){
    const allComments=await comments.getAll();
    try{
        const res=await comments.getByCommentId(allComments[0]._id);
        // console.log(res);
    }catch(e){
        console.log(e);
    }
    try{
        const res=await comments.destroy(allComments[0]._id);
        // console.log(res);
    }catch(e){
        console.log(e);
    }
    try{
        const res=await comments.update(allComments[1]._id,"Updated comments");
        console.log(res);
    }catch(e){
        console.log(e);
    }  
}








 






