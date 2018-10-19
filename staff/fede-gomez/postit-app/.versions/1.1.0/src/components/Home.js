import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'

class Home extends Component {
  state = { postits: logic.listPostits(this.props.userId) }

  handleSubmit = text => {
      console.log('App', 'handleSubmit (setState)')

      logic.createPostit(text, this.props.userId)

      this.setState({ postits: logic.listPostits(this.props.userId) })
  }

  handleDeletePost = id => {
      logic.deletePostit(id, this.props.userId)

      this.setState({ postits: logic.listPostits(this.props.userId) })
  }

  handleUpdatePost = (id, text, userId) => {
      logic.updatePostit(id, text, userId)

      this.setState({ postits: logic.listPostits(this.props.userId) })
  }

  render() {
      console.log('App', 'render')

      return <div>
          <h1>Post-It App <i className="fas fa-sticky-note"></i></h1>

          <InputForm onSubmit={this.handleSubmit} />

          <section>
              {this.state.postits.map(postit => <Post userId={this.props.userId} key={postit.id} text={postit.text} id={postit.id} onDeletePost={this.handleDeletePost} onUpdatePost={this.handleUpdatePost} />)}
          </section>
      </div>
  }
}

export default Home
