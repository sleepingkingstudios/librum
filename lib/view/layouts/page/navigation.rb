# frozen_string_literal: true

module View::Layouts
  # Component for rendering the page navigation.
  class Page::Navigation < ViewComponent::Base
    # Configuration object for page navigation.
    class Configuration
      # @param icon [String, nil] the icon to display in the brand link.
      # @param items [Array<ItemDefinition>] the navigation items to display.
      # @param label [String, nil] the label to display in the brand link.
      # @param url [String] the url for the brand link. Defaults to '/'.
      def initialize(icon: nil, items: nil, label: nil, url: '/')
        @icon  = icon
        @items = (items || []).map do |item|
          if item.is_a?(View::Layouts::Page::Navigation::ItemDefinition)
            item
          else
            View::Layouts::Page::Navigation::ItemDefinition.new(**item)
          end
        end
        @label = label
        @url   = url
      end

      # @return [String, nil] the icon to display in the brand link.
      attr_reader :icon

      # @return [Array<ItemDefinition>] the navigation items to display.
      attr_reader :items

      # @return [String, nil] the label to display in the brand link.
      attr_reader :label

      # @return [String] the url for the brand link.
      attr_reader :url
    end

    # Configuration object for a page navigation item.
    class ItemDefinition
      # @param label [String] the label to render.
      # @param url [String] the link url to render.
      # @param items [Array<ItemDefinition>] the child items to display in a
      #   dropdown menu.
      # @param right [Boolean] if true, the item should be rendered on the right
      #   of the navigation menu.
      def initialize(label:, url:, items: nil, right: false)
        @items = (items || []).map do |item|
          if item.is_a?(View::Layouts::Page::Navigation::ItemDefinition)
            item
          else
            View::Layouts::Page::Navigation::ItemDefinition.new(**item)
          end
        end
        @label = label
        @right = right
        @url   = url
      end

      # @return [Array<ItemDefinition>] the child items to display in a dropdown
      #   menu.
      attr_reader :items

      # @return [String] the label to render.
      attr_reader :label

      # @return [String] the link url to render.
      attr_reader :url

      # @return [Boolean] true if the item has dropdown items, otherwise false.
      def dropdown?
        @items.present?
      end

      # @return [Boolean] true if the item should be rendered to the right.
      def right?
        @right
      end
    end

    # @param config [View::Layouts::Page::Navigation::Configuration] the config
    #   for the page navigation.
    def initialize(config:)
      super()

      @config =
        if config.is_a?(Configuration)
          config
        else
          Configuration.new(**config)
        end
    end

    # @return [View::Layouts::Page::Navigation::Configuration] the config for
    #   the page navigation.
    attr_reader :config
  end
end
