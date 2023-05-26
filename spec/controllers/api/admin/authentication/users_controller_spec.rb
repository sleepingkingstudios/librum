# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe Api::Admin::Authentication::UsersController do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    let(:permitted_attributes) do
      %w[email role slug username]
    end

    it { expect(resource).to be_a Authentication::Resource }

    it { expect(resource.default_order).to be :username }

    it { expect(resource.permitted_attributes).to be == permitted_attributes }

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
    :create,
    Actions::Api::Admin::Authentication::Users::Create,
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
    Actions::Api::Admin::Authentication::Users::Update,
    member: true
end
