# frozen_string_literal: true

require 'view/components/table'

module View::Components
  # Component for rendering a table row.
  class Table::Row < ViewComponent::Base
    # @param columns [Array<ColumnDefinition>] the columns used to render the
    #   table.
    # @param item [Hash{String=>Object}] the data object for the row.
    # @param cell_component [ViewComponent::Base] the component to render each
    #   table cell. Defaults to View::Components::Table::Cell.
    # @param options [Hash{Symbol=>Object}] additional options to pass to the
    #   rendered row.
    def initialize(columns:, item:, cell_component: nil, **options)
      super()

      @columns        = columns
      @item           = item
      @cell_component = cell_component || View::Components::Table::Cell
      @options        = options
    end

    # @return [ViewComponent::Base] the component to render each table cell.
    attr_reader :cell_component

    # @return [Array<ColumnDefinition>] the columns used to render the table.
    attr_reader :columns

    # @return [Array<Hash{String=>Object}>] the table data to render.
    attr_reader :item

    # @return [Hash{Symbol=>Object}] additional options to pass to the rendered
    #   cell.
    attr_reader :options

    private

    def build_cell(column:)
      cell_component.new(column: column, item: item, **options)
    end

    def render_cell(column:)
      render(build_cell(column: column))
    end
  end
end
