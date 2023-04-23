# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/models/source_contracts'

RSpec.describe Sources::Publication, type: :model do
  include Spec::Support::Contracts::Models::SourceContracts

  subject(:publication) { described_class.new(attributes) }

  let(:attributes) do
    {
      name: 'Example Publication',
      slug: 'example-publication',
      data: {
        'official' => true,
        'playtest' => true
      }
    }
  end

  include_contract 'should be a publication',
    type: 'Sources::Publication'
end
