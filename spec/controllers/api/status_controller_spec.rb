# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe Api::StatusController do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Librum::Core::Resources::BaseResource }

    it { expect(resource.resource_name).to be == 'status' }

    it { expect(resource.singular?).to be true }

    it { expect(resource.skip_authentication).to be true }
  end

  include_contract 'should define action',
    :show,
    Actions::Api::Status::Show,
    member: true
end
