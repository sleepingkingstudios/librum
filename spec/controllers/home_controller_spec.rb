# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe HomeController, type: :controller do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Authentication::Resource }

    it { expect(resource.resource_name).to be == 'home' }
  end

  include_contract 'should define action',
    :not_found,
    Actions::RenderView,
    member: false

  include_contract 'should define action',
    :show,
    Actions::RenderView,
    member: false
end
