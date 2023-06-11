# frozen_string_literal: true

module Responders::Html
  # Delegates missing pages to View::Pages::Resources.
  class ResourceResponder < Responders::HtmlResponder
    private

    def build_view_component(result)
      return super if Object.const_defined?(view_component_name)

      resource_component_class.new(result, resource: resource)
    end

    def resource_component_class
      resource_component_name.constantize
    end

    def resource_component_name
      action = action_name.to_s.camelize

      "View::Pages::Resources::#{action}Page"
    end
  end
end
