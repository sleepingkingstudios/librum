# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/serializer_contracts'

RSpec.describe Serializers::Json::GameSystemSerializer do
  include Spec::Support::Contracts::SerializerContracts

  subject(:serializer) { described_class.new }

  let(:game_system) { FactoryBot.create(:game_system, :with_publisher) }

  describe '::new' do
    it { expect(described_class).to be_constructible.with(0).arguments }
  end

  include_contract 'should serialize record attributes',
    -> { game_system },
    :publisher_id,
    :name,
    :slug,
    :edition
end
