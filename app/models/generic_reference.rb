# frozen_string_literal: true

# Example implementation of the abstract Reference class.
class GenericReference < Reference
  # Validations
  with_options unless: :stub? do
    validates :details, presence: true
  end
end

# == Schema Information
#
# Table name: generic_references
#
#  id              :uuid             not null, primary key
#  details         :text
#  name            :string           default(""), not null
#  slug            :string           default(""), not null
#  source_metadata :jsonb            not null
#  stub            :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  source_id       :uuid
#
# Indexes
#
#  index_generic_references_on_slug                (slug)
#  index_generic_references_on_source_id           (source_id)
#  index_generic_references_on_source_id_and_slug  (source_id,slug) UNIQUE
#
