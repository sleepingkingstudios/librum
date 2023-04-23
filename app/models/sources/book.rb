# frozen_string_literal: true

require 'sleeping_king_studios/tools/toolbox/constant_map'

# A discrete published work, either physical or electronic.
class Sources::Book < Sources::Publication
  Categories = SleepingKingStudios::Tools::Toolbox::ConstantMap.new(
    # An adventure or collection of adventures. Examples: The Sunless Citadel,
    # Tales from the Yawning Portal.
    ADVENTURE:  'adventure',
    # A collection of monsters or, rarely, character options. Examples: the
    # Monster Manual, Monsters of the Multiverse.
    BESTIARY:   'bestiary',
    # A generic fallback option, typically not player-focused. Examples: the
    # Dungeon Master's Guide.
    REFERENCE:  'reference',
    # A reference for a game setting. Examples: the Sword Coast Adventurer's
    # Guide.
    SETTING:    'setting',
    # A book focused on character options. Examples: the Player's Handbook.
    SOURCEBOOK: 'sourcebook'
  ).freeze

  ### Attributes
  data_property :category
  data_property :publication_date

  ### Validations
  validates :category,
    inclusion: {
      allow_nil: true,
      in:        Categories.values
    },
    presence:  true
  validates :game_setting,
    presence: {
      if:      ->(book) { book.category == Categories::SETTING },
      message: I18n.t('errors.messages.required')
    }
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
