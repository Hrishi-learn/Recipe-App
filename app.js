const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//connect mongoose
mongoose.connect('mongodb+srv://admin:bjNVwtdkMC7M45ZT@cluster0.ywyse.mongodb.net/recipeDB?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
});

const recipeSchema = mongoose.Schema({
    title:String,
    recipe:String
});

const Recipe = mongoose.model("Recipe",recipeSchema);

app.get('/', (req, res) => {
    const defaultQuery = "chicken";
    const apiKey = "2ee66e346e7e5328767e375627d5affd"
    const app_id = "70331b69"
    const url = `https://api.edamam.com/search?q=${defaultQuery}&app_id=${app_id}&app_key=${apiKey}`

    axios.get(url).then(response=>{
        const recipes = response.data.hits;
        res.render('home',{recipes:recipes});
        // console.log(recipes[0].recipe.ingredients);
    }).catch(err=>{
        console.log(err);
    })
})

app.post('/search', (req, res) => {
    const query = req.body.search;
    const apiKey = "2ee66e346e7e5328767e375627d5affd"
    const app_id = "70331b69"
    const url = `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${apiKey}`

    axios.get(url).then(response=>{
        const recipes = response.data.hits;
        res.render('home',{recipes:recipes});
        // console.log(recipes[0].recipe.ingredients);
    }).catch(err=>{
        console.log(err);
    })

})

app.get('/recipes',(req,res)=>{
    
    Recipe.find({},(err,recipes)=>{
        if(!err){
            if(recipes.length!=0){
                res.render("recipes",{recipes:recipes});
            }
            else{
                res.render("noRecipes");
            }
        }
    })
})
app.get('/addRecipe',(req,res)=>{
    res.render("addRecipe")
})


app.post('/addRecipeList',(req,res)=>{
    const title= req.body.recipeTitle;
    const recipe = req.body.recipe;
    const newRecipe = new Recipe({
        title:title,
        recipe:recipe
    })
    newRecipe.save();
    res.redirect('/recipes');
})

app.post('/delete',(req,res)=>{
    Recipe.deleteOne({_id:req.body.delete},(err)=>{
        if(!err){
            // console.log("Deleted successfully");
            res.redirect('/recipes');
        }
    });
   
})

app.listen(port, () => {
    console.log('server started');
})

//bjNVwtdkMC7M45ZT