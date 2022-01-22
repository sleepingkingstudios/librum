# frozen_string_literal: true

require 'actions'

module Actions
  # Middleware for finding an entity by (unique) slug.
  module FindBySlug
    UUID_PATTERN = /\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/
    private_constant :UUID_PATTERN

    private

    def find_entity(primary_key:)
      return super if primary_key.match?(UUID_PATTERN)

      Models::Queries::FindBySlug
        .new(collection: collection)
        .call(slug: primary_key)
    end
  end
end
