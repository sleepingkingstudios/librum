# frozen_string_literal: true

class Sources::Book < Source
  ### Attributes
  data_property :publication_date
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
