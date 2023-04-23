# frozen_string_literal: true

module Actions::Api::References
  # Helper for assigning source metadata to a reference.
  module AssignSourceMetadata
    private

    def create_entity(attributes:)
      source     = find_source(attributes: attributes)
      attributes = attributes.merge({
        'source_metadata' => source&.metadata || {}
      })

      super(attributes: attributes)
    end

    def find_source(attributes:) # rubocop:disable Metrics/MethodLength
      return attributes['source'] if attributes.include?('source')

      if attributes.include?('source_id')
        return step do
          sources_collection.find_one.call(primary_key: attributes['source_id'])
        end
      end

      if entity
        return step do
          sources_collection.find_one.call(primary_key: entity.source_id)
        end
      end

      nil
    end

    def sources_collection
      repository.find_or_create(record_class: Source)
    end

    def update_entity(attributes:)
      source     = find_source(attributes: attributes)
      attributes = attributes.merge({
        'source_metadata' => source&.metadata || {}
      })

      super(attributes: attributes)
    end
  end
end
