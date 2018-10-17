import React from 'react';
import './PostIt.css'


const PostIt = (props) => {
    return (
            <textarea defaultValue={props.text} className='postItItem'></textarea>
    )
}

export default PostIt;