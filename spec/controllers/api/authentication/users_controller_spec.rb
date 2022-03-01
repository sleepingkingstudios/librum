# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/controller_contracts'

RSpec.describe Api::Authentication::UsersController do
  include Spec::Support::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    let(:permitted_attributes) do
      %w[email role slug username]
    end

    it { expect(resource).to be_a Cuprum::Rails::Resource }

    it { expect(resource.default_order).to be :username }

    it { expect(resource.permitted_attributes).to be == permitted_attributes }

    it { expect(resource.resource_class).to be == Authentication::User }
  end

  describe '.serializers' do
    include_contract 'should use the default serializers'

    include_contract 'should serialize',
      Authentication::User,
      using: Serializers::Json::Authentication::UserSerializer
  end

  include_contract 'should define action',
    :create,
    Actions::Api::Authentication::Users::Create,
    member: false

  include_contract 'should define action',
    :destroy,
    Actions::Api::Authentication::Users::Destroy,
    member: true

  include_contract 'should define action',
    :index,
    Cuprum::Rails::Actions::Index,
    member: false

  include_contract 'should define action',
    :show,
    Actions::Api::Authentication::Users::Show,
    member: true

  include_contract 'should define action',
    :update,
    Actions::Api::Authentication::Users::Update,
    member: true
end
