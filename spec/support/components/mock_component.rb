# frozen_string_literal: true

require 'support/components'

module Spec::Support::Components
  class MockComponent < ViewComponent::Base
    def initialize(name, **options)
      super()

      @name    = name
      @options = options
    end

    attr_reader \
      :name,
      :options

    def format_options
      return '' if options.empty?

      formatted =
        options
        .map { |key, value| "#{key}=#{value.inspect}" }
        .join(' ')

      " #{formatted}"
    end
  end
end
