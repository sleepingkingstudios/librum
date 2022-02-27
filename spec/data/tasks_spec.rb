# frozen_string_literal: true

require 'rails_helper'
require 'thor'

load 'data/tasks.thor'

RSpec.describe Data::Tasks do
  subject(:tasks) { described_class.new }

  describe '#load' do
    let(:load_mock) { instance_double(Data::Load, call: nil) }
    let(:options)   { {} }

    before(:example) do
      allow(Data::Load).to receive(:new).and_return(load_mock)
    end

    def invoke_task
      tasks.invoke(:load, [], options)
    end

    it 'should initialize the loader' do # rubocop:disable RSpec/ExampleLength
      invoke_task

      expect(Data::Load)
        .to have_received(:new)
        .with(
          data_path:      nil,
          record_classes: Data::Configuration::CORE_CLASSES
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

        expect(Data::Load)
          .to have_received(:new)
          .with(
            data_path:      nil,
            record_classes: [
              *Data::Configuration::CORE_CLASSES,
              *Data::Configuration::AUTHENTICATION_CLASSES
            ]
          )
      end

      it 'should call the loader' do
        invoke_task

        expect(load_mock).to have_received(:call).with(no_args)
      end
    end

    describe 'with data-path: a value' do
      let(:data_path) { 'path/to/data' }
      let(:options)   { super().merge('data-path' => data_path) }

      it 'should initialize the loader' do # rubocop:disable RSpec/ExampleLength
        invoke_task

        expect(Data::Load)
          .to have_received(:new)
          .with(
            data_path:      data_path,
            record_classes: Data::Configuration::CORE_CLASSES
          )
      end

      it 'should call the loader' do
        invoke_task

        expect(load_mock).to have_received(:call).with(no_args)
      end
    end
  end
end
