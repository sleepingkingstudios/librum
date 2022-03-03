# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/controller_contracts'

RSpec.describe ApiController, type: :controller do
  include Spec::Support::Contracts::ControllerContracts

  describe '.default_format' do
    it { expect(described_class.default_format).to be :json }
  end

  describe '.repository' do
    subject(:repository) { described_class.repository }

    it { expect(repository).to be_a Cuprum::Rails::Repository }

    it { expect(repository.key?('authentication/credentials')).to be true }

    it { expect(repository.key?('authentication/users')).to be true }
  end

  describe '.responders' do
    include_contract 'should respond to',
      :json,
      using: ApplicationResponder

    include_contract 'should not respond to', :html
  end

  describe '.serializers' do
    include_contract 'should use the default serializers'
  end

  include_contract 'should define middleware',
    Actions::Api::Middleware::Authenticate
end
