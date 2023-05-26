# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe Api::Core::GameSystemsController do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    let(:permitted_attributes) do
      %w[publisher_id name slug edition]
    end

    it { expect(resource).to be_a Authentication::Resource }

    it { expect(resource.default_order).to be == %w[name edition] }

    it { expect(resource.permitted_attributes).to be == permitted_attributes }

    it { expect(resource.resource_class).to be == GameSystem }

    it { expect(resource.skip_authentication).to be false }
  end

  describe '.serializers' do
    include_contract 'should use the default serializers'

    include_contract 'should serialize',
      GameSystem,
      using: Serializers::Json::GameSystemSerializer
  end

  include_contract 'should define action',
    :create,
    Librum::Core::Actions::Create,
    member: false

  include_contract 'should define action',
    :destroy,
    Librum::Core::Actions::Destroy,
    member: true

  include_contract 'should define action',
    :index,
    Librum::Core::Actions::Index,
    member: false

  include_contract 'should define action',
    :show,
    Librum::Core::Actions::Show,
    member: true

  include_contract 'should define action',
    :update,
    Librum::Core::Actions::Update,
    member: true
end
