# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Data::Middleware::GeneratePassword do
  subject(:middleware) { described_class.new(repository: repository) }

  let(:repository) { Cuprum::Rails::Repository.new }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_any_keywords
    end
  end

  describe '#call' do
    let(:next_command) do
      Cuprum::Command.new do |attributes:|
        [:create, Authentication::User.create!(attributes)]
      end
    end
    let(:attributes) do
      {
        email:    'user@example.com',
        slug:     'user',
        username: 'User',
        role:     Authentication::User::Roles::USER
      }
    end
    let(:expected_attributes) { attributes }
    let(:expected_value) do
      [
        :create,
        an_instance_of(Authentication::User).and(
          have_attributes(expected_attributes)
        )
      ]
    end

    it 'should return a passing result' do
      expect(middleware.call(next_command, attributes: attributes))
        .to be_a_passing_result
        .with_value(deep_match(expected_value))
    end

    describe 'with attributes: a Hash with password: value' do
      let(:password)   { 'tronlives' }
      let(:attributes) { super().merge('password' => password) }
      let(:expected_attributes) do
        attributes.dup.tap { |hsh| hsh.delete('password') }
      end

      it 'should return a passing result' do
        expect(middleware.call(next_command, attributes: attributes))
          .to be_a_passing_result
          .with_value(deep_match(expected_value))
      end

      it 'should create the password credential' do
        expect { middleware.call(next_command, attributes: attributes) }
          .to change(Authentication::Credential, :count)
          .by(1)
      end

      it 'should set the password' do
        _, user    = middleware.call(next_command, attributes: attributes).value
        credential = user.credentials.last
        command    =
          Authentication::Passwords::Match.new(credential.encrypted_password)

        expect(command.call(password)).to be_a_passing_result
      end
    end
  end
end
