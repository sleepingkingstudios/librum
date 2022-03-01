# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts/model_contracts'
require 'support/contracts/models'
require 'support/contracts/models/attributes_contracts'
require 'support/contracts/models/data_properties_contracts'
require 'support/contracts/models/validation_contracts'

module Spec::Support::Contracts::Models
  module CredentialContracts
    include Spec::Support::Contracts::ModelContracts
    include Spec::Support::Contracts::Models::DataPropertiesContracts

    module ShouldBeACredentialContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |type:|
        include_contract 'should be a model', slug: false

        ### Attributes
        include_contract 'should define attribute',
          :active,
          default: true
        include_contract 'should define attribute',
          :data,
          default: {}
        include_contract 'should define attribute', :expires_at

        include_contract 'should define data properties'

        describe '#type' do
          include_examples 'should define reader', :type, type
        end

        ### Associations
        include_contract 'should belong to',
          :user,
          factory_name: :authentication_user

        describe '#expired?' do
          include_examples 'should define predicate', :expired?

          context 'when expires_at is in the past' do
            let(:attributes) do
              super().merge(expires_at: 1.minute.ago)
            end

            it { expect(subject.expired?).to be true }
          end

          context 'when expires_at is in the future' do
            let(:attributes) do
              super().merge(expires_at: 1.minute.from_now)
            end

            it { expect(subject.expired?).to be false }
          end
        end

        describe '#valid?' do
          include_contract 'should validate the presence of', :active

          include_contract 'should validate the presence of', :expires_at

          include_contract 'should validate the presence of',
            :user,
            message: 'must exist'
        end
      end
    end
  end
end
