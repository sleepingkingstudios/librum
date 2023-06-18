# frozen_string_literal: true

module View::Layouts
  # Component for rendering the page footer.
  class Page::Footer < ViewComponent::Base
    # @param breadcrumbs
    #   [Array<View::Layouts::Page::Breadcrumbs::BreadcrumbConfiguration>,
    #   false] the breadcrumbs to render, or false if the page should not render
    #   breadcrumbs. Defaults to false.
    def initialize(breadcrumbs: false)
      super()

      @breadcrumbs = breadcrumbs
    end

    # @return [Array<View::Layouts::Page::Breadcrumbs::BreadcrumbConfiguration>,
    #   false] the breadcrumbs to render, or false if the page should not render
    #   breadcrumbs.
    attr_reader :breadcrumbs
  end
end
