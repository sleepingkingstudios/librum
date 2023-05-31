# frozen_string_literal: true

require 'cuprum/rails/responses/html/redirect_response'
require 'cuprum/rails/responders/actions'
require 'cuprum/rails/responders/base_responder'
require 'cuprum/rails/responders/matching'

module Responders
  # Provides a DSL for defining responses to HTML requests.
  class HtmlResponder < Cuprum::Rails::Responders::BaseResponder
    include Cuprum::Rails::Responders::Html::Rendering
    include Cuprum::Rails::Responders::Matching
    include Cuprum::Rails::Responders::Actions

    match :success do |result|
      render_component(result)
    end

    match :failure, error: Librum::Core::Errors::AuthenticationError do |result|
      render_component(
        View::Pages::LoginPage.new(result),
        layout: 'login',
        status: :unauthorized
      )
    end

    match :failure do
      render_component(result, status: :internal_server_error)
    end

    # @!method call(result)
    #   (see Cuprum::Rails::Responders::Actions#call)

    # @return [Symbol] the format of the responder.
    def format
      :html
    end

    # Creates a Response based on the given result and options.
    #
    # @param result [Cuprum::Result] the result to render.
    # @param flash [Hash] the flash messages to set.
    # @param layout [String, nil] the layout to render.
    # @param status [Integer, Symbol] the HTTP status of the response.
    #
    # @return [Responses::Html::RenderComponentResponse] the response.
    def render_component(result, flash: {}, layout: nil, status: :ok) # rubocop:disable Metrics/MethodLength
      component = build_view_component(result)

      Responses::Html::RenderComponentResponse.new(
        component,
        assigns: extract_assigns(result),
        flash:   flash,
        layout:  layout,
        status:  status
      )
    rescue NameError
      Responses::Html::RenderComponentResponse.new(
        missing_page_component(result),
        assigns: extract_assigns(result),
        flash:   flash,
        layout:  layout,
        status:  :internal_server_error
      )
    end

    private

    def build_view_component(result)
      return result if result.is_a?(ViewComponent::Base)

      return result.value if result.value.is_a?(ViewComponent::Base)

      view_component_class.new(result)
    end

    def extract_assigns(result)
      return {} unless result.respond_to?(:to_cuprum_result)

      value = result.to_cuprum_result.value

      return {} unless value.is_a?(Hash)

      value
        .each
        .select { |key, _| key.to_s.start_with?('_') }
        .to_h { |(key, assign)| [key.to_s.sub(/\A_/, ''), assign] }
    end

    def missing_page_component(result)
      View::Pages::MissingPage.new(
        result,
        action_name:     action_name,
        controller_name: controller_name,
        expected_page:   view_component_name
      )
    end

    def view_component_class
      view_component_name.constantize
    end

    def view_component_name
      action     = action_name.to_s.camelize
      scope      = controller_name.sub(/Controller\z/, '')

      "View::Pages::#{scope}::#{action}"
    end
  end
end
