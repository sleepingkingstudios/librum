# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Pages::Home::ShowPage, type: :component do
  subject(:page) { described_class.new(result) }

  let(:result)   { Cuprum::Result.new }
  let(:rendered) { render_inline(page) }
  let(:snapshot) do
    <<~HTML
      <h1 class="title">Greetings, Starfighter!</h1>

      <p>
        You have been recruited by the Star League to defend the frontier against Xur
        and the Ko-Dan Armada!
      </p>
    HTML
  end

  it 'should match the snapshot' do
    expect(rendered).to match_snapshot(snapshot)
  end
end
