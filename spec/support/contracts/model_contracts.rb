# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts'
require 'support/contracts/models/association_contracts'
require 'support/contracts/models/attributes_contracts'
require 'support/contracts/models/validation_contracts'

module Spec::Support::Contracts
  module ModelContracts
    include Spec::Support::Contracts::Models::AssociationContracts
    include Spec::Support::Contracts::Models::AttributesContracts
    include Spec::Support::Contracts::Models::ValidationContracts

    module ShouldBeAModelContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |slug: true|
        include Spec::Support::Contracts::ModelContracts

        include_contract 'should define primary key'

        include_contract 'should define timestamps'

        include_contract 'should define slug' if slug
      end
    end
  end
end
