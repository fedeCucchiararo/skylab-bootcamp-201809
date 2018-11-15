import React, { Component } from 'react'

class Post extends Component {
    state = {
        id: this.props.id,
        text: this.props.text,
        column: this.props.column
    }

    handleSelectChange = (event) => {
        this.props.onChangeColumn(this.state.id, event.target.value)
    }

    handleChange = event => {
        const text = event.target.value
        this.setState({ text: text })
    }

    handleBlur = () => {
        this.props.onUpdatePostit(this.state.id, this.state.text)
    }

    render() {
        return <article className='kanban-item'>
            <textarea defaultValue={this.state.text} onChange={this.handleChange} onBlur={this.handleBlur} />
            <select defaultValue={this.state.column} onChange={this.handleSelectChange}>
                {
                    ['todo', 'doing', 'review', 'done'].map(item => <option value={item}>{item}</option>)
                }
            </select>
            <button onClick={() => this.props.onDeletePost(this.props.id)}><i className="far fa-trash-alt"></i></button>
        </article>
    }
}

export default Post