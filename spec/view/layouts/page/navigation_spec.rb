# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Navigation, type: :component do
  subject(:navigation) { described_class.new(config: config) }

  let(:config) do
    {
      label: 'Sleeping King Studios',
      items: [
        View::Layouts::Page::Navigation::ItemDefinition.new(
          label: 'Rockets',
          url:   '/rockets'
        ),
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
        ),
        View::Layouts::Page::Navigation::ItemDefinition.new(
          label: 'Launch',
          url:   '/launch',
          right: true
        )
      ]
    }
  end

  describe '::Configuration' do
    subject(:config) { described_class.new(**options) }

    let(:described_class) { super()::Configuration }
    let(:options)         { {} }

    describe '.new' do
      it 'should define the constructor' do
        expect(described_class)
          .to be_constructible
          .with(0).arguments
          .and_keywords(:icon, :items, :label, :url)
      end
    end

    describe '#icon' do
      include_examples 'should define reader', :icon, nil

      context 'when initialized with icon: value' do
        let(:icon)    { 'radiation' }
        let(:options) { super().merge(icon: icon) }

        it { expect(config.icon).to be == icon }
      end
    end

    describe '#items' do
      include_examples 'should define reader', :items, []

      context 'when initialized with items: an Array of Hashes' do
        let(:items) do
          [
            {
              label: 'Rockets',
              url:   '/rockets'
            },
            {
              label: 'Launch Sites',
              url:   '/launch_sites'
            }
          ]
        end
        let(:options)        { super().merge(items: items) }
        let(:expected_class) { View::Layouts::Page::Navigation::ItemDefinition }

        it { expect(config.items).to all be_a(expected_class) }

        it { expect(config.items.map(&:label)).to be == items.pluck(:label) }

        it { expect(config.items.map(&:url)).to be == items.pluck(:url) }
      end

      context 'when initialized with items: an Array of ItemDefinitions' do
        let(:items) do
          [
            View::Layouts::Page::Navigation::ItemDefinition.new(
              label: 'Rockets',
              url:   '/rockets'
            ),
            View::Layouts::Page::Navigation::ItemDefinition.new(
              label: 'Launch Sites',
              url:   '/launch_sites'
            )
          ]
        end
        let(:options) { super().merge(items: items) }

        it { expect(config.items).to be == items }
      end
    end

    describe '#label' do
      include_examples 'should define reader', :label, nil

      context 'when initialized with label: value' do
        let(:label)   { 'Rockets' }
        let(:options) { super().merge(label: label) }

        it { expect(config.label).to be == label }
      end
    end

    describe '#url' do
      include_examples 'should define reader', :url, '/'

      context 'when initialized with url: value' do
        let(:url)     { 'www.example.com' }
        let(:options) { super().merge(url: url) }

        it { expect(config.url).to be == url }
      end
    end
  end

  describe '::ItemDefinition' do
    subject(:item) { described_class.new(**options) }

    let(:described_class) { super()::ItemDefinition }
    let(:label)           { 'Launch Sites' }
    let(:url)             { '/launch_sites' }
    let(:options)         { { label: label, url: url } }

    describe '.new' do
      it 'should define the constructor' do
        expect(described_class)
          .to be_constructible
          .with(0).arguments
          .and_keywords(:items, :label, :right, :url)
      end
    end

    describe '#dropdown?' do
      include_examples 'should define predicate', :dropdown?, false

      context 'when initialized with items: value' do
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
        let(:options) { super().merge(items: items) }

        it { expect(item.dropdown?).to be true }
      end
    end

    describe '#items' do
      include_examples 'should define reader', :items, []

      context 'when initialized with items: an Array of Hashes' do
        let(:items) do
          [
            {
              label: 'Rockets',
              url:   '/launch_sites/rockets'
            },
            {
              label: 'Planes',
              url:   '/launch_sites/planes'
            },
            {
              label: 'Zeppelins',
              url:   '/launch_sites/zeppelins'
            }
          ]
        end
        let(:options)        { super().merge(items: items) }
        let(:expected_class) { View::Layouts::Page::Navigation::ItemDefinition }

        it { expect(item.items).to all be_a(expected_class) }

        it { expect(item.items.map(&:label)).to be == items.pluck(:label) }

        it { expect(item.items.map(&:url)).to be == items.pluck(:url) }
      end

      context 'when initialized with items: an Array of ItemDefinitions' do
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
        let(:options) { super().merge(items: items) }

        it { expect(item.items).to be == items }
      end
    end

    describe '#label' do
      include_examples 'should define reader', :label, -> { label }
    end

    describe '#right?' do
      include_examples 'should define predicate', :right?, false

      context 'when initialized with right: false' do
        let(:options) { super().merge(right: false) }

        it { expect(item.right?).to be false }
      end

      context 'when initialized with right: true' do
        let(:options) { super().merge(right: true) }

        it { expect(item.right?).to be true }
      end
    end

    describe '#url' do
      include_examples 'should define reader', :url, -> { url }
    end
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:config)
    end
  end

  describe '#call' do
    let(:rendered) { render_inline(navigation) }
    let(:snapshot) do
      <<~HTML
        <nav class="navbar is-size-5" role="navigation" aria-label="main-navigation">
          <div class="navbar-brand">
          <a class="navbar-item pl-1 has-text-black" href="/" target="_self">
          Sleeping King Studios
        </a>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
          <div class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item has-text-black" href="/rockets" target="_self">
          Rockets
        </a>
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
          </div>
          <div class="navbar-end">
            <a class="navbar-item has-text-black" href="/launch" target="_self">
          Launch
        </a>
          </div>
        </div>
        </nav>
      HTML
    end

    def prettify(html)
      html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    describe 'with config: a configuration object' do
      let(:config) do
        View::Layouts::Page::Navigation::Configuration.new(**super())
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
