var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


router.get("/campgrounds",function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	})
	
});
router.post("/campgrounds",middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var des = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newcampground = {name: name ,image: image,description: des,author: author};
	Campground.create(newcampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			req.flash("success","Successfully Created new Campground");
			res.redirect("/campgrounds");
		}
	})
	
})
router.get("/campgrounds/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
})
router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	})
});
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/edit",{campground: foundCampground})
		}

	})
	
});
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		res.redirect("/campgrounds");
	})
});

module.exports = router;
