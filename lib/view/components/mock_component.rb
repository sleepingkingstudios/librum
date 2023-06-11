# frozen_string_literal: true

module View::Components
  # Basic mock for stubbing out view components.
  class MockComponent < ViewComponent::Base
    def initialize(name, **options)
      super()

      @name    = name
      @options = options
    end

    attr_reader \
      :name,
      :options

    def call
      formatted = options.transform_values do |value|
        value.is_a?(String) ? value : value.inspect
      end

      tag('mock', { name: name }.merge(formatted)) # rubocop:disable Rails/ContentTag
    end
  end
end
