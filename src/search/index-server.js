const React = require('react')
require('./search.less')
const jie = require('./images/jielun.jpeg')
const { common } = require('../../common')


const Search = () => {

  return (
    <div className='text'>Search SSR Render
      {common()}
      <img src={jie} />
    </div>
  )
}
module.exports = <Search />