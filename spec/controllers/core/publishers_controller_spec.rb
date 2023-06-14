# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe Core::PublishersController, type: :controller do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.resource' do
    subject(:resource) { described_class.resource }

    let(:permitted_attributes) do
      %w[
        name
        slug
        website
      ]
    end

    it { expect(resource).to be_a Librum::Core::Resources::ViewResource }

    it { expect(resource.default_order).to be :name }

    it { expect(resource.permitted_attributes).to be == permitted_attributes }

    it { expect(resource.resource_class).to be == Publisher }

    it { expect(resource.resource_name).to be == 'publishers' }

    it 'should define the table component' do
      expect(resource.table_component)
        .to be View::Components::Core::Publishers::Table
    end
  end

  describe '.responders' do
    include_contract 'should respond to format',
      :html,
      using: Responders::Html::ResourceResponder

    include_contract 'should not respond to format', :json
  end

  include_contract 'should define action',
    :index,
    Librum::Core::Actions::Index,
    member: false

  include_contract 'should define action',
    :show,
    Librum::Core::Actions::Show,
    member: true
end
