# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/serializer_contracts'

RSpec.describe Serializers::Json::PublisherSerializer do
  include Spec::Support::Contracts::SerializerContracts

  subject(:serializer) { described_class.new }

  let(:publisher) { FactoryBot.create(:publisher) }

  describe '::new' do
    it { expect(described_class).to be_constructible.with(0).arguments }
  end

  include_contract 'should serialize record attributes',
    -> { publisher },
    :name,
    :slug,
    :website
end
