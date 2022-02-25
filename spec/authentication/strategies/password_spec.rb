# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'

RSpec.describe Authentication::Strategies::Password do
  subject(:command) { described_class.new(repository: repository) }

  let(:repository) do
    Cuprum::Rails::Repository.new.tap do |repository|
      repository.find_or_create(record_class: Authentication::Credential)
      repository.find_or_create(record_class: Authentication::User)
    end
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:repository)
    end
  end

  describe '#call' do
    let(:expected_error) do
      Authentication::Errors::InvalidPassword.new
    end
    let(:params)  { {} }
    let(:request) { instance_double(Cuprum::Rails::Request, params: params) }

    it { expect(command).to be_callable.with(1).argument }

    describe 'with an empty Hash' do
      it 'should return a failing result' do
        expect(command.call(request))
          .to be_a_failing_result
          .with_error(expected_error)
      end
    end

    describe 'with a password' do
      let(:params) { { 'password' => 'password' } }

      it 'should return a failing result' do
        expect(command.call(request))
          .to be_a_failing_result
          .with_error(expected_error)
      end
    end

    describe 'with a username' do
      let(:params) { { 'username' => 'Alan Bradley' } }

      it 'should return a failing result' do
        expect(command.call(request))
          .to be_a_failing_result
          .with_error(expected_error)
      end
    end

    describe 'with an invalid username and password' do
      let(:params) do
        { 'username' => 'Alan Bradley', 'password' => 'password' }
      end

      it 'should return a failing result' do
        expect(command.call(request))
          .to be_a_failing_result
          .with_error(expected_error)
      end
    end

    context 'when the user exists' do
      let(:user)   { FactoryBot.build(:authentication_user) }
      let(:params) { { 'username' => user.username, 'password' => '12345' } }

      before(:example) { user.save! }

      it 'should return a failing result' do
        expect(command.call(request))
          .to be_a_failing_result
          .with_error(expected_error)
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
          expect(command.call(request))
            .to be_a_failing_result
            .with_error(expected_error)
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
          expect(command.call(request))
            .to be_a_failing_result
            .with_error(expected_error)
        end
      end

      context 'when a valid password credential exists' do
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
        let(:expected_value) do
          be_a(Authorization::Session).and(
            have_attributes(credential: credential)
          )
        end

        before(:example) { credential.save! }

        it 'should return a passing result' do
          expect(command.call(request))
            .to be_a_passing_result
            .with_value(expected_value)
        end
      end
    end
  end

  describe '#repository' do
    include_examples 'should define reader', :repository, -> { repository }
  end
end
