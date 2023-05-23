# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Responders::HtmlResponder do
  subject(:responder) { described_class.new(**constructor_options) }

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
      'View::Pages::Custom::Implement'
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

      it { expect(response.status).to be :internal_server_error }

      context 'when the page is defined' do
        let(:component_class) { View::Pages::Custom::Implement }

        example_class 'View::Pages::Custom::Implement', View::Page

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

        it { expect(response.status).to be :internal_server_error }
      end
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

      it { expect(response.status).to be :internal_server_error }

      context 'when the page is defined' do
        let(:component_class) { View::Pages::Custom::Implement }

        example_class 'View::Pages::Custom::Implement', View::Page

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

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
    let(:expected_page) { 'View::Pages::Custom::Implement' }

    it 'should define the method' do
      expect(responder)
        .to respond_to(:render_component)
        .with(1).argument
        .and_keywords(:status)
    end

    it { expect(response).to be_a Responses::Html::RenderComponentResponse }

    it { expect(response.component).to be_a View::Pages::MissingPage }

    it { expect(response.component.action_name).to be == action_name }

    it { expect(response.component.controller_name).to be == controller_name }

    it { expect(response.component.expected_page).to be == expected_page }

    it { expect(response.component.result).to be result }

    it { expect(response.status).to be :internal_server_error }

    context 'when the controller has a namespace' do
      let(:controller_name) { 'Namespace::CustomController' }
      let(:expected_page) do
        'View::Pages::Namespace::Custom::Implement'
      end

      it { expect(response.component.expected_page).to be == expected_page }

      context 'when the Page is defined' do
        let(:component_class) do
          View::Pages::Namespace::Custom::Implement
        end

        example_class 'View::Pages::Namespace::Custom::Implement',
          View::Page

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

        it { expect(response.status).to be :ok }

        describe 'with status: value' do # rubocop:disable RSpec/MultipleMemoizedHelpers
          let(:status)  { :created }
          let(:options) { super().merge(status: status) }

          it { expect(response.status).to be :created }
        end
      end
    end

    context 'when the Page is defined' do
      let(:component_class) { View::Pages::Custom::Implement }

      example_class 'View::Pages::Custom::Implement', View::Page

      it { expect(response).to be_a Responses::Html::RenderComponentResponse }

      it { expect(response.component).to be_a component_class }

      it { expect(response.status).to be :ok }

      describe 'with status: value' do # rubocop:disable RSpec/MultipleMemoizedHelpers
        let(:status)  { :created }
        let(:options) { super().merge(status: status) }

        it { expect(response.status).to be :created }
      end
    end

    describe 'with status: value' do
      let(:status)  { :created }
      let(:options) { super().merge(status: status) }

      it { expect(response.status).to be :internal_server_error }
    end

    describe 'when the result value is a ViewComponent' do
      let(:component) { Spec::CustomComponent.new }
      let(:result)    { Cuprum::Result.new(value: component) }

      example_class 'Spec::CustomComponent', ViewComponent::Base

      it { expect(response).to be_a Responses::Html::RenderComponentResponse }

      it { expect(response.component).to be component }

      it { expect(response.status).to be :ok }

      describe 'with status: value' do # rubocop:disable RSpec/MultipleMemoizedHelpers
        let(:status)  { :created }
        let(:options) { super().merge(status: status) }

        it { expect(response.status).to be status }
      end
    end
  end
end
