import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'

class Home extends Component {
  state = { postits: logic.listPostits(this.props.UserId) }

  handleSubmit = (text, userId) => {
      console.log('App', 'handleSubmit (setState)')

      logic.createPostit(text, userId)

      this.setState({ postits: logic.listPostits() })
  }

  handleDeletePost = id => {
      logic.deletePostit(id)

      this.setState({ postits: logic.listPostits() })
  }

  handleUpdatePost = (id, text) => {
      logic.updatePostit(id, text)

      this.setState({ postits: logic.listPostits() })
  }

  render() {
      console.log('User passed to Home component: ' + this.props.UserId)

      return <div>
          <h1>Post-It App <i className="fas fa-sticky-note"></i></h1>

          <InputForm onSubmit={this.handleSubmit} />

          <section>
              {this.state.postits.map(postit => <Post key={postit.id} userId={postit.userId} text={postit.text} id={postit.id} onDeletePost={this.handleDeletePost} onUpdatePost={this.handleUpdatePost} />)}
          </section>
      </div>
  }
}

export default Home
