import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PokemonDetails from './PokemonDetails'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [allPokemons, setAllPokemons] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    async function fetchPokemons() {
      if (!hasMore) return

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${page * 50}`)
        const data = await response.json()
        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            let response = await fetch(pokemon.url)
            let details = await response.json()
            return {
              name: pokemon.name,
              sprite: details.sprites.front_default,
            }
          })
        )
        setAllPokemons((prev) => {
          const uniquePokemons = new Map(prev.map((p) => [p.name, p]))
          detailedPokemons.forEach((p) => uniquePokemons.set(p.name, p))
          return Array.from(uniquePokemons.values())
        })
        if (data.results.length < 50) {
          setHasMore(false)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchPokemons()
  }, [page])

  async function handleSearch(term) {
    if (!term) {
      alert('Please enter a Pokemon name or ID')
      return
    }

    try {
      let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term.toLowerCase()}`)
      let data = await response.json()
      setPokemon(data)
    } catch (error) {
      alert('Pokemon NOT Found!')
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length > 0) {
      const filteredSuggestions = allPokemons
        .filter((p) => p.name.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 10)
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name)
    setSuggestions([])
    handleSearch(suggestion.name)
  }

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight
    if (bottom && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div
              className="min-h-screen bg-cover bg-center relative flex flex-col items-center justify-center p-4"
              style={{
                backgroundImage: `url(/bg.png)`,
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="relative z-20 w-full max-w-md text-center mb-8">
                <h1 className="text-5xl font-extrabold text-white mb-4 tracking-wide">POKEDEX</h1>
                <div className="relative flex">
                  <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Enter Pokémon Name or ID"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="w-full p-4 border border-gray-300 rounded-l-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform duration-300 ease-in-out"
                  />
                  <button
                    onClick={() => handleSearch(searchTerm)}
                    className="px-4 py-4 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Search
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="cursor-pointer flex items-center p-2  hover:bg-gray-200 transition-colors duration-200"
                      >
                        <img
                          className="w-12 h-12 mr-2 rounded-full"
                          src={suggestion.sprite}
                          alt={suggestion.name}
                        />
                        <Link
                          to={`/pokemon/${suggestion.name}`}
                          className="text-black-600"
                        >
                          {suggestion.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                className="relative z-10 container flex flex-wrap justify-center gap-8 mt-6 overflow-auto"
                onScroll={handleScroll}
              >
                <div className="w-72 h-96 flex items-center justify-center bg-violet-200 rounded-lg shadow-lg p-4">
                  {pokemon && pokemon.id ? (
                    <div className='flex flex-col justify-center items-center'>
                      <h1 className="text-2xl font-bold mb-4 capitalize">{pokemon.name}</h1>
                      <img className="w-32 h-32 mx-auto" src={pokemon.sprites.front_default} alt={pokemon.name} />
                      <div className="text-gray-700 space-y">
                        <p>
                          <b>ID:</b> {pokemon.id}
                        </p>
                        <p>
                          <b>Height:</b> {pokemon.height} decimetres
                        </p>
                        <p>
                          <b>Weight:</b> {pokemon.weight} hectograms
                        </p>
                        <p>
                          <b>Base Experience:</b> {pokemon.base_experience}
                        </p>
                      </div>
                      <Link
                        to={`/pokemon/${pokemon.name}`}
                        className="mt-4 inline-block px-4 py-2  bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        More Details
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src="/pika.png"
                        alt="Nothing to show here"
                        className="object-contain h-48 w-full mx-auto mb-4 bg-v"
                      />
                      <p className="text-gray-600 font-semibold">Nothing to show here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
      </Routes>
    </Router>
  )
}

export default App
