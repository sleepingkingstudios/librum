# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

publishers = [
  Publisher.find_or_create_by!(
    name:    'Crystal Sphere Publications',
    slug:    'crystal-sphere-publications',
    website: 'www.example.com/crystal-sphere-publications'
  ),
  Publisher.find_or_create_by!(
    name:    'Flumph Free Press',
    slug:    'flumph-free-press',
    website: 'www.example.com/flumph-free-press'
  ),
  Publisher.find_or_create_by!(
    name:    'Spelljammer Monthly',
    slug:    'spelljammer-monthly',
    website: 'www.example.com/spelljammer-monthly'
  )
]

game_systems = [
  GameSystem.find_or_create_by!(
    publisher: publishers[0],
    name:      'marbles',
    slug:      'marbles'
  ),
  GameSystem.find_or_create_by!(
    publisher: publishers[1],
    name:      'Nothing To Lose But Your Tentacles',
    slug:      'nothing-to-lose-but-your-tentacles-1e',
    edition:   '1st Edition'
  ),
  GameSystem.find_or_create_by!(
    publisher: publishers[1],
    name:      'Nothing To Lose But Your Tentacles',
    slug:      'nothing-to-lose-but-your-tentacles-2e',
    edition:   '2nd Edition'
  )
]

_books = [
  Sources::Book.find_or_create_by!(
    game_system: game_systems[0],
    publisher:   publishers[0],
    name:        'Marble Madness',
    slug:        'marble-madness',
    data:        {
      official:         true,
      playtest:         false,
      publication_date: '1977-05-25'
    }
  ),
  Sources::Book.find_or_create_by!(
    game_system: game_systems[2],
    publisher:   publishers[1],
    name:        'Players Tentaclebook',
    slug:        'players-tentaclebook',
    data:        {
      official:         true,
      playtest:         false,
      publication_date: '1980-05-17'
    }
  ),
  Sources::Book.find_or_create_by!(
    game_system: game_systems[2],
    publisher:   publishers[2],
    name:        'Flumphs In Space',
    slug:        'flumphs-in-space',
    data:        {
      official:         true,
      playtest:         false,
      publication_date: '1983-05-25'
    }
  )
]

_websites = [
  Sources::Website.find_or_create_by!(
    game_system: game_systems[2],
    publisher:   publishers[1],
    name:        'Squamous Reference Document',
    slug:        'squamous-reference-document',
    data:        {
      official: true,
      playtest: false,
      base_url: 'www.example.com/squamous-reference-document'
    }
  ),
  Sources::Website.find_or_create_by!(
    game_system: game_systems[2],
    publisher:   publishers[1],
    name:        'Unearthed Abominations',
    slug:        'unearthed-abominations',
    data:        {
      official: true,
      playtest: true,
      base_url: 'www.example.com/unearthed-abominations'
    }
  ),
  Sources::Website.find_or_create_by!(
    game_system: game_systems[2],
    publisher:   publishers[2],
    name:        'Secrets of the Flumph',
    slug:        'secrets-of-the-flumph',
    data:        {
      official: false,
      playtest: false,
      base_url: 'www.example.com/secrets-of-the-flumph'
    }
  )
]
