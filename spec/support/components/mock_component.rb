# frozen_string_literal: true

require 'support/components'

module Spec::Support::Components
  class MockComponent < ViewComponent::Base
    def initialize(name)
      super()

      @name = name
    end

    attr_reader :name
  end
end
