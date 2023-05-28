# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Pages::LoginPage, type: :component do
  subject(:page) { described_class.new(result) }

  let(:result)   { Cuprum::Result.new }
  let(:rendered) { render_inline(page) }
  let(:snapshot) do
    <<~HTML
      <h1 class="title">Log In</h1>

      <p>You are not logged in.</p>
    HTML
  end

  it 'should match the snapshot' do
    expect(rendered).to match_snapshot(snapshot)
  end
end
