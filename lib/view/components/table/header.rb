# frozen_string_literal: true

module View::Components
  # Component for rendering a table header.
  class Table::Header < ViewComponent::Base
    # @param columns [Array<View::Components::DataField::FieldDefinition>] the
    #   columns used to render the table.
    def initialize(columns:, **)
      super()

      @columns = columns.map do |column|
        if column.is_a?(View::Components::DataField::FieldDefinition)
          column
        else
          View::Components::DataField::FieldDefinition.new(**column)
        end
      end
    end

    # @return [Array<View::Components::DataField::FieldDefinition>] the columns
    #   used to render the table.
    attr_reader :columns
  end
end
