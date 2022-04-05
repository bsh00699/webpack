import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import jie from './images/jielun.jpeg'

const Search = () => {

  return (
    <div className='text'>Search test
      <img src={jie} />
    </div>
  )
}

ReactDOM.render(<Search />, document.getElementById('root'))