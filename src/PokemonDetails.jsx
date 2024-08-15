import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function PokemonDetails() {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    async function fetchPokemonDetails() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
        const data = await response.json()
        setPokemon(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchPokemonDetails()
  }, [name])

  if (!pokemon) {
    return <div>Loading...</div>
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-8 flex flex-col items-center"
      style={{ backgroundImage: `url(/bg.png)` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-20 max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8 space-y-4 md:space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 capitalize text-center">{pokemon.name}</h1>
        <img className="w-32 h-32 mx-auto mb-4" src={pokemon.sprites.front_default} alt={pokemon.name} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-lg text-gray-700 space-y-2">
            <p><b>ID:</b> {pokemon.id}</p>
            <p><b>Height:</b> {pokemon.height} decimetres</p>
            <p><b>Weight:</b> {pokemon.weight} hectograms</p>
            <p><b>Base Experience:</b> {pokemon.base_experience}</p>
            <p><b>Types:</b> {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
            <p><b>Abilities:</b> {pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
          </div>
          <div className="text-lg text-gray-700 space-y-2">
            <p><b>Stats:</b></p>
            {pokemon.stats.map(statInfo => (
              <p key={statInfo.stat.name}> <b>{statInfo.stat.name}:</b> {statInfo.base_stat}</p>
            ))}
          </div>
        </div>
        <div className="text-center mt-4">
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PokemonDetails
