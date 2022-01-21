# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts'
require 'support/contracts/validation_helpers'

module Spec::Support::Contracts
  module ValidationContracts
    module ShouldValidateTheFormatOfContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |attr_name, **options|
        matching    = options.fetch(:matching, [])
        nonmatching = options.fetch(:nonmatching, %w[xyzzy])
        message     = options.fetch(:message, 'is invalid')

        matching.each do |value|
          value, desc =
            if value.is_a?(Array)
              value
            else
              # :nocov:
              [value, value]
              # :nocov:
            end

          context "when #{attr_name} is #{desc}" do
            let(:attributes) { super().merge(attr_name => value) }

            it 'should not have an error' do
              expect(subject).not_to have_errors.on(attr_name)
            end
          end
        end

        nonmatching.each do |value|
          value, desc =
            if value.is_a?(Array)
              value
            else
              # :nocov:
              [value, value]
              # :nocov:
            end

          context "when #{attr_name} is #{desc}" do
            let(:attributes) { super().merge(attr_name => value) }

            it 'should have an error' do
              expect(subject).to have_errors.on(attr_name).with_message(message)
            end
          end
        end
      end
    end

    module ShouldValidateThePresenceOfContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |attr_name, message: nil, type: nil|
        extend ValidationHelpers

        attr_type = normalize_attribute_type(type)
        message ||= "can't be blank"

        context "when #{attr_name} is nil" do
          let(:attributes) { super().merge(attr_name => nil) }

          it 'should have an error' do
            expect(subject).to have_errors.on(attr_name).with_message(message)
          end
        end

        if attr_type == 'string'
          context "when #{attr_name} is empty" do
            let(:attributes) { super().merge(attr_name => '') }

            it 'should have an error' do
              expect(subject).to have_errors.on(attr_name).with_message(message)
            end
          end
        end
      end
    end

    module ShouldValidateTheUniquenessOfContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |attr_name, attributes: {}|
        injected_attributes = attributes

        context "when a #{described_class} exists with the same #{attr_name}" do
          let(:value)        { subject.send(attr_name) }
          let(:message)      { 'has already been taken' }
          let(:factory_name) do
            return super() if defined?(super())

            described_class.name.split('::').last.underscore.intern
          end

          before(:example) do
            attributes =
              FactoryBot
              .attributes_for(factory_name)
              .merge(injected_attributes)
              .merge(attr_name.intern => value)

            described_class.create!(attributes)
          end

          it 'should have an error' do
            expect(subject).to have_errors.on(attr_name).with_message(message)
          end
        end
      end
    end
  end
end