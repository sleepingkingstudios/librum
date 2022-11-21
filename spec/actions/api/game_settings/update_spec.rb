# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/update_contracts'

RSpec.describe Actions::Api::GameSettings::Update do
  include Cuprum::Rails::RSpec::Actions::UpdateContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:           repository.find_or_create(
        record_class: GameSetting
      ),
      permitted_attributes: %i[
        name
        publisher_id
        slug
      ],
      resource_class:       GameSetting
    )
  end
  let(:game_setting) { FactoryBot.create(:game_setting, :with_publisher) }
  let(:invalid_attributes) do
    { 'name' => '' }
  end
  let(:valid_attributes) do
    { 'name' => 'Example Game Setting' }
  end

  include_contract 'update action contract',
    existing_entity:    -> { game_setting },
    invalid_attributes: -> { invalid_attributes },
    valid_attributes:   -> { valid_attributes },
    primary_key_value:  -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) do
        { 'id' => game_setting.slug, 'game_setting' => valid_attributes }
      end

      include_contract 'should update the entity',
        existing_entity:  -> { game_setting },
        valid_attributes: -> { valid_attributes },
        params:           -> { params }
    end

    describe 'with slug: an empty String' do
      let(:valid_attributes)    { super().merge({ 'slug' => '' }) }
      let(:expected_attributes) { { 'slug' => 'example-game-setting' } }

      include_contract 'should update the entity',
        existing_entity:     -> { game_setting },
        valid_attributes:    -> { valid_attributes },
        expected_attributes: ->(hsh) { hsh.merge(expected_attributes) }
    end

    describe 'with slug: a valid slug' do
      let(:valid_attributes) { super().merge({ 'slug' => 'example-slug' }) }

      include_contract 'should update the entity',
        existing_entity:  -> { game_setting },
        valid_attributes: -> { valid_attributes }
    end
  end
end
