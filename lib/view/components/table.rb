# frozen_string_literal: true

module View::Components
  # Component for rendering tabular data.
  class Table < ViewComponent::Base
    # Data object representing configuration for a table column.
    class ColumnDefinition
      # @param key [String] the data key corresponding to the cell contents.
      # @param default [String, Proc] the default value for the column.
      # @param icon [String] the name of the icon, if any, to display.
      # @param label [String] the label for the column. Defaults to the key.
      # @param type [Symbol] the type of column.
      # @param value [Proc, ViewComponent::Base] the custom column value.
      def initialize( # rubocop:disable Metrics/ParameterLists
        key:,
        default: nil,
        icon:    nil,
        label:   nil,
        type:    :text,
        value:   nil
      )
        @key     = key
        @default = default
        @label   = label || key.titleize
        @icon    = icon
        @type    = type
        @value   = value
      end

      # @return [String, Proc] the default value for the column.
      attr_reader :default

      # @return [String] the name of the icon, if any, to display.
      attr_reader :icon

      # @return [String] the data key corresponding to the cell contents.
      attr_reader :key

      # @return [String] the label for the column. Defaults to the key.
      attr_reader :label

      # @return [Symbol] the type of column.
      attr_reader :type

      # @return [Proc, ViewComponent::Base] the custom column value.
      attr_reader :value
    end

    # @param columns [Array<ColumnDefinition>] the columns used to render the
    #   table.
    # @param data [Array<Hash{String=>Object}>] the table data to render.
    # @param class_names [Array<String>] additional class names to add to the
    #   rendered HTML.
    # @param empty_message [String] the message to display for an empty table.
    # @param body_component [ViewComponent::Base] the component to render the
    #   table body. Defaults to View::Components::Table::Body.
    # @param cell_component [ViewComponent::Base] the component to render each
    #   table cell.
    # @param footer_component [ViewComponent::Base] the component to render the
    #   table footer, if any. Defaults to nil.
    # @param header_component [ViewComponent::Base] the component to render the
    #   table header. Defaults to View::Components::Table::Header.
    # @param row_component [ViewComponent::Base] the component to render each
    #   table row.
    # @param options [Hash{Symbol=>Object}] additional options to pass to the
    #   rendered table.
    def initialize( # rubocop:disable Metrics/MethodLength, Metrics/ParameterLists
      columns:,
      data:,
      body_component:   nil,
      cell_component:   nil,
      class_names:      [],
      empty_message:    nil,
      footer_component: nil,
      header_component: nil,
      row_component:    nil,
      **options
    )
      super()

      @columns          = columns
      @class_names      = class_names
      @data             = data
      @empty_message    = empty_message
      @body_component   = body_component || View::Components::Table::Body
      @cell_component   = cell_component
      @footer_component = footer_component
      @header_component = header_component || View::Components::Table::Header
      @row_component    = row_component
      @options          = options
    end

    # @return [ViewComponent::Base] the component to render the table body.
    attr_reader :body_component

    # @returen [ViewComponent::Base] the component to render each table cell.
    attr_reader :cell_component

    # @return [Array<ColumnDefinition>] the columns used to render the table.
    attr_reader :columns

    # @return data [Array<Hash{String=>Object}>] the table data to render.
    attr_reader :data

    # @return [String] the message to display for an empty table.
    attr_reader :empty_message

    # @return [ViewComponent::Base] the component to render the table footer,
    #   if any.
    attr_reader :footer_component

    # @return [ViewComponent::Base] the component to render the table header.
    attr_reader :header_component

    # @return [Hash{Symbol=>Object}] additional options to pass to the rendered
    #   table.
    attr_reader :options

    # @return [ViewComponent::Base] the component to render each table row.
    attr_reader :row_component

    private

    def build_body
      body_component.new(
        cell_component: cell_component,
        columns:        columns,
        data:           data,
        empty_message:  empty_message,
        row_component:  row_component,
        **options
      )
    end

    def build_footer
      footer_component.new(**options)
    end

    def build_header
      header_component.new(
        columns: columns,
        **options
      )
    end

    def class_names
      ['table', *@class_names].join(' ')
    end

    def render_body
      render(build_body)
    end

    def render_footer
      return unless footer_component

      render(build_footer)
    end

    def render_header
      render(build_header)
    end
  end
end
