# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/models/source_contracts'

RSpec.describe Sources::Homebrew do
  include Spec::Support::Contracts::Models::SourceContracts

  subject(:source) { described_class.new(attributes) }

  shared_context 'when the source has a user' do
    let(:user) { FactoryBot.build(:authentication_user) }
    let(:attributes) do
      super().merge(
        name: "User: #{user.username}",
        slug: "user-#{user.slug}",
        user: user
      )
    end
  end

  let(:attributes) do
    {
      name: 'Example Source',
      slug: 'example-source',
      data: {}
    }
  end

  include_contract 'should be a source', type: 'Sources::Homebrew'

  ### Associations
  include_contract 'should belong to',
    :user,
    association: -> { FactoryBot.create(:authentication_user) }

  describe '#homebrew?' do
    it { expect(source.homebrew?).to be true }
  end

  describe '#metadata' do
    let(:expected) do
      {
        'homebrew' => true,
        'legacy'   => false,
        'official' => false,
        'playtest' => false,
        'username' => nil
      }
    end

    it { expect(source.metadata).to be == expected }

    wrap_context 'when the source has a user' do
      let(:expected) { super().merge('username' => user.username) }

      it { expect(source.metadata).to be == expected }
    end
  end

  describe '#valid?' do
    wrap_context 'when the source has a user' do
      before(:example) { user.save! }

      it { expect(source).to be_valid }

      context 'when the name does not match the user name' do
        let(:attributes) { super().merge(name: 'Example Source') }

        it 'should have an error' do
          expect(source)
            .to have_errors
            .on('name')
            .with_message('must match user name')
        end
      end

      context 'when the slug does not match the user slug' do
        let(:attributes) { super().merge(slug: 'example-slug') }

        it 'should have an error' do
          expect(source)
            .to have_errors
            .on('slug')
            .with_message('must match user slug')
        end
      end
    end

    include_contract 'should validate the presence of',
      :user,
      message: 'must exist'

    context 'when game_setting_id is not nil' do
      let(:attributes) { super().merge(game_setting_id: SecureRandom.uuid) }

      it 'should have an error' do
        expect(source)
          .to have_errors.on(:game_setting_id)
          .with_message('must be blank')
      end
    end

    context 'when game_system_id is not nil' do
      let(:attributes) { super().merge(game_system_id: SecureRandom.uuid) }

      it 'should have an error' do
        expect(source)
          .to have_errors.on(:game_system_id)
          .with_message('must be blank')
      end
    end

    context 'when publisher_id is not nil' do
      let(:attributes) { super().merge(publisher_id: SecureRandom.uuid) }

      it 'should have an error' do
        expect(source)
          .to have_errors.on(:publisher_id)
          .with_message('must be blank')
      end
    end
  end
end
