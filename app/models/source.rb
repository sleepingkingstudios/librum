# frozen_string_literal: true

# An abstract source for game materials.
class Source < ApplicationRecord
  extend Models::DataProperties

  ### Attributes
  data_property :official, predicate: true
  data_property :playtest, predicate: true

  ### Associations
  belongs_to :game_system
  belongs_to :publisher

  ### Validations
  validates :name,
    presence:   true,
    uniqueness: {
      scope: %i[game_system_id publisher_id]
    }
  validates :slug,
    format:     {
      message: 'must be in kebab-case',
      with:    /\A[a-z0-9]+(-[a-z0-9]+)*\z/
    },
    presence:   true,
    uniqueness: { scope: :game_system_id }
  validates :type, presence: true

  # @return [false] True if the source is homebrew, otherwise false.
  def homebrew?
    false
  end
end

# == Schema Information
#
# Table name: sources
#
#  id             :uuid             not null, primary key
#  data           :jsonb            not null
#  name           :string           default(""), not null
#  slug           :string           default(""), not null
#  type           :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  game_system_id :uuid
#  publisher_id   :uuid
#
# Indexes
#
#  index_sources_on_game_system_id                            (game_system_id)
#  index_sources_on_name_and_game_system_id_and_publisher_id  (name,game_system_id,publisher_id) UNIQUE
#  index_sources_on_publisher_id                              (publisher_id)
#  index_sources_on_slug_and_game_system_id                   (slug,game_system_id) UNIQUE
#
