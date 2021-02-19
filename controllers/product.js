const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {

  //configuring formidable
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../public/assets");
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    //destructuring the fields
    // const { name, description, price, category, stock, size } = fields;
    // if (!name || !description || !price || !category || !stock || !size) {
    //   res.status(400).json({
    //     error: "Please include all the fields",
    //   });
    // }

    let product = new Product(fields);
    
    //handling the file
    if (file.photo) {
      if (file.photo.size > 5000000) {
        res.status(400).json({
          error: "File size is too big",
        });
      }
      product.photo.name = file.photo.name;
      product.photo.directory = file.photo.path;
      product.photo.contentType = file.photo.type;
    }

    //product being saved to db
    product.save((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: err.errors,
          message: "Not able to save product in DB",
        });
      }
      res.status(200).json({
        status: 200,
        data: product,
        message: "Product is created",
      });
    });
  });
};

exports.getProduct=(req,res)=>{
    return res.status(200).json({
        status:200,
        product:req.product,
        message:"product fetched"
    })
}

exports.updateProduct=(req,res)=>{

    //configuring formidable
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../public/assets");
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
        return res.status(400).json({
            error: err,
        });
        }
        
        //updation code
        let product = req.product
        update = _.extend(product,fields)

        //handling the file
        if (file.photo) {
        if (file.photo.size > 5000000) {
            res.status(400).json({
            error: "File size is too big",
            });
        }
        update.photo.name = file.photo.name;
        update.photo.directory = file.photo.path;
        update.photo.contentType = file.photo.type;
        }    
        
        //updating product
        Product.findOneAndUpdate({_id:product._id},update,{
            new:true,
            useFindAndModify:false,
        },(err,product)=>{
            if(err||!product){
                return res.status(400).json({
                    error:"No such product"
                })
            }

            return res.json({
                status: 200,
                categories: product,
                message: "Product is updated",
            });
        })
    });
}

exports.deleteProduct=(req,res)=>{
    const product = req.product
    product.remove((err,product)=>{
        if(err||!product)
        {
            return res.status(400).json({
                status:400,
                error:err.errors
            })
        }
        res.status(200).json({
            status:200,
            message:"Product deleted successfully!"
        })
    })
}

exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit?parseInt(req.query.limit):10
    let sortBy = req.query.sortBy?req.query.sortBy:"_id"
    Product.find()
    .limit(limit)
    .populate("category")
    .sort([[sortBy, "asc"]])
    .exec((err,products)=>{
        if(err||!products.length>0){
            return res.status(400).json({
                status:400,
                message:"Couldnt fetch products"
            })
        }
        return res.status(200).json({
            status:200,
            products:products,
            message:"products fetched"
        })
    })
}

//middleware

//multer image upload for products
// exports.storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     let error = new Error("Invalid mime type");
//     if (!error) {
//       error = null;
//     }
//     callback(null, path.join(__dirname, "../public/assets"));
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.toLowerCase().split(" ").join("-");
//     callback(null, name + "_" + Date.now() + path.extname(file.originalname));
//   },
// });


//sending photo little late , hit middleware on different endpoint
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.getAllUniqueCategories=(req,res)=>{
  Product.distinct("category",{},(err,category)=>{
    if(err||!category)
    {
      return res.status(400).json({
        status:400,
        error:err.errors,
        message:"Unable to fetch categories"
      })
    }
      return res.status(200).json({
      status:200,
      data:category,
      message:"Unique categories fetched successfully"
    })
  })
}

//this middleware updates the product stocks and sold products in db
exports.updateStock = (req,res,next)=>{
  let myOperations = req.boy.order.products.map(prod=>{
    return {
      updateOne:{
        filter:{_id:prod._id},
        update:{$inc:{stock:-prod.count,sold:+prod.count}}
      }
    }
  })
  //this is where db is modified
  Product.bulkWrite(myOperations , {} , (err,products)=>{
    if(err||!products)
    {
      return res.status(400).json({
        status:400,
        error:err.errors
      })
    }
    next()
    // return res.status(200).json({
    //   status:200,
    //   data:products,
    //   message:"stocks updated successfully"
    // })
  })
}