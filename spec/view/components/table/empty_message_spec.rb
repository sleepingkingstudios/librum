# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Table::EmptyMessage, type: :component do
  subject(:message) { described_class.new(**constructor_options) }

  let(:columns)             { [{}, {}, {}] }
  let(:constructor_options) { { columns: columns } }
  let(:rendered)            { render_inline(message) }
  let(:snapshot) do
    <<~HTML
      <tr>
        <td colspan="3">There are no matching items.</td>
      </tr>
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
        .and_keywords(:columns, :empty_message)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with empty_message: value' do
    let(:empty_message)       { 'Something has gone wrong.' }
    let(:constructor_options) { super().merge(empty_message: empty_message) }
    let(:snapshot) do
      <<~HTML
        <tr>
          <td colspan="3">Something has gone wrong.</td>
        </tr>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
