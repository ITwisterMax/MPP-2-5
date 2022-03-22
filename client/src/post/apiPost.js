function graphqlRequest(query) {
	return fetch('/graphql', {
	  	method: 'POST',
	  	headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
	  	},
	  	body: JSON.stringify(query)
	})
	.then(response => response.json());
  }

export const getPosts = (user) => {
	return graphqlRequest({query: `{
		posts {
			description, 
			image,
			author {
			name
			},
			date,
			postId
		}
	}`});      
}
  
export const createPost = (post) => { 
	return fetch('/upload', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
		},
		body: post
	})
	.then(response => response.json())
	.then((response) => {return graphqlRequest({query: `
		mutation {
			createPost(description: "${post.get("description")}", image: "${response.filename}") {
				description,
				image
			}
		}`})
	});
}