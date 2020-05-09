var Campground = require("../models/campground");
var Comment = require("../models/comment")


middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err){
				req.flash("error","Campground not found");
				res.redirect("back");
			}else{
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","you dont have permission to do that");
					res.redirect("back");
				}
			}
		})
	}else{
		res.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){

				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		})
	}else{
		res.redirect("/login");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error", "you must be logged in first to add it");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;