# frozen_string_literal: true

class GameSystem < ApplicationRecord
  ### Associations
  belongs_to :publisher

  ### Validations
  validates :name,
    presence:   true,
    uniqueness: {
      scope: :edition
    }
  validates :slug,
    format:     {
      message: 'must be in kebab-case',
      with:    /\A[a-z0-9]+(-[a-z0-9]+)*\z/
    },
    presence:   true,
    uniqueness: true
end

# == Schema Information
#
# Table name: game_systems
#
#  id           :uuid             not null, primary key
#  edition      :string           default(""), not null
#  name         :string           default(""), not null
#  slug         :string           default(""), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  publisher_id :uuid
#
# Indexes
#
#  index_game_systems_on_name_and_edition  (name,edition) UNIQUE
#  index_game_systems_on_publisher_id      (publisher_id)
#  index_game_systems_on_slug              (slug) UNIQUE
#
