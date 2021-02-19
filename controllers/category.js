const Category = require("../models/category");
//const User = require("../models/user")

//getting categoryID

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "No such category",
      });
    }
    req.category = category;
    next();
  });
};


exports.createCategory = (req, res) => {
  let newCategory = new Category(req.body);
  //newCategory.name = req.body.name
  newCategory.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Not able to save category in DB",
      });
    }
    res.json({
      status: 200,
      data: category,
      message: "Category is created",
    });
  });
};


exports.getCategory = (req, res) => {
  return res.json({
    status: 200,
    category: req.category,
    message: "Category fetched",
  });
};


exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories.length>0) {
      return res.status(400).json({
        error: "No such category",
      });
    }
    return res.json({
      status: 200,
      categories: categories,
      message: "All the categories are fetched",
    });
  });
};


exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  console.log(category);
  Category.findOneAndUpdate({ _id: req.category._id }, category, {
    new: true,
    useFindAndModify: false,
  },(err,category)=>{
    if(err||!category)
    {
        return res.status(400).json({
            error:"No such category"
        })
    }
    return res.json({
        status: 200,
        categories: category,
        message: "The category is updated",
      });
  });
};


exports.removeCategory = (req,res)=>{
    const category = req.category;
    category.remove((err,category)=>{
        if(err||!category)
        {
            return res.status(400).json({
                error:"Failed to delete the category"
            })
        }
        return res.json({
            status:200,
            message:`successfully deleted the category ${category}`
        })
    })
}
