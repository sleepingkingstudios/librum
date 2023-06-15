# frozen_string_literal: true

require 'view/layouts/page'

module View::Layouts
  # Component for rendering the page banner and navigation.
  class Page::Banner < ViewComponent::Base
    # @param navigation [Array, false] the configured navigation, or false if
    #   the navigation bar is hidden.
    def initialize(navigation: [], **)
      super()

      @navigation = navigation
    end

    # @return [Array, false] the configured navigation, or false if the
    #   navigation bar is hidden.
    attr_reader :navigation
  end
end
