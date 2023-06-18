# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Navigation::DropdownItem, type: :component \
do
  subject(:dropdown_item) { described_class.new(item: item) }

  let(:item) do
    View::Layouts::Page::Navigation::ItemDefinition.new(
      label: 'Rockets',
      url:   '/rockets'
    )
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:item)
    end
  end

  describe '#call' do
    let(:rendered) { render_inline(dropdown_item) }
    let(:snapshot) do
      <<~HTML
        <a class="navbar-item has-text-black" href="/rockets" target="_self">
          Rockets
        </a>
      HTML
    end

    def prettify(html)
      html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
