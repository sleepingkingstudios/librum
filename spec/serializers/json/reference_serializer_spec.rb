# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/serializer_contracts'

RSpec.describe Serializers::Json::ReferenceSerializer do
  include Spec::Support::Contracts::SerializerContracts

  subject(:serializer) { described_class.new }

  let(:reference) { FactoryBot.build(:generic_reference) }

  describe '::new' do
    it { expect(described_class).to be_constructible.with(0).arguments }
  end

  include_contract 'should serialize reference attributes', -> { reference }
end
