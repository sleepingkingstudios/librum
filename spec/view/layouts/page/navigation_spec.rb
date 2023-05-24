# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Navigation, type: :component do
  subject(:component) { described_class.new }

  let(:rendered) { render_inline(component) }
  let(:snapshot) do
    <<~HTML
      <nav class="navbar is-size-5" role="navigation" aria-label="main-navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <i class="fa-solid fa-dice-d20 mr-1"></i>
            Home
          </a>

          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      </nav>
    HTML
  end

  it 'should render the home link' do
    expect(rendered).to have_link('Home', href: '/')
  end

  it 'should match the snapshot' do
    expect(rendered).to match_snapshot(snapshot)
  end
end
