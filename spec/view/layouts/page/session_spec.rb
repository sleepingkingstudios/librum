# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Session, type: :component do
  subject(:component) { described_class.new(current_user: current_user) }

  let(:current_user) do
    FactoryBot.build(:authentication_user, username: 'Alan Bradley')
  end
  let(:rendered) { render_inline(component) }
  let(:snapshot) do
    <<~HTML
      <div class="block user-session">
        <div class="icon-text">
          <span class="icon mr-1">
            <i class="fa-solid fa-user"></i>
          </span>

          You are currently logged in as Alan Bradley.

          <form class="destroy_session_form" action="/authentication/session" accept-charset="UTF-8" method="post">
      <input type="hidden" name="_method" value="delete" autocomplete="off">
            <div class="buttons is-right">
              <input type="submit" name="commit" value="Log Out" class="button is-danger is-inverted" data-disable-with="Log Out">
            </div>
      </form>  </div>
      </div>
    HTML
  end

  it 'should match the snapshot' do
    expect(rendered).to match_snapshot(snapshot)
  end
end
