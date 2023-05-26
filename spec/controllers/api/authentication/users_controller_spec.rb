# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe Api::Authentication::UsersController do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Authentication::Resource }

    it { expect(resource.resource_class).to be == Authentication::User }

    it { expect(resource.skip_authentication).to be false }
  end

  describe '.serializers' do
    include_contract 'should use the default serializers'

    include_contract 'should serialize',
      Authentication::User,
      using: Serializers::Json::Authentication::UserSerializer
  end

  include_contract 'should define action',
    :show,
    Actions::Api::Authentication::Users::Show,
    member: true
end
