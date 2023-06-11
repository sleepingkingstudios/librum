# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Table::Header, type: :component do
  subject(:header) { described_class.new(**constructor_options) }

  let(:columns) do
    [
      { key: 'first_name' },
      {
        key:   'last_name',
        label: 'Surname'
      },
      { key: 'role' }
    ]
  end
  let(:constructor_options) do
    mapped = columns.map do |col|
      View::Components::Table::ColumnDefinition.new(**col)
    end

    { columns: mapped }
  end
  let(:rendered) { render_inline(header) }
  let(:snapshot) do
    <<~HTML
      <thead>
        <tr>
          <th>First Name</th>
          <th>Surname</th>
          <th>Role</th>
        </tr>
      </thead>
    HTML
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:columns)
        .and_any_keywords
    end
  end

  def prettify(html)
    html.to_s.gsub(/\n{2,}/, "\n")
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end
end
