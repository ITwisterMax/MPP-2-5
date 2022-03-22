import React, {Component} from 'react'

class Post extends Component {
	constructor(props) {
		super();

		this.state = {
			postId: props.post.postId,
			authorName: props.post.author.name,
			description: props.post.description,
			date: props.post.date,
			photo: props.post.image
		}
	}

	render() {
		let {postId, authorName, description, date, photo} = this.state;

		return (
			<tr className="post">
				<th>{postId}</th>
				<td>{authorName}</td>
				<td>{description}</td>
				<td>{date}</td>
				<td><img className ="post-image" src={photo} width="50" height="50" /></td>
			</tr>
		);
	}
}

export default Post;