# frozen_string_literal: true

module View::Components
  # Component for rendering a table header.
  class Table::Header < ViewComponent::Base
    def initialize(columns:, **)
      super()

      @columns = columns
    end

    attr_reader :columns
  end
end
