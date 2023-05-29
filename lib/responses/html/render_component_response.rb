# frozen_string_literal: true

module Responses::Html
  # Encapsulates an HTML response that renders a ViewComponent.
  class RenderComponentResponse
    # @param assigns [Hash] variables to assign when rendering the template.
    # @param component [ViewComponent] the component to render.
    # @param layout [String] the layout to render.
    # @param status [Symbol, Integer] the HTTP status of the response.
    def initialize(component, assigns: {}, layout: nil, status: nil)
      @assigns   = assigns
      @component = component
      @layout    = layout
      @status    = status
    end

    # @return [Hash] variables to assign when rendering the template.
    attr_reader :assigns

    # @return [ViewComponent] the component to render.
    attr_reader :component

    # @return [String, nil] the layout to render.
    attr_reader :layout

    # @return [Symbol, Integer, nil] the HTTP status of the response.
    attr_reader :status

    # Calls the renderer's #render method with the component and options.
    #
    # @param renderer [#render] The context for executing the response, such as
    #   a Rails controller.
    def call(renderer)
      assign_variables(renderer)

      options = {}
      options[:layout] = layout if layout
      options[:status] = status if status

      renderer.render(component, **options)
    end

    private

    def assign_variables(renderer)
      assigns.each do |key, value|
        renderer.instance_variable_set("@#{key}", value)
      end
    end
  end
end
