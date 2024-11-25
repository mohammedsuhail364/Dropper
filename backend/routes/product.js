const express=require('express');
const { getproducts, 
        newProduct, 
        getsingleproducts, 
        updateproduct, 
        deleteproducts, 
        createReview, 
        getReviews,
        deleteReview,
        getAdminProducts
       } = require('../controllers/productcontroler');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const multer = require('multer');
const path = require('path');
const router=express.Router();




const upload=multer({
        storage:multer.diskStorage({
            destination:function(req,file,cb){
                cb(null,path.join(__dirname,'..','uploads/product'))
            },
            filename:function(req,file,cb){
                cb(null,file.originalname)
            }
        })
    
    })

router.route('/products').get(getproducts)
router.route('/product/:id')
    .get(getsingleproducts)

router.route('/review').put(isAuthenticatedUser,createReview)



// Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),newProduct)
router.route('/admin/products').get(isAuthenticatedUser,authorizeRoles('admin'),getAdminProducts)
router.route('/admin/product/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteproducts)
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),updateproduct)
router.route('/admin/reviews').get(isAuthenticatedUser,authorizeRoles('admin'),getReviews)
router.route('/admin/review').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteReview)

module.exports=router;
