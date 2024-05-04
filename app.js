// Dependencies
import express from "express";
import expressHandlebars from "express-handlebars";
import session from "express-session";
import path from "path";
import router from "./routes/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Import the custom helper methods
import helpers from "./utils/helpers.js";
// Incorporate the custom helper methods: ./utils/helpers.js
const handlebars = expressHandlebars.create({ helpers });

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

// Set up sessions
const sess = {
  secret: "Secret key goes here",
  cookie: {
    // Stored in milliseconds (86,400,000 === 1 day)
    // 28800000 = 8 hours
    maxAge: 28800000,
  },
  resave: false,
  saveUninitialized: false,
};
app.use(session(sess));

//setup handlebars with express
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

//allow api to use json and url encoding
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//set public folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Sets up the routes
app.use(router);

// Starts the server to begin
app.listen(PORT, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});




import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

// 导入自定义路由模块
import userRoutes from './routes/user-routes.js';



// 设置 Handlebars 作为视图引擎
app.expressHandlebars('handlebars', expressHandlebars());
app.set('view expressHandlebars', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 配置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 配置解析中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 配置文件上传中间件
app.use(fileUpload());

// 配置会话管理
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }  // 设置 cookie 过期时间为 1 小时
}));

// 挂载用户路由
app.use('/users', userRoutes);

// 基本错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 处理 404
app.use((req, res, next) => {
  res.status(404).render('404');  // 假设有一个 404.handlebars 模板
});

