# frozen_string_literal: true

module View::Components::Core::Publishers
  # Component for rending a table of Publisher records.
  class Table < View::Components::Resources::Table
    COLUMNS = [
      {
        key:   'name',
        value: lambda { |item|
          View::Components::Link.new(
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
        columns:  COLUMNS.map { |options| ColumnDefinition.new(**options) },
        data:     data,
        resource: resource
      )
    end
  end
end
