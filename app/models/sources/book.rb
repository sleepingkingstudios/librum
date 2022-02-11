# frozen_string_literal: true

require 'sleeping_king_studios/tools/toolbox/constant_map'

# A discrete published work, either physical or electronic.
class Sources::Book < Source
  Categories = SleepingKingStudios::Tools::Toolbox::ConstantMap.new(
    ADVENTURE:  'adventure',
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
#  index_sources_on_game_system_id  (game_system_id)
#  index_sources_on_name            (name) UNIQUE
#  index_sources_on_publisher_id    (publisher_id)
#  index_sources_on_slug            (slug) UNIQUE
#
