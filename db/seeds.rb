# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

[
  Publisher.create!(
    name:    'Crystal Sphere Publications',
    slug:    'crystal-sphere-publications',
    website: 'www.example.com/crystal-sphere-publications'
  ),
  Publisher.create!(
    name:    'Flumph Free Press',
    slug:    'flumph-free-press',
    website: 'www.example.com/flumph-free-press'
  ),
  Publisher.create!(
    name:    'Spelljammer Monthly',
    slug:    'spelljammer-monthly',
    website: 'www.example.com/spelljammer-monthly'
  )
]
