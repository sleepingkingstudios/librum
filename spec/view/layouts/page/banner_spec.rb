# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Banner, type: :component do
  subject(:component) { described_class.new(**options) }

  let(:options) { {} }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:navigation)
    end
  end

  describe '#call' do
    let(:rendered) { render_inline(component) }
    let(:snapshot) do
      <<~HTML
        <section class="banner hero is-small">
          <div class="hero-body">
            <div class="container">
              <div>
                <p class="title">Librum</p>
                <p class="subtitle">Tabletop Campaign Companion</p>
              </div>
              <hr class="is-fancy-hr">
            </div>
          </div>
        </section>
      HTML
    end

    def prettify(html)
      html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    describe 'with navigation: false' do
      let(:options) { super().merge(navigation: false) }
      let(:snapshot) do
        <<~HTML
          <section class="banner hero is-small">
            <div class="hero-body">
              <div class="container">
                <div>
                  <p class="title">Librum</p>
                  <p class="subtitle">Tabletop Campaign Companion</p>
                </div>
                <hr class="is-fancy-hr">
              </div>
            </div>
          </section>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    describe 'with navigation: value' do
      let(:navigation) { { label: 'Sleeping King Studios' } }
      let(:options)    { super().merge(navigation: navigation) }
      let(:snapshot) do
        <<~HTML
          <section class="banner hero is-small">
            <div class="hero-body">
              <div class="container">
                <div>
                  <p class="title">Librum</p>
                  <p class="subtitle">Tabletop Campaign Companion</p>
                  <mock name="Navigation" config='{:label=&gt;"Sleeping King Studios"}'></mock>
                </div>
                <hr class="is-fancy-hr">
              </div>
            </div>
          </section>
        HTML
      end

      before(:example) do
        allow(View::Layouts::Page::Navigation).to receive(:new) do |options|
          View::Components::MockComponent.new('Navigation', **options)
        end
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
