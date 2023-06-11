# frozen_string_literal: true

module View::Pages::Resources
  # Generic page for displaying a table of resource results.
  class IndexPage < View::Components::Page
    extend Forwardable

    def_delegators :@resource,
      :resource_name

    def data_table
      if table_component.blank?
        return View::Components::MissingComponent.new(
          name:    'Table',
          message: 'Rendered in View::Pages::Resources::IndexPage'
        )
      end

      table_component.new(data: resource_data, resource: resource)
    end

    def resource_data
      return [] unless result.value.is_a?(Hash)

      result.value.fetch(resource_name, [])
    end

    private

    def table_component
      return nil unless resource.respond_to?(:table_component)

      resource.table_component
    end
  end
end
