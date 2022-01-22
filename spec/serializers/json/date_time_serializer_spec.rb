# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Serializers::Json::DateTimeSerializer do
  subject(:serializer) { described_class.new }

  describe '.new' do
    it { expect(described_class).to be_constructible.with(0).arguments }
  end

  describe '.instance' do
    let(:instance) { described_class.instance }

    it { expect(described_class).to respond_to(:instance).with(0).arguments }

    it { expect(described_class.instance).to be_a described_class }

    it { expect(described_class.instance).to be instance }
  end

  describe '#call' do
    it 'should define the method' do
      expect(serializer).to respond_to(:call).with(1).argument.and_any_keywords
    end

    describe 'with a Date' do
      let(:value) { Time.zone.today }

      it { expect(serializer.call(value)).to be == value.iso8601 }
    end

    describe 'with a DateTime' do
      let(:value) { DateTime.now }

      it { expect(serializer.call(value)).to be == value.iso8601 }
    end

    describe 'with a Time' do
      let(:value) { Time.zone.now }

      it { expect(serializer.call(value)).to be == value.iso8601 }
    end

    describe 'with a model timestamp' do
      let(:value) { FactoryBot.create(:publisher).created_at }

      it { expect(serializer.call(value)).to be == value.iso8601 }
    end
  end
end
