# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts'

module Spec::Support::Contracts
  module ResponderContracts
    module ShouldRespondWithContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |http_status, &block|
        let(:response) { responder.call(result) }
        let(:configured_data) do
          instance_exec(&block)
        end

        it { expect(response).to be_a Cuprum::Rails::Responses::JsonResponse }

        it { expect(response.status).to be http_status }

        it { expect(response.data).to deep_match(configured_data) }
      end
    end
  end
end
