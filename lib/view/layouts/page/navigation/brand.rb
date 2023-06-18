# frozen_string_literal: true

module View::Layouts
  # Component for rendering the navigation brand icon or image.
  class Page::Navigation::Brand < ViewComponent::Base
    extend Forwardable

    # @param config [View::Layouts::Page::Navigation::Configuration] the config
    #   for the page navigation.
    def initialize(config:)
      super()

      @config = config
    end

    # @return [View::Layouts::Page::Navigation::Configuration] the config for
    #   the page navigation.
    attr_reader :config

    def_delegators :@config,
      :icon,
      :label,
      :url
  end
end
