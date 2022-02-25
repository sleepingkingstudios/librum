# frozen_string_literal: true

# A temporary effect or malus applied to creatures or characters.
class Dnd5e::Condition < Dnd5e::Reference
  self.table_name = 'dnd5e_conditions'

  # Validations
  with_options unless: :stub? do
    validates :description, presence: true
  end
end

# == Schema Information
#
# Table name: dnd5e_conditions
#
#  id                :uuid             not null, primary key
#  description       :text             default(""), not null
#  name              :string           default(""), not null
#  short_description :string           default(""), not null
#  slug              :string           default(""), not null
#  source_metadata   :jsonb            not null
#  stub              :boolean          default(FALSE), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  source_id         :uuid
#
# Indexes
#
#  index_dnd5e_conditions_on_slug                (slug)
#  index_dnd5e_conditions_on_source_id           (source_id)
#  index_dnd5e_conditions_on_source_id_and_slug  (source_id,slug) UNIQUE
#
