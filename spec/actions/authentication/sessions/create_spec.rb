# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/resource'

RSpec.describe Actions::Authentication::Sessions::Create do
  subject(:action) do
    described_class.new(
      repository: repository,
      resource:   resource
    )
  end

  let(:repository) do
    Cuprum::Rails::Repository.new.tap do |repository|
      repository.find_or_create(record_class: Authentication::Credential)
      repository.find_or_create(record_class: Authentication::User)
    end
  end
  let(:resource) { Cuprum::Rails::Resource.new(resource_name: 'sessions') }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:repository, :resource)
    end
  end

  describe '#call' do
    let(:expected_error) do
      Authentication::Errors::InvalidLogin.new
    end
    let(:params) { {} }
    let(:native_session) do
      instance_double(ActionDispatch::Request::Session, '[]=': nil)
    end
    let(:request) do
      instance_double(
        Cuprum::Rails::Request,
        native_session: native_session,
        params:         params
      )
    end
    let(:contract) do
      constraint = Stannum::Constraints::Presence.new(message: "can't be blank")

      Stannum::Contracts::HashContract.new(allow_extra_keys: true) do
        key 'username', constraint
        key 'password', constraint
      end
    end

    it 'should define the method' do
      expect(action)
        .to be_callable
        .with(0).arguments
        .and_keywords(:request)
    end

    describe 'with empty params' do
      let(:expected_errors) { contract.errors_for(params) }
      let(:expected_error) do
        Authentication::Errors::InvalidLogin.new(errors: expected_errors)
      end

      it 'should return a failing result' do
        expect(action.call(request: request))
          .to be_a_failing_result
          .with_error(expected_error)
      end

      it 'should not update the session' do
        action.call(request: request)

        expect(native_session).not_to have_received(:[]=)
      end
    end

    describe 'with a password' do
      let(:params) { { 'password' => 'password' } }
      let(:expected_errors) { contract.errors_for(params) }
      let(:expected_error) do
        Authentication::Errors::InvalidLogin.new(errors: expected_errors)
      end

      it 'should return a failing result' do
        expect(action.call(request: request))
          .to be_a_failing_result
          .with_error(expected_error)
      end

      it 'should not update the session' do
        action.call(request: request)

        expect(native_session).not_to have_received(:[]=)
      end
    end

    describe 'with a username' do
      let(:params) { { 'username' => 'Alan Bradley' } }
      let(:expected_errors) { contract.errors_for(params) }
      let(:expected_error) do
        Authentication::Errors::InvalidLogin.new(errors: expected_errors)
      end

      it 'should return a failing result' do
        expect(action.call(request: request))
          .to be_a_failing_result
          .with_error(expected_error)
      end

      it 'should not update the session' do
        action.call(request: request)

        expect(native_session).not_to have_received(:[]=)
      end
    end

    describe 'with an invalid username and password' do
      let(:params) do
        { 'username' => 'Alan Bradley', 'password' => 'password' }
      end

      it 'should return a failing result' do
        expect(action.call(request: request))
          .to be_a_failing_result
          .with_error(expected_error)
      end

      it 'should not update the session' do
        action.call(request: request)

        expect(native_session).not_to have_received(:[]=)
      end
    end

    context 'when the user exists' do
      let(:user)   { FactoryBot.build(:authentication_user) }
      let(:params) { { 'username' => user.username, 'password' => '12345' } }

      before(:example) { user.save! }

      it 'should return a failing result' do
        expect(action.call(request: request))
          .to be_a_failing_result
          .with_error(expected_error)
      end

      it 'should not update the session' do
        action.call(request: request)

        expect(native_session).not_to have_received(:[]=)
      end

      context 'when an expired password credential exists' do
        let(:password) { 'tronlives' }
        let(:params)   { super().merge('password' => password) }
        let(:credential) do
          FactoryBot.build(
            :password_credential,
            active:     true,
            expires_at: 1.day.ago,
            password:   password,
            user:       user
          )
        end

        before(:example) { credential.save! }

        it 'should return a failing result' do
          expect(action.call(request: request))
            .to be_a_failing_result
            .with_error(expected_error)
        end

        it 'should not update the session' do
          action.call(request: request)

          expect(native_session).not_to have_received(:[]=)
        end
      end

      context 'when a non-matching password credential exists' do
        let(:credential) do
          FactoryBot.build(
            :password_credential,
            active: true,
            user:   user
          )
        end

        before(:example) { credential.save! }

        it 'should return a failing result' do
          expect(action.call(request: request))
            .to be_a_failing_result
            .with_error(expected_error)
        end

        it 'should not update the session' do
          action.call(request: request)

          expect(native_session).not_to have_received(:[]=)
        end
      end

      context 'when a valid password credential exists' do # rubocop:disable RSpec/MultipleMemoizedHelpers
        let(:password) { 'tronlives' }
        let(:credential) do
          FactoryBot.build(
            :password_credential,
            active:   true,
            password: password,
            user:     user
          )
        end
        let(:params) { super().merge('password' => password) }
        let(:decoded_token) do
          JWT.decode(
            encoded_token,
            Rails.application.secret_key_base,
            true,
            { algorithm: 'HS512' }
          )
        end
        let(:payload)      { decoded_token.first }
        let(:current_time) { Time.current }

        def encoded_token
          encoded = nil

          allow(native_session)
            .to receive(:[]=)
            .with('auth_token', an_instance_of(String)) do |_, token|
              encoded = token
            end

          action.call(request: request)

          encoded
        end

        before(:example) do
          credential.save!

          allow(Time).to receive(:current).and_return(current_time)
        end

        it 'should return a passing result' do
          expect(action.call(request: request))
            .to be_a_passing_result
            .with_value(deep_match({}))
        end

        it 'should update the session', :aggregate_failures do
          action.call(request: request)

          expect(native_session)
            .to have_received(:[]=)
            .with('auth_token', an_instance_of(String))
        end

        it { expect(payload['exp']).to be == (current_time + 1.day).to_i }

        it { expect(payload['sub']).to be == credential.id }
      end
    end
  end
end
