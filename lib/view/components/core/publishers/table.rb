# frozen_string_literal: true

require 'librum/core/view/components/link'
require 'librum/core/view/components/resources/table'

module View::Components::Core::Publishers
  # Component for rending a table of Publisher records.
  class Table < Librum::Core::View::Components::Resources::Table
    COLUMNS = [
      {
        key:   'name',
        value: lambda { |item|
          Librum::Core::View::Components::Link.new(
            "/core/publishers/#{item.slug}",
            label: item.name
          )
        }
      }.freeze,
      {
        key:     'website',
        type:    :link,
        icon:    'link',
        default: '—'
      }.freeze
    ].freeze
    private_constant :COLUMNS

    # @param data [Array<Publisher>] the table data to render.
    # @param resource [Cuprum::Rails::Resource] the controller resource.
    def initialize(data:, resource:)
      super(
        columns:  COLUMNS,
        data:     data,
        resource: resource
      )
    end
  end
end
