# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Authentication::Request do
  subject(:request) { described_class.new(session: session) }

  let(:credential) { FactoryBot.build(:generic_credential) }
  let(:session)    { Authentication::Session.new(credential: credential) }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to respond_to(:new)
        .with(0).arguments
        .and_keywords(:session)
        .and_any_keywords
    end
  end

  describe '#current_user' do
    include_examples 'should define reader',
      :current_user,
      -> { session.current_user }
  end

  describe '#session' do
    include_examples 'should define property', :session, -> { session }
  end
end
