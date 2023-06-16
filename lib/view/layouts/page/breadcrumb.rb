# frozen_string_literal: true

module View::Layouts
  # Component for rendering a page breadcrumb.
  class Page::Breadcrumb < ViewComponent::Base
    extend Forwardable

    # @param breadcrumb
    #   [View::Layouts::Page::Breadcrumbs::BreadcrumbConfiguration] the
    #   breadcrumb to render.
    def initialize(breadcrumb:)
      super()

      @breadcrumb = breadcrumb
    end

    def_delegators :@breadcrumb,
      :label,
      :url

    # @return [View::Layouts::Page::Breadcrumbs::BreadcrumbConfiguration] the
    #   breadcrumb to render.
    attr_reader :breadcrumb

    # @return [true, false] true if the breadcrumb is active, otherwise false.
    def active?
      breadcrumb.active
    end
  end
end
