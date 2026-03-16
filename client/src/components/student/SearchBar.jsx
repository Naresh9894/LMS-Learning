import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {
  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  const onSearchHandler = (e) => {
    e.preventDefault()
    navigate('/course-list/' + input)
  }

  return (
    <form
      onSubmit={onSearchHandler}
      className='max-w-xl w-full md:h-14 h-12 flex items-center rounded overflow-hidden'
      style={{
        background: 'rgba(255,255,255,0.06)',      // ← no more bg-white
        border: '1px solid rgba(212,168,67,0.25)', // gold border
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Search icon — gold tint */}
      <img
        src={assets.search_icon}
        alt="search_icon"
        className='md:w-auto w-10 px-3'
        style={{ opacity: 0.5, filter: 'sepia(1) saturate(3) hue-rotate(5deg)' }}
      />

      {/* Input */}
      <input
        onChange={e => setInput(e.target.value)}
        value={input}
        type='text'
        placeholder='Search for courses'
        className='w-full h-full outline-none bg-transparent'
        style={{
          color: '#f0e6cc',                // warm cream text
          caretColor: '#d4a843',           // gold caret
        }}
      />

      {/* Search button */}
      <button
        type='submit'
        className='md:px-10 px-7 md:py-3 py-2 mx-1 rounded text-sm font-semibold tracking-wide'
        style={{
          background: 'linear-gradient(135deg, #d4a843, #f0c455)',
          color: '#050d1a',               // dark text on gold button
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: 'nowrap',
        }}
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar