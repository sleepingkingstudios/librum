# frozen_string_literal: true

require 'cuprum/rails/actions/create'

module Actions::Api::Publishers
  # Create action for the Publisher API.
  class Create < Cuprum::Rails::Actions::Create
    private

    def create_entity(attributes:)
      attributes = attributes.merge({
        'slug' => step { generate_slug(attributes) }
      })

      super(attributes: attributes)
    end

    def generate_slug(attributes)
      return success(attributes['slug']) if attributes['slug'].present?

      Models::Attributes::GenerateSlug
        .new(attribute_names: 'name')
        .call(attributes: attributes)
    end
  end
end
