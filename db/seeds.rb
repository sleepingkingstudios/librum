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

[
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
