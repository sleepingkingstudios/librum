# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Authentication::Users::PasswordsController, type: :controller do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '::Responder' do
    include Librum::Core::RSpec::Contracts::Responders::HtmlContracts

    subject(:responder) do
      described_class::Responder.new(**constructor_options)
    end

    let(:action_name) { 'process' }
    let(:resource)    { controller.class.resource }
    let(:constructor_options) do
      {
        action_name:   action_name,
        controller:    controller,
        member_action: false,
        request:       Cuprum::Rails::Request.new
      }
    end

    describe '#call' do
      let(:response) { responder.call(result) }

      it { expect(responder).to respond_to(:call).with(1).argument }

      describe 'with action: update' do
        let(:action_name) { 'update' }

        describe 'with a passing result' do
          let(:result) { Cuprum::Result.new(status: :success) }
          let(:flash) do
            {
              success: {
                icon:    'circle-check',
                message: 'Successfully changed password'
              }
            }
          end

          include_contract 'should redirect to',
            '/authentication/user',
            flash: -> { flash }
        end

        describe 'with a failing result' do
          let(:result) { Cuprum::Result.new(status: :failure) }
          let(:flash) do
            {
              warning: {
                icon:    'exclamation-triangle',
                message: 'Unable to change password'
              }
            }
          end

          include_contract 'should render page',
            Librum::Core::View::Pages::Resources::EditPage,
            flash:       -> { flash },
            http_status: :unprocessable_entity
        end
      end
    end
  end

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
        },
        {
          active: true,
          label:  'Password',
          url:    '/authentication/user/password'
        }
      ]
    end

    include_examples 'should define class reader', :breadcrumbs, -> { expected }
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

    include_contract 'should define middleware',
      Librum::Iam::Authentication::Middleware::RegenerateSession,
      only: %i[update]
  end

  describe '.resource' do
    subject(:resource) { described_class.resource }

    let(:base_path) do
      Librum::Iam::Engine.config.authentication_user_password_path
    end
    let(:resource_class) do
      Librum::Iam::PasswordCredential
    end

    it { expect(resource).to be_a Librum::Core::Resources::ViewResource }

    it { expect(resource.base_path).to be == base_path }

    it { expect(resource.resource_class).to be resource_class }

    it { expect(resource.resource_name).to be == 'password' }

    it { expect(resource.singular?).to be true }

    it 'should define the form component' do
      expect(resource.form_component)
        .to be Librum::Iam::View::Components::Users::Passwords::Form
    end
  end

  describe '.responders' do
    include_contract 'should respond to format',
      :html,
      using: described_class::Responder

    include_contract 'should not respond to format', :json
  end

  include_contract 'should define action',
    :edit,
    Cuprum::Rails::Action,
    member: false

  include_contract 'should define action',
    :update,
    Librum::Iam::Actions::Users::Passwords::Update,
    member: false
end
