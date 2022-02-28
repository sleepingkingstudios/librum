# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/controller_contracts'

RSpec.describe Api::SessionsController, type: :controller do
  include Spec::Support::Contracts::ControllerContracts

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
