# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Banner, type: :component do
  subject(:component) { described_class.new(**options) }

  let(:options)  { {} }
  let(:rendered) { render_inline(component) }
  let(:snapshot) do
    <<~HTML
      <section class="banner hero is-small">
        <div class="hero-body">
          <div class="container">
            <div>
              <p class="title">Librum</p>

              <p class="subtitle">Tabletop Campaign Companion</p>

              <mock name="Navigation"></mock>
            </div>

            <hr class="is-fancy-hr">
          </div>
        </div>
      </section>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(%r{</mock>\n\n}, "</mock>\n")
  end

  before(:example) do
    allow(View::Layouts::Page::Navigation)
      .to receive(:new)
      .and_return(View::Components::MockComponent.new('Navigation'))
  end

  it 'should render the title' do
    expect(rendered).to have_text('Librum')
  end

  it 'should render the subtitle' do
    expect(rendered).to have_text('Tabletop Campaign Companion')
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
end
