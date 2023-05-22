# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Loader::Load do
  subject(:command) { described_class.new(**constructor_options) }

  shared_context 'when initialized with many record classes' do
    let(:record_classes) do
      [
        Spec::Gadget,
        Spec::Widget,
        Spec::TradeGoods::SelfSealingStemBolt
      ]
    end

    example_class 'Spec::Gadget', ApplicationRecord
    example_class 'Spec::Widget', ApplicationRecord
    example_class 'Spec::TradeGoods::SelfSealingStemBolt', ApplicationRecord
  end

  let(:record_classes)      { [] }
  let(:constructor_options) { { record_classes: record_classes } }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:data_path, :record_classes)
    end
  end

  describe '#call' do
    include_context 'when initialized with many record classes'

    let(:observer_mock) do
      instance_double(
        Cuprum::Collections::Loader::Observer,
        update: nil
      )
    end
    let(:load_mock) do
      instance_double(
        Cuprum::Collections::Loader::Load,
        add_observer: nil,
        call:         nil
      )
    end

    before(:example) do
      allow(Cuprum::Collections::Loader::Load)
        .to receive(:new)
        .and_return(load_mock)

      allow(Cuprum::Collections::Loader::Observer)
        .to receive(:new)
        .and_return(observer_mock)
    end

    def get_collection(record_class)
      qualified_name =
        record_class
        .name
        .split('::')
        .map(&:underscore)
        .join('/')
        .pluralize

      command.repository[qualified_name]
    end

    it { expect(command).to be_callable.with(0).arguments }

    it 'should initialize the loader' do
      command.call

      expect(Cuprum::Collections::Loader::Load)
        .to have_received(:new)
        .with(data_path: command.data_path, repository: command.repository)
    end

    it 'should add the observer' do
      command.call

      expect(load_mock).to have_received(:add_observer).with(observer_mock)
    end

    it 'should call the loader with each record class', :aggregate_failures do # rubocop:disable RSpec/ExampleLength
      command.call

      record_classes.each do |record_class|
        expect(load_mock)
          .to have_received(:call)
          .with(collection: get_collection(record_class))
      end
    end
  end

  describe '#data_path' do
    let(:expected) { Loader::Configuration.data_path }

    include_examples 'should define reader', :data_path, -> { be == expected }

    context 'when initialized with data_path: value' do
      let(:data_path)           { 'path/to/data' }
      let(:constructor_options) { super().merge(data_path: data_path) }

      it { expect(command.data_path).to be == data_path }
    end
  end

  describe '#record_classes' do
    include_examples 'should define reader',
      :record_classes,
      -> { record_classes }

    wrap_context 'when initialized with many record classes' do
      it { expect(command.record_classes).to be == record_classes }
    end
  end

  describe '#repository' do
    let(:expected_keys) do
      Loader::Configuration.repository(*record_classes).keys
    end

    include_examples 'should define reader',
      :repository,
      -> { an_instance_of(Cuprum::Rails::Repository) }

    it { expect(command.repository.keys).to match_array(expected_keys) }

    wrap_context 'when initialized with many record classes' do
      it { expect(command.repository.keys).to match_array(expected_keys) }
    end
  end
end
