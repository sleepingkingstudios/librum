# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts'

module Spec::Support::Contracts
  module ControllerContracts
    module ShouldDefineAction
      extend RSpec::SleepingKingStudios::Contract

      contract do |action_name, action_class, member: false|
        describe "##{action_name}" do
          subject(:action) { described_class.actions[action_name.intern] }

          it { expect(described_class.actions).to have_key(action_name.intern) }

          it { expect(action.action_class).to be action_class }

          it { expect(action.member_action?).to be member }
        end
      end
    end

    module ShouldDefineMiddleware
      extend RSpec::SleepingKingStudios::Contract

      contract do |middleware_class, except: [], only: []|
        describe '.middleware' do
          let(:middleware) do
            described_class.middleware.find do |config|
              config.command == middleware_class
            end
          end

          it 'should define the middleware' do
            expect(described_class.middleware)
              .to include(
                have_attributes(command: middleware_class)
              )
          end

          it { expect(middleware.except.to_a).to be == except }

          it { expect(middleware.only.to_a).to be == only }
        end
      end
    end

    module ShouldNotRespondToContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |format|
        it { expect(described_class.responders[format]).to be nil }
      end
    end

    module ShouldRespondToContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |format, using:|
        it { expect(described_class.responders[format]).to be == using }
      end
    end

    module ShouldSerializeContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |klass, using:|
        it { expect(described_class.serializers[klass]).to be == using }
      end
    end

    module ShouldUseTheDefaultSerializers
      extend RSpec::SleepingKingStudios::Contract

      contract do
        let(:expected) do
          Serializers::Json.default_serializers
        end

        it 'should use the default attribute serializers' do
          expect(described_class.serializers).to be >= expected
        end
      end
    end
  end
end
