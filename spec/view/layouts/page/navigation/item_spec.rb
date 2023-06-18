# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Navigation::Item, type: :component do
  subject(:nav_item) { described_class.new(item: item) }

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
    let(:rendered) { render_inline(nav_item) }
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

    describe 'with a dropdown item' do
      let(:item) do
        View::Layouts::Page::Navigation::ItemDefinition.new(
          label: 'Launch Sites',
          url:   '/launch-sites',
          items: [
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
        )
      end
      let(:snapshot) do
        <<~HTML
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Launch Sites
            </a>
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
          </div>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
