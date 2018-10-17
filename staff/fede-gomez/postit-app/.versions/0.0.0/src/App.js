import React, { Component } from 'react';
import './App.css';
import PostIt from './components/PostIt'

class App extends Component {

  state = {
    text: '',
    postIt: []
  }

  createPostItHandler = (event) => {
    event.preventDefault()
    this.setState((state) => {
      return { postIt: [...this.state.postIt, this.state.text] }
    })
  }

  listPostIt = () => {

  }

  handleInput = (event) => {
    const text = event.target.value;
    this.setState({
      text: text
    })
  }

  handleDelete = () => {

  }


  render() {
    return (
      <div className="App">
        <h1>Hi, I'm a Post-It App</h1>

        <form>
          <textarea placeholder="Insert Text Here..." onChange={this.handleInput} />
          <button onClick={this.createPostItHandler}> Create Post-It </button>
        </form>
        <div className='postItContainer'>
          {this.state.postIt.map(
            (text, index) => <PostIt key={index} text={text}></PostIt>
          )}
        </div>
      </div>
    );
    // return React.createElement('div', {className: 'App'}, React.createElement('h1', null, 'Hi, I\'m a React App!!!'))
  }
}

export default App;
