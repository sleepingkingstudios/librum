# frozen_string_literal: true

require 'view/components/table'

module View::Components
  # Component for rendering individual data cells.
  class Table::Cell < ViewComponent::Base
    extend Forwardable

    # @param column [ColumnDefinition] the column used to render the cell.
    # @param item [Hash{String=>Object}] the data used to render the cell.
    def initialize(column:, item:, **)
      super()

      @column = column
      @item   = item
    end

    def_delegators :@column,
      :default,
      :icon,
      :key,
      :type,
      :value

    # @return [ColumnDefinition] the column used to render the cell.
    attr_reader :column

    # @return [Hash{String=>Object}] the data used to render the cell.
    attr_reader :item

    private

    def cell_value
      return @cell_value if @cell_value

      return @cell_value = value.call(item) if value.is_a?(Proc)

      return value if value.is_a?(ViewComponent::Base)

      @cell_value = item[key]
    end

    def default_value
      return @default_value if @default_value

      return @default_value = default.call(item) if default.is_a?(Proc)

      @default_value = default
    end

    def render_contents
      return render_default if cell_value.blank? && default.present?

      return render(cell_value) if cell_value.is_a?(ViewComponent::Base)

      case type
      when :link
        render_link(cell_value)
      else
        cell_value
      end
    end

    def render_default
      return render(default_value) if default_value.is_a?(ViewComponent::Base)

      default_value
    end

    def render_icon?
      return false unless icon

      return false if cell_value.is_a?(ViewComponent::Base)

      type != :link
    end

    def render_link(value)
      render(View::Components::Link.new(value, icon: icon))
    end
  end
end
