# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts/models'
require 'support/contracts/models/validation_helpers'

module Spec::Support::Contracts::Models
  module AttributesContracts
    DEFAULT_VALUE = Object.new.freeze
    private_constant :DEFAULT_VALUE

    module ShouldDefineAttributeContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |attr_name, default: nil, value: DEFAULT_VALUE|
        attr_name = attr_name.intern

        describe "##{attr_name}" do
          include_examples 'should define property', attr_name

          context "when the attributes do not include #{attr_name}" do
            let(:attributes) do
              super().tap do |hsh|
                hsh.delete(attr_name.intern)
                hsh.delete(attr_name.to_s)
              end
            end
            let(:default_value) do
              default.is_a?(Proc) ? instance_exec(&default) : default
            end

            it { expect(subject.send(attr_name)).to be == default_value }
          end

          context "when the attributes include #{attr_name}" do
            case value
            when DEFAULT_VALUE
              let(:expected) { attributes.fetch(attr_name.intern) }
            when Proc
              let(:attributes) { super().merge(attr_name => expected) }
              let(:expected)   { instance_exec(&value) }
            else
              let(:attributes) { super().merge(attr_name => value) }
              let(:expected)   { value }
            end

            it { expect(subject.public_send(attr_name)).to be == expected }
          end
        end
      end
    end

    module ShouldDefinePrimaryKeyContract
      extend RSpec::SleepingKingStudios::Contract

      contract do
        include Spec::Support::Contracts::ModelContracts

        include_contract 'should define attribute',
          :id,
          value: '00000000-0000-0000-0000-000000000000'
      end
    end

    module ShouldDefineSlug
      extend RSpec::SleepingKingStudios::Contract

      contract do |attr_name = :slug|
        include Spec::Support::Contracts::ModelContracts

        include_contract 'should define attribute',
          attr_name,
          default: ''
      end
    end

    module ShouldDefineTimestampsContract
      extend RSpec::SleepingKingStudios::Contract

      contract do
        include Spec::Support::Contracts::ModelContracts

        describe '#created_at' do
          include_examples 'should define reader', :created_at
        end

        describe '#updated_at' do
          include_examples 'should define reader', :updated_at
        end
      end
    end
  end
end
