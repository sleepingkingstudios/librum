# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Pages::LoginPage, type: :component do
  subject(:page) { described_class.new(result) }

  let(:result) { Cuprum::Result.new }

  describe '#call' do
    let(:rendered) { render_inline(page) }
    let(:snapshot) do
      <<~HTML
        <h1 class="title">Log In</h1>

        <form action="/authentication/session" accept-charset="UTF-8" method="post">
          <div class="field">
            <label for="username" class="label">Username</label>

            <div class="control has-icons-left">
              <input id="username" name="username" class="input" type="text">

              <span class="icon is-left is-small">
                <i class="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <label for="password" class="label">Password</label>

            <div class="control has-icons-left">
              <input id="password" name="password" class="input" type="password">

              <span class="icon is-left is-small">
                <i class="fas fa-key"></i>
              </span>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button type="submit" class="button is-primary">Log In</button>
            </div>
          </div>
        </form>
      HTML
    end

    it { expect(rendered).to match_snapshot(snapshot) }

    describe 'with a result with validation errors' do
      let(:errors) do
        Stannum::Errors
          .new
          .tap { |err| err['username'].add('invalid', message: 'is invalid') }
          .tap { |err| err['password'].add('missing', message: 'is missing') }
      end
      let(:error) do
        Librum::Iam::Authentication::Errors::InvalidLogin.new(errors: errors)
      end
      let(:result) { Cuprum::Result.new(error: error) }
      let(:snapshot) do
        <<~HTML
          <h1 class="title">Log In</h1>

          <form action="/authentication/session" accept-charset="UTF-8" method="post">
            <div class="field">
              <label for="username" class="label">Username</label>

              <div class="control has-icons-left has-icons-right">
                <input id="username" name="username" class="input is-danger" type="text">

                <span class="icon is-left is-small">
                  <i class="fas fa-user"></i>
                </span>

                <span class="icon is-right is-small">
                  <i class="fas fa-triangle-exclamation"></i>
                </span>
              </div>

              <p class="help is-danger">is invalid</p>
            </div>

            <div class="field">
              <label for="password" class="label">Password</label>

              <div class="control has-icons-left has-icons-right">
                <input id="password" name="password" class="input is-danger" type="password">

                <span class="icon is-left is-small">
                  <i class="fas fa-key"></i>
                </span>

                <span class="icon is-right is-small">
                  <i class="fas fa-triangle-exclamation"></i>
                </span>
              </div>

              <p class="help is-danger">is missing</p>
            </div>

            <div class="field">
              <div class="control">
                <button type="submit" class="button is-primary">Log In</button>
              </div>
            </div>
          </form>
        HTML
      end

      it { expect(rendered).to match_snapshot(snapshot) }
    end
  end
end
