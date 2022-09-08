# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/controller_contracts'

RSpec.describe Api::Authentication::Users::PasswordsController do
  include Spec::Support::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Authentication::Resource }

    it { expect(resource.resource_class).to be == Authentication::Credential }

    it { expect(resource.skip_authentication).to be false }
  end

  include_contract 'should define action',
    :update,
    Actions::Api::Authentication::Users::Passwords::Update,
    member: true
end
