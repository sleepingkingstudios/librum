# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Responses::Html::RenderComponentResponse do
  subject(:response) { described_class.new(component, **options) }

  let(:component) { Object.new.freeze }
  let(:options)   { {} }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(1).argument
        .and_keywords(:layout, :status)
    end
  end

  describe '#call' do
    let(:renderer) do
      instance_double(Spec::Renderer, class: Spec::Renderer, render: nil)
    end
    let(:expected) { {} }

    example_class 'Spec::Renderer' do |klass|
      klass.define_method(:render) { |*, **| nil }
    end

    it { expect(response).to respond_to(:call).with(1).argument }

    it 'should render the component' do
      response.call(renderer)

      expect(renderer).to have_received(:render).with(component, **expected)
    end

    context 'when initialized with layout: value' do
      let(:layout)   { 'custom_layout' }
      let(:options)  { super().merge(layout: layout) }
      let(:expected) { super().merge(layout: layout) }

      it 'should render the component' do
        response.call(renderer)

        expect(renderer).to have_received(:render).with(component, **expected)
      end
    end

    context 'when initialized with status: an Integer' do
      let(:status)   { 400 }
      let(:options)  { super().merge(status: status) }
      let(:expected) { super().merge(status: status) }

      it 'should render the component' do
        response.call(renderer)

        expect(renderer).to have_received(:render).with(component, **expected)
      end
    end

    context 'when initialized with status: a Symbol' do
      let(:status)   { :bad_request }
      let(:options)  { super().merge(status: status) }
      let(:expected) { super().merge(status: status) }

      it 'should render the component' do
        response.call(renderer)

        expect(renderer).to have_received(:render).with(component, **expected)
      end
    end
  end

  describe '#component' do
    include_examples 'should define reader', :component, -> { component }
  end

  describe '#layout' do
    include_examples 'should define reader', :layout, nil

    context 'when initialized with layout: value' do
      let(:layout)  { 'custom_layout' }
      let(:options) { super().merge(layout: layout) }

      it { expect(response.layout).to be == layout }
    end
  end

  describe '#status' do
    include_examples 'should define reader', :status, nil

    context 'when initialized with status: an Integer' do
      let(:status)  { 400 }
      let(:options) { super().merge(status: status) }

      it { expect(response.status).to be status }
    end

    context 'when initialized with status: a Symbol' do
      let(:status)  { :bad_request }
      let(:options) { super().merge(status: status) }

      it { expect(response.status).to be status }
    end
  end
end
