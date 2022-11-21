# frozen_string_literal: true

class GameSetting < ApplicationRecord
  ### Associations
  belongs_to :publisher

  has_many :sources, dependent: :nullify

  ### Validations
  validates :name,
    presence:   true,
    uniqueness: true
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
# Table name: game_settings
#
#  id           :uuid             not null, primary key
#  name         :string           default(""), not null
#  slug         :string           default(""), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  publisher_id :uuid
#
# Indexes
#
#  index_game_settings_on_name          (name) UNIQUE
#  index_game_settings_on_publisher_id  (publisher_id)
#  index_game_settings_on_slug          (slug) UNIQUE
#
