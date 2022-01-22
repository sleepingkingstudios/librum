# frozen_string_literal: true

module Actions::Api
  # Middleware for finding an entity by (unique) slug.
  module FindBySlug
    UUID_PATTERN = /\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/
    private_constant :UUID_PATTERN

    private

    def destroy_entity(primary_key:)
      return super if primary_key.match?(UUID_PATTERN)

      entity = step do
        Models::Queries::FindBySlug
          .new(collection: collection)
          .call(slug: primary_key)
      end

      super(primary_key: entity[resource.primary_key])
    end

    def find_entity(primary_key:)
      return super if primary_key.match?(UUID_PATTERN)

      Models::Queries::FindBySlug
        .new(collection: collection)
        .call(slug: primary_key)
    end
  end
end
