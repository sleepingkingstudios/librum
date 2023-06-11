# frozen_string_literal: true

module View::Components::Resources
  # Component for rendering data from a resourceful index action.
  class Table < View::Components::Table
    extend Forwardable

    # @param columns [Array<ColumnDefinition>] the columns used to render the
    #   table.
    # @param data [Array<Hash{String=>Object}>] the table data to render.
    # @param resource [Cuprum::Rails::Resource] the controller resource.
    def initialize(columns:, data:, resource:)
      @resource = resource

      super(
        class_names:   %w[is-striped],
        columns:       columns,
        data:          data,
        empty_message: "There are no #{resource_name} matching the criteria."
      )
    end

    def_delegators :@resource,
      :resource_name

    # @return resource [Cuprum::Rails::Resource] the controller resource.
    attr_reader :resource
  end
end
