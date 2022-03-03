# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Authentication::Errors::MissingToken do
  subject(:error) { described_class.new(**constructor_options) }

  let(:constructor_options) { {} }

  describe '::TYPE' do
    include_examples 'should define constant',
      :TYPE,
      'authentication.errors.missing_token'
  end

  describe '.new' do
    it { expect(described_class).to be_constructible.with(0).arguments }
  end

  describe '#as_json' do
    let(:expected) do
      {
        'data'    => {},
        'message' => error.message,
        'type'    => error.type
      }
    end

    it { expect(error.as_json).to be == expected }
  end

  describe '#message' do
    let(:expected) { 'missing authentication token' }

    include_examples 'should define reader', :message, -> { be == expected }
  end

  describe '#type' do
    include_examples 'should define reader', :type, described_class::TYPE
  end
end
