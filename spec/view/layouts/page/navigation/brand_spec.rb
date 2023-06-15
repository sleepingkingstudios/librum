# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Navigation::Brand, type: :component do
  subject(:brand) { described_class.new(config: config) }

  let(:config_options) { { label: 'Sleeping King Studios' } }
  let(:config) do
    View::Layouts::Page::Navigation::Configuration.new(**config_options)
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
    let(:rendered) { render_inline(brand) }
    let(:snapshot) do
      <<~HTML
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
      HTML
    end

    def prettify(html)
      html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    describe 'with configuration with icon: value' do
      let(:config_options) { super().merge(icon: 'apple-whole') }
      let(:snapshot) do
        <<~HTML
          <div class="navbar-brand">
            <a class="navbar-item pl-1 has-text-black" href="/" target="_self">
            <span class="icon-text">
            <span class="icon">
              <i class="fas fa-apple-whole"></i>
            </span>
            <span>Sleeping King Studios</span>
          </span>
          </a>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    describe 'with configuration with url: value' do
      let(:config_options) { super().merge(url: 'www.example.com') }
      let(:snapshot) do
        <<~HTML
          <div class="navbar-brand">
            <a class="navbar-item pl-1 has-text-black" href="https://www.example.com" target="_blank">
            Sleeping King Studios
          </a>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
