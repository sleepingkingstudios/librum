# frozen_string_literal: true

module Actions::View::Middleware
  # Middleware for configuring a view page's breadcrumbs.
  class PageBreadcrumbs < Actions::View::Middleware::PageConfiguration
    # @param breadcrumbs
    #   [Array<View::Layouts::Page::Breadcrumbs::BreadcrumbConfiguration>] the
    #   breadcrumbs to render.
    # @param options [Hash{Symbol=>Object}] additional options for configuring
    #   the view page.
    def initialize(breadcrumbs:, **options)
      super(**options)

      @breadcrumbs = breadcrumbs
    end

    # @return [Array<View::Layouts::Page::Breadcrumbs::BreadcrumbConfiguration>]
    #   the breadcrumbs to render.
    attr_reader :breadcrumbs

    private

    def page_metadata
      { breadcrumbs: breadcrumbs }
    end
  end
end
