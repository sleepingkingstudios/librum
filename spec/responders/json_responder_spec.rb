# frozen_string_literal: true

require 'rails_helper'

require 'stannum'

require 'support/contracts/responder_contracts'

RSpec.describe Responders::JsonResponder do
  include Spec::Support::Contracts::ResponderContracts

  subject(:responder) { described_class.new(**constructor_options) }

  let(:resource) { Cuprum::Rails::Resource.new(resource_name: 'rockets') }
  let(:constructor_options) do
    {
      action_name:     'launch',
      controller_name: 'Spec::CustomController',
      member_action:   true,
      resource:        resource,
      serializers:     Serializers::Json.default_serializers
    }
  end

  describe '#call' do
    it { expect(responder).to respond_to(:call).with(1).argument }

    describe 'with a passing result' do
      let(:result) { Cuprum::Result.new(value: { 'key' => 'value' }) }

      include_contract 'should respond with', 200 do
        { 'ok' => true, 'data' => result.value }
      end
    end

    describe 'with a failing result' do
      let(:error)  { Cuprum::Error.new(message: 'Something went wrong') }
      let(:result) { Cuprum::Result.new(error: error) }
      let(:expected_error) do
        {
          'data'    => {},
          'message' => 'Something went wrong when processing the request',
          'type'    => 'cuprum.error'
        }
      end

      include_contract 'should respond with', 500 do
        { 'ok' => false, 'error' => expected_error }
      end
    end

    describe 'with a failing result with a FailedValidation error' do
      let(:error) do
        Cuprum::Collections::Errors::FailedValidation.new(
          entity_class: Spec::Rocket,
          errors:       Stannum::Errors.new
        )
      end
      let(:result) { Cuprum::Result.new(error: error) }

      example_class 'Spec::Rocket'

      include_contract 'should respond with', 422 do
        { 'ok' => false, 'error' => result.error.as_json }
      end
    end

    describe 'with a failing result with a NotFound error' do
      let(:error) do
        Cuprum::Collections::Errors::NotFound.new(
          attributes:      { 'name' => 'SLS' },
          collection_name: 'rockets'
        )
      end
      let(:result) { Cuprum::Result.new(error: error) }

      include_contract 'should respond with', 404 do
        { 'ok' => false, 'error' => result.error.as_json }
      end
    end

    describe 'with a failing result with a NotUnique error' do
      let(:error) do
        Cuprum::Collections::Errors::NotUnique.new(
          attributes:      { 'name' => 'Falcon' },
          collection_name: 'rockets'
        )
      end
      let(:result) { Cuprum::Result.new(error: error) }

      include_contract 'should respond with', 404 do
        { 'ok' => false, 'error' => result.error.as_json }
      end
    end

    describe 'with a failing result with an InvalidParameters error' do
      let(:error) do
        errors = Stannum::Errors.new

        Cuprum::Rails::Errors::InvalidParameters.new(errors: errors)
      end
      let(:result) { Cuprum::Result.new(error: error) }

      include_contract 'should respond with', 400 do
        { 'ok' => false, 'error' => error.as_json }
      end
    end

    describe 'with a failing result with an InvalidPassword error' do
      let(:error) do
        Authentication::Errors::InvalidPassword.new
      end
      let(:result) { Cuprum::Result.new(error: error) }
      let(:expected_error) do
        Errors::AuthenticationFailed.new
      end

      include_contract 'should respond with', 401 do
        { 'ok' => false, 'error' => expected_error.as_json }
      end

      context 'when the Rails environment is development' do
        before(:example) do
          allow(Rails.env).to receive(:development?).and_return(true)
        end

        include_contract 'should respond with', 401 do
          { 'ok' => false, 'error' => result.error.as_json }
        end
      end
    end

    describe 'with a failing result with an InvalidToken error' do
      let(:error) do
        Authentication::Errors::InvalidToken.new
      end
      let(:result) { Cuprum::Result.new(error: error) }
      let(:expected_error) do
        Errors::AuthenticationFailed.new
      end

      include_contract 'should respond with', 401 do
        { 'ok' => false, 'error' => expected_error.as_json }
      end

      context 'when the Rails environment is development' do
        before(:example) do
          allow(Rails.env).to receive(:development?).and_return(true)
        end

        include_contract 'should respond with', 401 do
          { 'ok' => false, 'error' => result.error.as_json }
        end
      end
    end

    describe 'with a failing result with a MissingToken error' do
      let(:error) do
        Authentication::Errors::MissingToken.new
      end
      let(:result) { Cuprum::Result.new(error: error) }
      let(:expected_error) do
        Errors::AuthenticationFailed.new
      end

      include_contract 'should respond with', 401 do
        { 'ok' => false, 'error' => expected_error.as_json }
      end

      context 'when the Rails environment is development' do
        before(:example) do
          allow(Rails.env).to receive(:development?).and_return(true)
        end

        include_contract 'should respond with', 401 do
          { 'ok' => false, 'error' => result.error.as_json }
        end
      end
    end
  end
end
