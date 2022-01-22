# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/serializer_contracts'

RSpec.describe Serializers::Json::RecordSerializer do
  include Spec::Support::Contracts::SerializerContracts

  subject(:serializer) { described_class.new }

  let(:record) { FactoryBot.create(:publisher) }

  describe '::new' do
    it { expect(described_class).to be_constructible.with(0).arguments }
  end

  include_contract 'should serialize attributes',
    -> { record },
    :id,
    :created_at,
    :updated_at
end
