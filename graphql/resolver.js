const post = require("../controllers/post");
const { PubSub } = require('graphql-subscriptions');
const {isSignedIn, getSignError } = require('../controllers/auth');

const pubsub = new PubSub()

module.exports = {
    posts(args, request) {
        if (!isSignedIn(request)) {
            Promise.reject(getSignError());
        }

        return post.showPosts(request)
    },  

    createPost(args, request) {
        if (!isSignedIn(request)) {
            Promise.reject(getSignError());
        }

        let result  = post.createPost(request, args);
        pubsub.publish("CREATE-POST", {postCreated: result});

        return result;
    },

    subscription: {
        postCreated: () => pubsub.asyncIterator("CREATE-POST")
    },
}