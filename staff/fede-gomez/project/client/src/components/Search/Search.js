import React, { Component } from "react";

class Search extends Component {

  state = {
    search: ''
  }
  render() {
    return (
      <div>
        <ul>

        </ul>
        <input type='text' value={this.state.search} />
      </div >
    )

  }
}

export default Search;