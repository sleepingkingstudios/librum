# frozen_string_literal: true

require 'rails_helper'

require 'support/components/mock_component'

RSpec.describe View::Layouts::Page::Banner, type: :component do
  subject(:component) { described_class.new }

  let(:rendered) { render_inline(component) }
  let(:snapshot) do
    <<~HTML
      <section class="banner hero is-small">
        <div class="hero-body">
          <p class="title">Librum</p>

          <p class="subtitle">Tabletop Campaign Companion</p>

          <mock name="Navigation"></mock>

          <hr class="is-fancy-hr">
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
      .and_return(Spec::Support::Components::MockComponent.new('Navigation'))
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
end
