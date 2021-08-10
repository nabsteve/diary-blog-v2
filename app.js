const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("request");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et urna odio. In sit amet ultricies nulla, eget posuere libero. Quisque non vulputate magna. Nam sapien urna, posuere maximus efficitur in, viverra id nibh. Nam viverra libero a mattis scelerisque. Pellentesque accumsan augue sit amet gravida imperdiet. Nullam suscipit neque ac fringilla dapibus. Donec tincidunt neque dictum purus pulvinar, non dapibus dolor imperdiet. Vivamus ornare at justo quis lobortis."
const aboutContent = "In hac habitasse platea dictumst. Suspendisse feugiat diam nec felis imperdiet pharetra. Nullam non massa malesuada nisl mollis vulputate eu in mauris. Fusce efficitur magna ultrices pretium porta. Mauris quis volutpat nunc. Mauris imperdiet neque felis, ullamcorper lobortis arcu molestie a. Curabitur luctus fermentum purus sed interdum. Morbi in metus a ex placerat lobortis; Vivamus ornare eget lacus id cursus ante ipsum primis in faucibus orci luctus dapibus dolor imperdiet."
const contactContent = "Vestibulum vitae nulla dignissim, blandit nisi ac, volutpat diam. Sed nec porttitor lorem, eget consequat mi. Suspendisse eget fermentum neque. Cras fringilla aliquam lectus a ornare. Phasellus et eleifend erat. Nulla non enim at diam imperdiet placerat. In a metus sit amet tellus sagittis condimentum eu nec dui. Donec nunc justo, laoreet eget velit sed, mollis pellentesque est. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae."

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Stephen:stephen123@blog-cluster.f50lq.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req,res){
  
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
  
  
});

app.get("/about", function(req, res){
  res.render("about", {
    aboutContent: aboutContent
  })
});

app.get("/contact", function(req, res){
  res.render("contact", {
    contactContent: contactContent
  })
});

app.get("/compose", function(req, res){
  res.render("compose")
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {    
      title: post.title,
      content: post.content
    });
  });

});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000")
});