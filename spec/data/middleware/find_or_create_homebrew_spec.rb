# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Data::Middleware::FindOrCreateHomebrew do
  subject(:middleware) { described_class.new(repository: repository) }

  let(:repository) { Cuprum::Rails::Repository.new }

  describe '#call' do
    let(:attributes)   { FactoryBot.attributes_for(:authentication_user) }
    let(:action)       { 'create' }
    let(:user)         { FactoryBot.create(:authentication_user) }
    let(:result)       { Cuprum::Result.new(value: [action, user]) }
    let(:next_command) { instance_double(Cuprum::Command, call: result) }

    def call_middleware
      middleware.call(next_command, attributes: attributes)
    end

    it 'should define the method' do
      expect(middleware)
        .to be_callable
        .with(1).argument
        .and_keywords(:attributes)
    end

    it 'should call the next command' do
      call_middleware

      expect(next_command).to have_received(:call).with(attributes: attributes)
    end

    it 'should return a passing result' do
      expect(call_middleware)
        .to be_a_passing_result
        .with_value([action, user])
    end

    context 'when the user does not have a homebrew source' do
      let(:homebrew) { user.reload.homebrew_source }
      let(:expected) do
        {
          name:    "User: #{user.username}",
          slug:    "user-#{user.slug}",
          user_id: user.id
        }
      end

      it 'should create a homebrew source' do
        expect { call_middleware }
          .to change(Sources::Homebrew, :count)
          .by(1)
      end

      it 'should set the source attributes' do
        call_middleware

        expect(homebrew).to have_attributes(expected)
      end
    end

    context 'when the user has a homebrew source' do
      let(:homebrew) do
        FactoryBot.build(
          :homebrew,
          user: user,
          name: 'Example Source',
          slug: 'example-source'
        )
      end
      let(:expected) do
        {
          name:    "User: #{user.username}",
          slug:    "user-#{user.slug}",
          user_id: user.id
        }
      end

      before(:example) { homebrew.save(validate: false) }

      it { expect { call_middleware }.not_to change(Sources::Homebrew, :count) }

      it 'should set the source attributes' do
        call_middleware

        expect(homebrew.reload).to have_attributes(expected)
      end
    end
  end
end
