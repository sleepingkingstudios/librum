# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Navigation::Dropdown, type: :component do
  subject(:dropdown) { described_class.new(items: items) }

  let(:items) do
    [
      View::Layouts::Page::Navigation::ItemDefinition.new(
        label: 'Rockets',
        url:   '/launch_sites/rockets'
      ),
      View::Layouts::Page::Navigation::ItemDefinition.new(
        label: 'Planes',
        url:   '/launch_sites/planes'
      ),
      View::Layouts::Page::Navigation::ItemDefinition.new(
        label: 'Zeppelins',
        url:   '/launch_sites/zeppelins'
      )
    ]
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:items)
    end
  end

  describe '#call' do
    let(:rendered) { render_inline(dropdown) }
    let(:snapshot) do
      <<~HTML
        <div class="navbar-dropdown">
          <a class="navbar-item has-text-black" href="/launch_sites/rockets" target="_self">
          Rockets
        </a>
          <a class="navbar-item has-text-black" href="/launch_sites/planes" target="_self">
          Planes
        </a>
          <a class="navbar-item has-text-black" href="/launch_sites/zeppelins" target="_self">
          Zeppelins
        </a>
        </div>
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
