const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = function(request, postData) {
  	return new Promise(function(resolve, reject) {
		let date = new Date();

		let userId = request.cookies.userId;
		
		let post = new Post({
			date: date,
			description: postData.description, 
			author: userId, 
			image: postData.image
		});

		User.findById(userId, function(err, user) {
			if (err || !user) {
				reject(err);

				return;
			}

			post.save(function(err, post) {
				if (err) {
					reject(err);

					return;
				}
		
				let postToSend = {
					postId: post._id,
					author: user,
					description: post.description,
					date: post.date.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' }),
					image: '/assets/' + post.image
				};

				resolve(postToSend);
			});
		});
	})
}

function showPosts(request, response) {
  	return new Promise(function(resolve, reject) {
		if (!request.cookies?.userId) {
			reject('Вы не авторизированы');

			return;
		}
		
		User.findById(request.cookies.userId, function(err, user) {
			if (err) {
				reject('Ошибка');
				return;
			}
			
			Post.find().populate('author').sort({date: -1}).exec(function(err, posts) {
				if (err) {
					response.status(500).json({err: 'Ошибка'});
				} 
				else {
					let postsToSend = posts.map( post => {
						return {
							postId: post._id,
							author: post.author,
							description: post.description,
							date: post.date.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' }),
							image: '/assets/' + post.image
						}
					})

					resolve(postsToSend);
				}
			});
		});  
  	})
}

exports.showPosts = function(request, response) {
  	return showPosts(request, response);
}