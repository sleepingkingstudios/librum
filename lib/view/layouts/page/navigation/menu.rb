# frozen_string_literal: true

module View::Layouts
  # Component for rendering a page navigation menu.
  class Page::Navigation::Menu < ViewComponent::Base
    # @param items [Array<View::Layouts::Page::Navigation::ItemDefinition>] the
    #   navigation items to render.
    def initialize(items:)
      super()

      @items = items
    end

    # @param items [Array<View::Layouts::Page::Navigation::ItemDefinition>] the
    #   navigation items to render.
    attr_reader :items

    private

    def left_items
      items.reject(&:right?)
    end

    def right_items
      items.select(&:right?)
    end
  end
end
