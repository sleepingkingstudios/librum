# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe Api::Core::Sources::WebsitesController do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    let(:permitted_attributes) do
      %w[
        game_system_id
        publisher_id
        name
        slug
        edition
        official
        playtest
        base_url
      ]
    end

    it { expect(resource).to be_a Authentication::Resource }

    it { expect(resource.default_order).to be :name }

    it { expect(resource.permitted_attributes).to be == permitted_attributes }

    it { expect(resource.resource_class).to be == Sources::Website }

    it { expect(resource.skip_authentication).to be false }
  end

  describe '.serializers' do
    include_contract 'should use the default serializers'

    include_contract 'should serialize',
      Sources::Website,
      using: Serializers::Json::Sources::WebsiteSerializer
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
