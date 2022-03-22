const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signout = (request, response) => {
	response.clearCookie('token', {path: "/"});
	response.json();
}

exports.postSignup = (request, response) => {
	User.findOne({login: request.body.login}, function(err, user) {
		if (err) {
			response.status(500).json({err: 'Ошибка'});
			return;
		}
		
		if (user) {
			response.status(401).json({err: 'Введите другой логин'});
			return;
		}
		
		user = new User(request.body);
		user.save(function(err){
			if (err) {
				response.status(500).json({err: 'Ошибка регистрации'});
			} 
			else {
				authorize(response, user)
			}
		}); 
	});
}

exports.postSignin = (request, response) => {
	let {login, password} = request.body;
	User.findOne({login, password}, function(err, user){
		if (err || !user) {
			response.status(404).json({err: 'Проверьте данные'});
		} 
		else {
			authorize(response, user)
		}
	});
}

function authorize(response, user) {
	let token = jwt.sign({userId: user._id}, '12345678');
	let maxAge = 60 * 10;

	response.setHeader('Set-Cookie', `token=${token}; max-age=${maxAge}; HttpOnly`);
    response.status(200).json({
	  	user: user,
	});
}

exports.requireSignin = (request, response, next) => {
	if (request.cookies.userId) {
		next();
	} else {
		response.status(401).json({err: 'Вы не авторизированы'});
	}
}

exports.isSignedIn = (request) => {
  	return request.cookies.userId;
}

exports.getSignError = () => {return {err: 'Вы не авторизированы'}};