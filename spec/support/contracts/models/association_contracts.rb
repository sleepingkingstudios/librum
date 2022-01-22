# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts/model_contracts'
require 'support/contracts/models'
require 'support/contracts/models/validation_helpers'

module Spec::Support::Contracts::Models
  module AssociationContracts
    module ShouldBelongToContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |association_name, **options|
        include Spec::Support::Contracts::Models

        association_name = association_name.intern
        foreign_key_name = options.fetch(:foreign_key) do
          :"#{association_name}_id"
        end
        model_name       =
          described_class.name.split('::').last.underscore.tr('_', ' ')
        display_name     = association_name.to_s.tr('_', ' ')

        include_contract 'should define attribute',
          foreign_key_name,
          value: lambda {
            attributes.fetch(foreign_key_name.intern) do
              attributes.fetch(foreign_key_name.to_s) { SecureRandom.uuid }
            end
          }

        describe "##{association_name}" do
          include_examples 'should define property', association_name

          context "when the #{model_name} has a #{display_name}" do
            let(:association) { FactoryBot.build(association_name) }
            let(:attributes) do
              super().merge({ association_name => association })
            end
            let(:association_value) { subject.send(association_name) }

            before(:example) { association.save! }

            it { expect(association_value).to be == association }
          end
        end
      end
    end

    module ShouldHaveManyContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |association_name, **options|
        association_name = association_name.intern
        singular_name    = association_name.to_s.singularize.intern
        model_name       =
          described_class.name.split('::').last.underscore.tr('_', ' ')
        display_name     = association_name.to_s.tr('_', ' ')
        inverse_name     = options.fetch(:inverse_name, model_name).intern

        describe "##{association_name}" do
          include_examples 'should define reader', association_name, []

          context "when the #{model_name} has many #{display_name}" do
            let(:associations) do
              Array.new(3) do
                FactoryBot.build(singular_name, inverse_name => subject)
              end
            end
            let(:association_value) { subject.send(association_name) }

            before(:example) { associations.map(&:save!) }

            it { expect(association_value).to contain_exactly(*associations) }
          end
        end
      end
    end
  end
end
