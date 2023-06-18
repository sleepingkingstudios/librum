# frozen_string_literal: true

module View::Layouts
  # Component for rendering a page navigation dropdown.
  class Page::Navigation::Dropdown < ViewComponent::Base
    # @param items [Array<View::Layouts::Page::Navigation::ItemDefinition>] the
    #   navigation items to render.
    def initialize(items:)
      super()

      @items = items
    end

    # @return [Array<View::Layouts::Page::Navigation::ItemDefinition>] the
    #   navigation items to render.
    attr_reader :items
  end
end
