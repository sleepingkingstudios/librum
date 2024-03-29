# frozen_string_literal: true

require 'rails_helper'
require 'thor'

load 'loader/tasks.thor'

RSpec.describe Loader::Tasks do
  subject(:tasks) { described_class.new }

  describe '#load' do
    let(:data_path) { 'path/to/data' }
    let(:load_mock) { instance_double(Loader::Load, call: nil) }
    let(:options)   { { 'data-path': data_path } }

    before(:example) do
      allow(Loader::Load).to receive(:new).and_return(load_mock)
    end

    def invoke_task
      tasks.invoke(:load, [], options)
    end

    it 'should initialize the loader' do # rubocop:disable RSpec/ExampleLength
      invoke_task

      expect(Loader::Load)
        .to have_received(:new)
        .with(
          data_path:      data_path,
          record_classes: Loader::Configuration::CORE_CLASSES
        )
    end

    it 'should call the loader' do
      invoke_task

      expect(load_mock).to have_received(:call).with(no_args)
    end

    describe 'with authentication: true' do
      let(:options) { super().merge('authentication' => true) }

      it 'should initialize the loader' do # rubocop:disable RSpec/ExampleLength
        invoke_task

        expect(Loader::Load)
          .to have_received(:new)
          .with(
            data_path:      data_path,
            record_classes: [
              *Loader::Configuration::CORE_CLASSES,
              *Loader::Configuration::AUTHENTICATION_CLASSES
            ]
          )
      end

      it 'should call the loader' do
        invoke_task

        expect(load_mock).to have_received(:call).with(no_args)
      end
    end

    describe 'with core: false' do
      let(:options) { super().merge('core' => false) }

      it 'should initialize the loader' do # rubocop:disable RSpec/ExampleLength
        invoke_task

        expect(Loader::Load)
          .to have_received(:new)
          .with(
            data_path:      data_path,
            record_classes: []
          )
      end

      it 'should call the loader' do
        invoke_task

        expect(load_mock).to have_received(:call).with(no_args)
      end
    end

    describe 'with dnd5e: true' do
      let(:options) { super().merge('dnd5e' => true) }

      it 'should initialize the loader' do # rubocop:disable RSpec/ExampleLength
        invoke_task

        expect(Loader::Load)
          .to have_received(:new)
          .with(
            data_path:      data_path,
            record_classes: [
              *Loader::Configuration::CORE_CLASSES,
              *Loader::Configuration::DND5E_CLASSES
            ]
          )
      end

      it 'should call the loader' do
        invoke_task

        expect(load_mock).to have_received(:call).with(no_args)
      end
    end
  end
end
