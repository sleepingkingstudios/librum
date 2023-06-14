# frozen_string_literal: true

module View::Components
  # Component for rendering an empty table body.
  class Table::EmptyMessage < ViewComponent::Base
    # @param columns [Array<View::Components::DataField::FieldDefinition>] the
    #   columns used to render the table.
    # @param empty_message [String] the message to display when the table has no
    #   data.
    def initialize(columns:, empty_message: nil, **)
      super()

      @columns       = columns
      @empty_message = empty_message || 'There are no matching items.'
    end

    # @return [Array<View::Components::DataField::FieldDefinition>] the columns
    #   used to render the table.
    attr_reader :columns

    # @return [String] the message to display when the table has no data.
    attr_reader :empty_message
  end
end
