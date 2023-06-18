# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe HomeController, type: :controller do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.breadcrumbs' do
    let(:expected) { [{ label: 'Home', url: '/' }] }

    it 'should define the class reader' do
      expect(described_class)
        .to define_reader(:breadcrumbs)
        .with_value(expected)
    end
  end

  describe '.middleware' do
    include_contract 'should define middleware', lambda {
      be_a(Actions::View::Middleware::PageBreadcrumbs)
        .and have_attributes(breadcrumbs: described_class.breadcrumbs)
    }

    include_contract 'should define middleware', lambda {
      be_a(Actions::View::Middleware::PageNavigation)
        .and have_attributes(navigation: CoreController.navigation)
    }
  end

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Librum::Core::Resources::BaseResource }

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
