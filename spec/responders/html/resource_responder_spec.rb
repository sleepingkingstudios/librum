# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Responders::Html::ResourceResponder do
  subject(:responder) { described_class.new(**constructor_options) }

  shared_context 'when the page is defined' do |component_name|
    let(:component_class) { component_name.constantize }

    example_class component_name, View::Components::Page
  end

  let(:action_name)     { :implement }
  let(:controller_name) { 'CustomController' }
  let(:member_action)   { false }
  let(:resource) do
    Cuprum::Rails::Resource.new(resource_name: 'resource')
  end
  let(:constructor_options) do
    {
      action_name:     action_name,
      controller_name: controller_name,
      member_action:   member_action,
      resource:        resource
    }
  end

  describe '#call' do
    let(:result)   { Cuprum::Result.new }
    let(:response) { responder.call(result) }
    let(:expected_page) do
      'View::Pages::Custom::ImplementPage'
    end

    it { expect(responder).to respond_to(:call).with(1).argument }

    describe 'with a failing result' do
      let(:error)  { Cuprum::Error.new(message: 'Something went wrong') }
      let(:result) { Cuprum::Result.new(error: error) }

      it { expect(response).to be_a Responses::Html::RenderComponentResponse }

      it { expect(response.component).to be_a View::Pages::MissingPage }

      it { expect(response.component.action_name).to be == action_name }

      it { expect(response.component.controller_name).to be == controller_name }

      it { expect(response.component.expected_page).to be == expected_page }

      it { expect(response.component.result).to be result }

      it { expect(response.assigns).to be == {} }

      it { expect(response.layout).to be nil }

      it { expect(response.status).to be :internal_server_error }

      context 'when the generic resource page is defined' do
        include_context 'when the page is defined',
          'View::Pages::Resources::ImplementPage'

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

        it { expect(response.component.resource).to be resource }

        it { expect(response.assigns).to be == {} }

        it { expect(response.flash).to be == {} }

        it { expect(response.layout).to be nil }

        it { expect(response.status).to be :internal_server_error }
      end

      context 'when the specific resource page is defined' do
        include_context 'when the page is defined',
          'View::Pages::Custom::ImplementPage'

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

        it { expect(response.component.resource).to be resource }

        it { expect(response.assigns).to be == {} }

        it { expect(response.flash).to be == {} }

        it { expect(response.layout).to be nil }

        it { expect(response.status).to be :internal_server_error }
      end
    end

    describe 'with a failing result with an AuthenticationError' do
      let(:error) do
        Librum::Core::Errors::AuthenticationError
          .new(message: 'Unable to log in')
      end
      let(:result) { Cuprum::Result.new(error: error) }

      it { expect(response).to be_a Responses::Html::RenderComponentResponse }

      it { expect(response.component).to be_a View::Pages::LoginPage }

      it { expect(response.component.result).to be result }

      it { expect(response.assigns).to be == {} }

      it { expect(response.layout).to be == 'login' }

      it { expect(response.status).to be :unauthorized }
    end

    describe 'with a passing result' do
      let(:value)  { { ok: true } }
      let(:result) { Cuprum::Result.new(value: value) }

      it { expect(response).to be_a Responses::Html::RenderComponentResponse }

      it { expect(response.component).to be_a View::Pages::MissingPage }

      it { expect(response.component.action_name).to be == action_name }

      it { expect(response.component.controller_name).to be == controller_name }

      it { expect(response.component.expected_page).to be == expected_page }

      it { expect(response.component.result).to be result }

      it { expect(response.assigns).to be == {} }

      it { expect(response.layout).to be nil }

      it { expect(response.status).to be :internal_server_error }

      context 'when the generic resource page is defined' do
        include_context 'when the page is defined',
          'View::Pages::Resources::ImplementPage'

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

        it { expect(response.component.resource).to be resource }

        it { expect(response.assigns).to be == {} }

        it { expect(response.flash).to be == {} }

        it { expect(response.layout).to be nil }

        it { expect(response.status).to be :ok }
      end

      context 'when the specific resource page is defined' do
        include_context 'when the page is defined',
          'View::Pages::Custom::ImplementPage'

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

        it { expect(response.component.resource).to be resource }

        it { expect(response.assigns).to be == {} }

        it { expect(response.flash).to be == {} }

        it { expect(response.layout).to be nil }

        it { expect(response.status).to be :ok }
      end
    end
  end

  describe '#format' do
    include_examples 'should define reader', :format, :html
  end

  describe '#render_component' do
    let(:result)        { Cuprum::Result.new }
    let(:options)       { {} }
    let(:response)      { responder.render_component(result, **options) }
    let(:expected_page) { 'View::Pages::Custom::ImplementPage' }

    it 'should define the method' do
      expect(responder)
        .to respond_to(:render_component)
        .with(1).argument
        .and_keywords(:flash, :status)
    end

    it { expect(response).to be_a Responses::Html::RenderComponentResponse }

    it { expect(response.component).to be_a View::Pages::MissingPage }

    it { expect(response.component.action_name).to be == action_name }

    it { expect(response.component.controller_name).to be == controller_name }

    it { expect(response.component.expected_page).to be == expected_page }

    it { expect(response.component.resource).to be nil }

    it { expect(response.component.result).to be result }

    it { expect(response.assigns).to be == {} }

    it { expect(response.flash).to be == {} }

    it { expect(response.layout).to be nil }

    it { expect(response.status).to be :internal_server_error }

    context 'when the generic resource page is defined' do
      include_context 'when the page is defined',
        'View::Pages::Resources::ImplementPage'

      it { expect(response).to be_a Responses::Html::RenderComponentResponse }

      it { expect(response.component).to be_a component_class }

      it { expect(response.component.resource).to be resource }

      it { expect(response.assigns).to be == {} }

      it { expect(response.flash).to be == {} }

      it { expect(response.layout).to be nil }

      it { expect(response.status).to be :ok }
    end

    context 'when the specific resource page is defined' do
      include_context 'when the page is defined',
        'View::Pages::Custom::ImplementPage'

      it { expect(response).to be_a Responses::Html::RenderComponentResponse }

      it { expect(response.component).to be_a component_class }

      it { expect(response.component.resource).to be resource }

      it { expect(response.assigns).to be == {} }

      it { expect(response.flash).to be == {} }

      it { expect(response.layout).to be nil }

      it { expect(response.status).to be :ok }
    end
  end
end
