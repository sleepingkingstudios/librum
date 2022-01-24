# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/controller_contracts'

RSpec.describe Api::Sources::WebsitesController do
  include Spec::Support::Contracts::ControllerContracts

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

    it { expect(resource).to be_a Cuprum::Rails::Resource }

    it { expect(resource.default_order).to be :name }

    it { expect(resource.permitted_attributes).to be == permitted_attributes }

    it { expect(resource.resource_class).to be == Sources::Website }
  end

  describe '.serializers' do
    include_contract 'should use the default serializers'

    include_contract 'should serialize',
      Sources::Website,
      using: Serializers::Json::Sources::WebsiteSerializer
  end

  include_contract 'should define action',
    :create,
    Actions::Api::Sources::Create,
    member: false

  include_contract 'should define action',
    :destroy,
    Actions::Api::Sources::Destroy,
    member: true

  include_contract 'should define action',
    :index,
    Cuprum::Rails::Actions::Index,
    member: false

  include_contract 'should define action',
    :show,
    Actions::Api::Sources::Show,
    member: true

  include_contract 'should define action',
    :update,
    Actions::Api::Sources::Update,
    member: true
end
