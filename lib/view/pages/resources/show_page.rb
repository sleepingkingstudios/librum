# frozen_string_literal: true

module View::Pages::Resources
  # Generic page for displaying a resource result.
  class ShowPage < View::Components::Page
    extend Forwardable

    def_delegators :@resource,
      :resource_name,
      :singular_resource_name

    private

    def block_component
      return nil unless resource.respond_to?(:block_component)

      resource.block_component
    end

    def data_block
      if block_component.blank?
        return View::Components::MissingComponent.new(
          name:    'Block',
          message: 'Rendered in View::Pages::Resources::ShowPage'
        )
      end

      block_component.new(data: resource_data, resource: resource)
    end

    def record_name
      resource_data['name'] || resource_name.titleize
    end

    def resource_data
      return {} unless result.value.is_a?(Hash)

      result.value.fetch(singular_resource_name, {})
    end
  end
end
