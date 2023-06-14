# frozen_string_literal: true

require 'view/components/table'

module View::Components
  # Component for rendering individual data cells.
  class Table::Cell < View::Components::DataField
    # @param column [View::Components::DataField::FieldDefinition] the column
    #   used to render the cell.
    # @param data [Hash{String=>Object}] the data used to render the cell.
    def initialize(column:, data:, **)
      super(data: data, field: column)
    end
  end
end
