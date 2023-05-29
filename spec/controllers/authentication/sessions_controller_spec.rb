# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

require 'support/contracts/responder_contracts'

RSpec.describe Authentication::SessionsController, type: :controller do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '::Responder' do
    include Spec::Support::Contracts::ResponderContracts

    subject(:responder) do
      described_class::Responder.new(**constructor_options)
    end

    let(:action_name) { 'process' }
    let(:resource)    { described_class.resource }
    let(:constructor_options) do
      {
        action_name:     action_name,
        controller_name: 'Authentication::SessionsController',
        member_action:   false,
        resource:        resource
      }
    end

    describe '#call' do
      it { expect(responder).to respond_to(:call).with(1).argument }

      describe 'with action: create' do
        let(:action_name) { 'create' }

        describe 'with a passing result' do
          let(:result) { Cuprum::Result.new(status: :success) }

          include_contract 'should redirect back'
        end

        describe 'with a failing result with an InvalidLogin error' do
          let(:error)  { Authentication::Errors::InvalidLogin.new }
          let(:result) { Cuprum::Result.new(error: error) }

          include_contract 'should render component',
            View::Pages::LoginPage,
            layout: 'login',
            status: :unprocessable_entity do
              it { expect(response.component.result).to be result }
            end
        end
      end

      describe 'with action: destroy' do
        let(:action_name) { 'destroy' }

        describe 'with a passing result' do
          let(:result) { Cuprum::Result.new(status: :success) }

          include_contract 'should redirect to', '/'
        end
      end
    end
  end

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Authentication::Resource }

    it { expect(resource.resource_name).to be == 'sessions' }

    it { expect(resource.skip_authentication.to_a).to be == %w[create destroy] }
  end

  describe '.responders' do
    include_contract 'should respond to format',
      :html,
      using: described_class::Responder
  end

  include_contract 'should define action',
    :create,
    Actions::Authentication::Sessions::Create,
    member: false

  include_contract 'should define action',
    :destroy,
    Actions::Authentication::Sessions::Destroy,
    member: false
end
