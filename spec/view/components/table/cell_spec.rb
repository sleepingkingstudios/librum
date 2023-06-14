# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Table::Cell, type: :component do
  subject(:cell) do
    described_class.new(
      column: column,
      data:   data
    )
  end

  let(:column)   { { key: 'name' } }
  let(:data)     { Struct.new(:name).new('Alan Bradley') }
  let(:rendered) { render_inline(cell) }
  let(:snapshot) do
    <<~HTML
      <td>
        Alan Bradley
      </td>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n{2,}/, "\n")
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:column, :data)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end
end
