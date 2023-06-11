# frozen_string_literal: true

module View::Components
  # Component for rendering a table body.
  class Table::Body < ViewComponent::Base
    # @param columns [Array<ColumnDefinition>] the columns used to render the
    #   table.
    # @param data [Array<Hash{String=>Object}>] the table data to render.
    # @param empty_message [String, ViewComponent::Base] the message or
    #   component to display when the table has no data.
    # @param cell_component [ViewComponent::Base] the component to render each
    #   table cell. Defaults to View::Components::Table::Cell.
    # @param row_component [ViewComponent::Base] the component to render each
    #   table row. Defaults to View::Components::Table::Row.
    # @param options [Hash{Symbol=>Object}] additional options to pass to the
    #   rendered table body.
    def initialize( # rubocop:disable Metrics/ParameterLists
      columns:,
      data:,
      cell_component: nil,
      empty_message:  nil,
      row_component:  nil,
      **options
    )
      super()

      @cell_component = cell_component || View::Components::Table::Cell
      @columns        = columns
      @data           = data
      @empty_message  = empty_message
      @row_component  = row_component || View::Components::Table::Row
      @options        = options
    end

    # @return [ViewComponent::Base] the component to render each table cell.
    attr_reader :cell_component

    # @return [Array<ColumnDefinition>] the columns used to render the table.
    attr_reader :columns

    # @return [Array<Hash{String=>Object}>] the table data to render.
    attr_reader :data

    # @return [String, ViewComponent::Base] the message or component to display
    #   when the table has no data.
    attr_reader :empty_message

    # @return [Hash{Symbol=>Object}] additional options to pass to the rendered
    #   table body
    attr_reader :options

    # @return [ViewComponent::Base] the component to render each table row.
    attr_reader :row_component

    private

    def build_empty_message
      View::Components::Table::EmptyMessage.new(
        columns:       columns,
        empty_message: empty_message,
        **options
      )
    end

    def build_row(item:)
      row_component.new(
        cell_component: cell_component,
        columns:        columns,
        item:           item,
        **options
      )
    end

    def render_empty_message
      return render(empty_message) if empty_message.is_a?(ViewComponent::Base)

      render(build_empty_message)
    end

    def render_row(item:)
      render(build_row(item: item))
    end
  end
end
