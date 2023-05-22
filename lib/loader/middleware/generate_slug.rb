# frozen_string_literal: true

require 'cuprum/collections/loader'

module Loader::Middleware
  # Middleware for generating a slug for an entity.
  class GenerateSlug < Cuprum::Collections::Loader::Middleware::EntityMiddleware
    private

    def generate_slug(attributes)
      Models::Attributes::GenerateSlug
        .new(attribute_names: options[:attribute_name])
        .call(attributes: attributes)
    end

    def process(next_command, attributes:)
      if attributes['slug'].blank?
        attributes['slug'] = step { generate_slug(attributes) }
      end

      super(next_command, attributes: attributes)
    end
  end
end
