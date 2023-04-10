# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/controller_contracts'
require 'support/contracts/responder_contracts'

RSpec.describe Api::Authentication::SessionsController, type: :controller do
  include Spec::Support::Contracts::ControllerContracts

  describe '::Responder' do
    include Spec::Support::Contracts::ResponderContracts

    subject(:responder) do
      described_class::Responder.new(**constructor_options)
    end

    let(:action_name) { 'process' }
    let(:resource)    { described_class.resource }
    let(:constructor_options) do
      {
        action_name:   action_name,
        member_action: false,
        resource:      resource,
        serializers:   Serializers::Json.default_serializers
      }
    end

    describe '#call' do
      it { expect(responder).to respond_to(:call).with(1).argument }

      describe 'with a passing result' do
        let(:value)  { { 'secret' => '12345' } }
        let(:result) { Cuprum::Result.new(value: value) }

        include_contract 'should respond with', 200 do
          { 'ok' => true, 'data' => value }
        end
      end

      describe 'with a failing result with an InvalidLogin error' do
        let(:error)  { Authentication::Errors::InvalidLogin.new }
        let(:result) { Cuprum::Result.new(error: error) }

        include_contract 'should respond with', 422 do
          { 'ok' => false, 'error' => error.as_json }
        end
      end

      describe 'with action: create' do
        let(:action_name) { 'create' }

        describe 'with a passing result' do
          let(:value)  { { 'secret' => '12345' } }
          let(:result) { Cuprum::Result.new(value: value) }

          include_contract 'should respond with', 201 do
            { 'ok' => true, 'data' => value }
          end
        end
      end
    end
  end

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Authentication::Resource }

    it { expect(resource.resource_name).to be == 'sessions' }

    it { expect(resource.skip_authentication.to_a).to be == %w[create] }
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
    Actions::Api::Authentication::Sessions::Create,
    member: false
end
