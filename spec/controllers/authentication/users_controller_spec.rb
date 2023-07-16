# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Authentication::UsersController, type: :controller do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.breadcrumbs' do
    let(:expected) do
      [
        {
          label: 'Home',
          url:   '/'
        },
        {
          label: 'User',
          url:   '/authentication/user'
        }
      ]
    end

    include_examples 'should define class reader',
      :breadcrumbs,
      -> { be == expected }
  end

  describe '.middleware' do
    include_contract 'should define middleware',
      lambda {
        be_a(Librum::Core::Actions::View::Middleware::PageBreadcrumbs)
          .and have_attributes(breadcrumbs: described_class.breadcrumbs)
      }

    include_contract 'should define middleware',
      lambda {
        be_a(Librum::Core::Actions::View::Middleware::PageNavigation)
          .and have_attributes(
            navigation: Librum::Tabletop::Engine.config.page_navigation
          )
      }
  end

  describe '.resource' do
    subject(:resource) { described_class.resource }

    it { expect(resource).to be_a Librum::Core::Resources::ViewResource }

    it { expect(resource.resource_class).to be == Librum::Iam::User }

    it { expect(resource.resource_name).to be == 'user' }

    it { expect(resource.singular?).to be true }

    it 'should define the block component' do
      expect(resource.block_component)
        .to be Librum::Iam::View::Components::Users::Block
    end
  end

  describe '.responders' do
    include_contract 'should respond to format',
      :html,
      using: Librum::Core::Responders::Html::ResourceResponder

    include_contract 'should not respond to format', :json
  end

  include_contract 'should define action',
    :show,
    Librum::Iam::Actions::Users::Show,
    member: false
end
