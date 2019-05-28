const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const Recipe = require("./models/recipe");

// connect() method returns a Promise
mongoose.connect("mongodb+srv://jorai:qhs90f9yHz5nCN3k@cluster0-jbxop.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
  .then(() => {

    console.log("Connection to MongoDB Atlas succeeded !");
  })
  .catch((erreur) => {
    console.log("Connexion to MongoDB Atlas failed");
    console.error(erreur);
  });



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.post("/api/recipes", (req, res, next) => {

  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });

  recipe.save().then(() => {
    res.status(201).json({
      message: "Request successfully posted"
    });
  }).catch((erreur) => {
    res.status(400).json({
      error: erreur
    });
  });
});

app.get("/api/recipes/:recipeId", (req, res, next) => {
  Recipe.findOne({ _id: req.params.recipeId }).then((recipe) => {
    res.status(200).json(recipe);
  }).catch((erreur) => {
    res.status(400).json({
      error: erreur
    });
  });

});

app.put("/api/recipes/:id", (req, res, next) => {

  const recipe = new Recipe({

    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });

  Recipe.updateOne({ _id : req.params.id }, recipe).then(() => {
    res.status(201).json({
      message: "Request successfully updated"
    });
  }).catch((erreur) => {
    res.status(400).json({
      error: erreur
    });
  });
});

app.delete("/api/recipes/:id", (req, res, next) => {
  Recipe.deleteOne({_id : req.params.id}).then(() => {
    res.status(200).json({
      message : "Request deleted !"
    });
  }).catch((erreur) => {
    res.status(400).json({
      error : erreur 
    });    
  });
});


app.use("/api/recipes", (req, res, next) => {
  Recipe.find().then((recipes) => {
    res.status(200).json(recipes);
    console.log("Get request works ! ");
  }).catch((erreur) => {
    res.status(400).json({
      error: erreur
    });
  });
});

module.exports = app;