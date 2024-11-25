const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");
const { resolve } = require("path");
//Get products - /api/v1/products
exports.getproducts = async (req, res, next) => {
  const resPerPage = 3;

  let buildQuery = () => {
    return new APIFeatures(Product.find(), req.query).search().filter();
  };
  const filteredProductsCount = await buildQuery().query.countDocuments({});
  const totalProductsCount = await Product.countDocuments({});
  let productsCount = totalProductsCount;
  if (filteredProductsCount !== totalProductsCount) {
    productsCount = filteredProductsCount;
  }

  const products = await buildQuery().paginate(resPerPage).query;
  res.status(200).json({
    success: true,
    count: productsCount,
    resPerPage,
    products,
  });
};
// create product- /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url });
    });
  }
  req.body.images = images;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get Single Product - /product/:id
exports.getsingleproducts = async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name email"
  );
  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }
  
  res.status(201).json({
    success: true,
    product,
  });
};
//update Product- /product/:id but it is PUT
exports.updateproduct = async (req, res, next) => {
  let images = [];

  // if images not cleared we keep existing images
  if (req.body.imagesCleared === false) {
    images = product.images;
  }
  let BASE_URL=process.env.BACKEND_URL;
  if(process.env.NODE_ENV==='production'){
    BASE_URL=`${req.protocol}://${req.get('host')}`
  }
  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url });
    });
  }
  req.body.images = images;
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(202).json({
    success: true,
    product,
  });
};

exports.deleteproducts = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted",
  });
};

// create review -api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const review = {
    user: req.user.id,
    rating,
    comment,
  };
  const product = await Product.findById(productId);
  // finding user already has review
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });
  if (isReviewed) {
    // updating the review
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id) {
        review.comments = comment;
        review.rating = rating;
      }
    });
  } else {
    // creating the review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  // find the average of the product reviews
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;
  product.numOfReviews = product.reviews.length;

  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;
  await product.save({
    validateBeforeSave: false,
  });
  res.status(200).json({
    success: true,
  });
});

// get reviews-api/v1/reviews?id=667506c41222fdd7123b9be6
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate(
    "reviews.user",
    "name"
  );
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete review-api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  // filtering the reviews which does not match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  // update numberofreviews
  const numOfReviews = reviews.length;
  // find the average filtered reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;

  // save this
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });
  res.status(200).json({
    success: true,
  });
});

// get admin Products -api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});
