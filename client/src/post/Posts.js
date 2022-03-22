import React, {Component} from 'react'
import Post from './Post'
import {getPosts, createPost} from './apiPost'
import {signout} from '../auth/apiAuth'
import {Redirect, Link} from 'react-router-dom'
import client from '../wsClient'

class Posts extends Component {
    constructor() {
        super();

        this.state = {
            posts: [],
			redirect: false
        }

		this.onTableSearch = this.onTableSearch.bind(this);
		this.onShowOrHideForm = this.onShowOrHideForm.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onChangeFile = this.onChangeFile.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
    }
	
	onTableSearch() {
		var phrase = document.getElementById('search');
		var table = document.getElementById('posts-grid');
		var regPhrase = new RegExp(phrase.value, 'i');
		var flag = false;

		for (var i = 1; i < table.rows.length; i++) {
			flag = false;
	
			for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
				flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
				if (flag) break;
			}
	
			if (flag) {
				table.rows[i].style.display = "";
			} else {
				table.rows[i].style.display = "none";
			}
		}
	}

	onShowOrHideForm(e) {
		e.preventDefault();

		var form = document.getElementById("add-form");

		if (form.hidden) {
			form.hidden = false;
		}
		else {
			form.hidden = true;
		} 
	}

	onSubmit(e) {
		e.preventDefault();

		createPost(this.postData).then(response => {
			if (response.err === 'Вы не авторизированы') {
				this.setState({redirect: true});

				return;
			}

			if (response.err) {
				return;
			}

			this.state.posts.unshift(response.data.createPost);
		});

		document.getElementById("add-form").hidden = true;
	}
	
	onChangeFile(e) {
	  	this.postData.set('filedata', e.target.files[0]);
	}
	
	onChangeText(e) {
	  	this.postData.set('description', e.target.value);
	}

    componentDidMount() {
		this.unsubscribePostCreated = client.subscribe(
			{
				query: `subscription { 
					postCreated {
						description, 
						image, 
						author {
						name
						},
						date,
						postId
					} 
				}`,
			},
			{
				next: (notification) => {
					this.setState((state) => {
						state.posts.unshift(notification.data.postCreated);

						return {posts: state.posts}
					});
				},
				error: () => {},
				complete: () => {},
			}, 
		  );	 

		this.postData = new FormData();
		getPosts().then(response => {
            if (!response) {
                return;
            }

			if (response.errors) {
				this.setState({redirect: true});
				return;
			} 
            
            this.setState({posts: response.data.posts});
        })
    }

	componentWillUnmount() {
		this.unsubscribePostCreated();
	}

    render() {
      	return (
			<div className="grid-container">
				{this.state.redirect ? <Redirect to="/Logination"/> : ''}
				<article>
					<img id="main-gif" src="/assets/animation.gif"/>
					<h2><Link onClick={signout} to="/">Выйти</Link></h2>
					<input id="search" type="text" placeholder="Искать" onKeyUp={this.onTableSearch} />
					<div id="add-form" hidden>
						<form action="create" encType="multipart/form-data" className="add-post-form">
							<button id="hide-add-form" onClick={this.onShowOrHideForm}>X</button>
							<div className="form-group">
								<label>Описание</label><br/>
								<input type="text" className="form-control" name="description" onChange={this.onChangeText} required />
							</div>
							<div className="form-group">
								<label>Добавить файл</label><br/>
								<input id="add-file" type="file" name="filedata" onChange={this.onChangeFile} />
							</div>
							<input type="submit" value="Cохранить" onClick={this.onSubmit}/>
						</form>
					</div>
					<fieldset id="posts-form">
						<table id="posts-grid">
							<thead>
								<tr>
									<th scope="col">№</th>
									<th scope="col">Имя автора</th>
									<th scope="col">Описание</th>
									<th scope="col">Дата</th>
									<th scope="col">Файл</th>
								</tr>
							</thead>
							<tbody>
								{this.state.posts.map((post) => {return <Post post={post} key={post.postId}/>})}
							</tbody>
						</table>
					</fieldset>
					<button id="show-add-form" onClick={this.onShowOrHideForm}>Добавить новый пост</button>
				</article>
			</div>
      	);    
    }
}

export default Posts;