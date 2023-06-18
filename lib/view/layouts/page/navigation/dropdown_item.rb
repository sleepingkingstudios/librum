# frozen_string_literal: true

module View::Layouts
  # Component for rendering a page navigation dropdown item.
  class Page::Navigation::DropdownItem < ViewComponent::Base
    extend Forwardable

    # @param item [View::Layouts::Page::Navigation::ItemDefinition] the
    #   navigation item to render.
    def initialize(item:)
      super()

      @item = item
    end

    def_delegators :@item,
      :label,
      :url

    # @return [View::Layouts::Page::Navigation::ItemDefinition] the navigation
    #   item to render.
    attr_reader :item
  end
end
