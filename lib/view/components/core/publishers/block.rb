# frozen_string_literal: true

require 'librum/core/view/components/data_list'

module View::Components::Core::Publishers
  # Component for displaying a single publisher record.
  class Block < ViewComponent::Base
    FIELDS = [
      { key: 'name' }.freeze,
      { key: 'slug' }.freeze,
      {
        key:     'website',
        type:    :link,
        icon:    'link',
        default: '—'
      }.freeze
    ].freeze
    private_constant :FIELDS

    # @param data [Publisher] the publisher to display.
    def initialize(data:, **)
      super()

      @data = data
    end

    # @return [Publisher] the publisher to display.
    attr_reader :data

    # @return [Array<View::Components::DataField::FieldDefinition>] the
    #   configuration objects for rendering the publisher.
    def fields
      FIELDS
    end
  end
end
