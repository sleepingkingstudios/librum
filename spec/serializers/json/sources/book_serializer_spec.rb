# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/serializer_contracts'

RSpec.describe Serializers::Json::Sources::BookSerializer do
  include Spec::Support::Contracts::SerializerContracts

  subject(:serializer) { described_class.new }

  let(:book) { FactoryBot.create(:book, :with_publisher, :with_game_system) }

  describe '::new' do
    it { expect(described_class).to be_constructible.with(0).arguments }
  end

  include_contract 'should serialize source attributes',
    -> { book },
    :publication_date
end
