# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/controller_contracts'
require 'support/contracts/responder_contracts'

RSpec.describe Api::SessionsController, type: :controller do
  include Spec::Support::Contracts::ControllerContracts

  describe '::Responder' do
    include Spec::Support::Contracts::ResponderContracts

    subject(:responder) do
      described_class::Responder.new(**constructor_options)
    end

    let(:resource) { Cuprum::Rails::Resource.new(resource_name: 'sessions') }
    let(:constructor_options) do
      {
        action_name:   'create',
        member_action: false,
        resource:      resource,
        serializers:   Serializers::Json.default_serializers
      }
    end

    describe '#call' do
      it { expect(responder).to respond_to(:call).with(1).argument }

      describe 'with a failing result with an InvalidPassword error' do
        let(:error)  { ::Authentication::Errors::InvalidPassword.new }
        let(:result) { Cuprum::Result.new(error: error) }

        include_contract 'should respond with', 422 do
          { 'ok' => false, 'error' => error.as_json }
        end
      end
    end
  end

  describe '.repository' do
    subject(:repository) { described_class.repository }

    it { expect(repository).to be_a Cuprum::Rails::Repository }

    it { expect(repository.key?('authentication/credentials')).to be true }

    it { expect(repository.key?('authentication/users')).to be true }
  end

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Cuprum::Rails::Resource }

    it { expect(resource.resource_name).to be == 'sessions' }
  end

  describe '.responders' do
    include_contract 'should respond to',
      :json,
      using: described_class::Responder
  end

  describe '.serializers' do
    include_contract 'should use the default serializers'

    include_contract 'should serialize',
      Authentication::User,
      using: Serializers::Json::Authentication::UserSerializer
  end

  include_contract 'should define action',
    :create,
    Actions::Api::Sessions::Create,
    member: false
end
