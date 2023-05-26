# frozen_string_literal: true

require 'librum/core/models/data_properties'

# An abstract source for game materials.
class Source < ApplicationRecord
  extend Librum::Core::Models::DataProperties

  ### Validations
  validates :name,
    presence:   true,
    uniqueness: {
      scope: %i[game_system_id publisher_id]
    }
  validates :slug,
    format:     {
      message: I18n.t('errors.messages.kebab_case'),
      with:    /\A[a-z0-9]+(-[a-z0-9]+)*\z/
    },
    presence:   true,
    uniqueness: { scope: :game_system_id }
  validates :type, presence: true

  # @return [false] true if the source is homebrew, otherwise false.
  def homebrew?
    false
  end

  # @return [false] true if the source is legacy content, otherwise false.
  def legacy?
    false
  end

  # @return [Hash{String=>Object}] source metadata used to cache source data on
  #   references.
  def metadata
    {
      'homebrew' => homebrew?,
      'legacy'   => legacy?,
      'official' => official?,
      'playtest' => playtest?
    }
  end

  # @return [false] true if the source is official content, otherwise false.
  def official?
    false
  end

  # @return [false] true if the source is playtest content, otherwise false.
  def playtest?
    false
  end
end

# == Schema Information
#
# Table name: sources
#
#  id              :uuid             not null, primary key
#  data            :jsonb            not null
#  name            :string           default(""), not null
#  slug            :string           default(""), not null
#  type            :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  game_setting_id :uuid
#  game_system_id  :uuid
#  publisher_id    :uuid
#  user_id         :uuid
#
# Indexes
#
#  index_sources_on_game_setting_id                           (game_setting_id)
#  index_sources_on_game_system_id                            (game_system_id)
#  index_sources_on_name_and_game_system_id_and_publisher_id  (name,game_system_id,publisher_id) UNIQUE
#  index_sources_on_publisher_id                              (publisher_id)
#  index_sources_on_slug_and_game_system_id                   (slug,game_system_id) UNIQUE
#  index_sources_on_user_id                                   (user_id)
#
