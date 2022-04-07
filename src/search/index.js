import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import jie from './images/jielun.jpeg'
import { common } from '../../common'

const Search = () => {

  return (
    <div className='text'>Search test
      {common()}
      <img src={jie} />
    </div>
  )
}

ReactDOM.render(<Search />, document.getElementById('root'))