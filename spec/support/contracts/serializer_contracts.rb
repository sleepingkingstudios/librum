# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'librum/core/rspec/contracts/serializer_contracts'

require 'support/contracts'

module Spec::Support::Contracts
  module SerializerContracts
    include Librum::Core::RSpec::Contracts::SerializerContracts

    module ShouldSerializeReferenceAttributesContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |object, *attr_names, **attr_pairs|
        include Spec::Support::Contracts::SerializerContracts

        include_contract 'should serialize record attributes',
          object,
          :source_id,
          :source_metadata,
          :name,
          :slug,
          :stub,
          *attr_names,
          **attr_pairs
      end
    end

    module ShouldSerializeSourceAttributesContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |object, *attr_names, **attr_pairs|
        include Spec::Support::Contracts::SerializerContracts

        include_contract 'should serialize record attributes',
          object,
          :game_setting_id,
          :game_system_id,
          :publisher_id,
          :data,
          :name,
          :slug,
          *attr_names,
          homebrew: -> { configured_object.homebrew? },
          legacy:   -> { configured_object.legacy? },
          official: -> { configured_object.official? },
          playtest: -> { configured_object.playtest? },
          **attr_pairs
      end
    end
  end
end
