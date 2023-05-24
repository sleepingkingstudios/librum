# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Footer, type: :component do
  subject(:component) { described_class.new }

  let(:rendered) { render_inline(component) }
  let(:snapshot) do
    <<~HTML
      <footer class="footer has-text-centered">
        <div class="container">
          What Lies Beyond The Farthest Reaches Of The Skies?
        </div>
      </footer>
    HTML
  end

  it 'should match the snapshot' do
    expect(rendered).to match_snapshot(snapshot)
  end
end
