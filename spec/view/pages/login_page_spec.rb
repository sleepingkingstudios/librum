# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Pages::LoginPage, type: :component do
  subject(:page) { described_class.new(result) }

  let(:result)   { Cuprum::Result.new }
  let(:rendered) { render_inline(page) }
  let(:snapshot) do
    <<~HTML
      <h1 class="title">Log In</h1>
      <form action="/authentication/session" accept-charset="UTF-8" method="post">
        <mock name="username" icon="user" errors="nil"></mock>
        <mock name="password" icon="key" errors="nil" type="password"></mock>
        <div class="field">
          <div class="control">
            <button type="submit" class="button is-primary">Log In</button>
          </div>
        </div>
      </form>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n{2,}/, "\n")
  end

  before(:example) do
    allow(View::Components::FormField).to receive(:new) do |name, options|
      View::Components::MockComponent.new(
        'FormField',
        name: name,
        **options
      )
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with a result with validation errors' do
    let(:errors) do
      instance_double(
        Stannum::Errors,
        inspect:       '(Stannum::Errors)',
        with_messages: nil
      )
        .tap { |err| allow(err).to receive(:with_messages).and_return(err) }
    end
    let(:error)  { Authentication::Errors::InvalidLogin.new(errors: errors) }
    let(:result) { Cuprum::Result.new(error: error) }
    let(:snapshot) do
      <<~HTML
        <h1 class="title">Log In</h1>
        <form action="/authentication/session" accept-charset="UTF-8" method="post">
          <mock name="username" icon="user" errors="(Stannum::Errors)"></mock>
          <mock name="password" icon="key" errors="(Stannum::Errors)" type="password"></mock>
          <div class="field">
            <div class="control">
              <button type="submit" class="button is-primary">Log In</button>
            </div>
          </div>
        </form>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
