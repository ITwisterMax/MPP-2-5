const { buildSchema } = require('graphql');

const schema = new buildSchema(`
    type Post {
        description: String,
        author: User,
        image: String,
        date: String,
        postId: String
    }

    type User {
        name: String,
        userId: String
    }

    type Query {
        posts: [Post]
    }

    type Mutation {
        createPost(description: String!, image: String!): Post
    }

    type Subscription {
        postCreated: Post
    }
`)

module.exports = schema;