# frozen_string_literal: true

require 'rails_helper'

require 'support/components/mock_component'

RSpec.describe View::Layouts::Page, type: :component do
  subject(:component) { described_class.new.with_content(content) }

  let(:content)  { 'Greetings, Starfighter!' }
  let(:rendered) { render_inline(component) }
  let(:snapshot) do
    <<~HTML
      <div class="page is-flex is-flex-direction-column">
        <mock name="Banner"></mock>

        <section class="section primary-content is-flex-grow-1">
          <div class="container">
            Greetings, Starfighter!
          </div>
        </section>

        <mock name="Footer"></mock>
      </div>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(%r{</mock>\n\n}, "</mock>\n")
  end

  before(:example) do
    allow(View::Layouts::Page::Banner)
      .to receive(:new)
      .and_return(Spec::Support::Components::MockComponent.new('Banner'))

    allow(View::Layouts::Page::Footer)
      .to receive(:new)
      .and_return(Spec::Support::Components::MockComponent.new('Footer'))
  end

  it 'should render the content' do
    expect(rendered).to have_text(content)
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end
end
