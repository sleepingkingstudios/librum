# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/controller_contracts'

RSpec.describe Api::PublishersController, type: :controller do
  include Spec::Support::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    let(:permitted_attributes) do
      %w[name slug website]
    end

    it { expect(resource).to be_a Cuprum::Rails::Resource }

    it { expect(resource.default_order).to be :name }

    it { expect(resource.permitted_attributes).to be == permitted_attributes }

    it { expect(resource.resource_class).to be == Publisher }
  end

  describe '.serializers' do
    include_contract 'should use the default serializers'

    include_contract 'should serialize',
      Publisher,
      using: Serializers::Json::PublisherSerializer
  end

  include_contract 'should define action',
    :create,
    Actions::Api::Publishers::Create,
    member: false

  include_contract 'should define action',
    :destroy,
    Actions::Api::Publishers::Destroy,
    member: true

  include_contract 'should define action',
    :index,
    Cuprum::Rails::Actions::Index,
    member: false

  include_contract 'should define action',
    :show,
    Actions::Api::Publishers::Show,
    member: true

  include_contract 'should define action',
    :update,
    Actions::Api::Publishers::Update,
    member: true
end
