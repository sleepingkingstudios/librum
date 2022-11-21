# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/destroy_contracts'

RSpec.describe Actions::Api::GameSettings::Destroy do
  include Cuprum::Rails::RSpec::Actions::DestroyContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:     repository.find_or_create(record_class: GameSetting),
      resource_class: GameSetting
    )
  end
  let(:game_setting) { FactoryBot.create(:game_setting, :with_publisher) }

  before(:example) { game_setting.save }

  include_contract 'destroy action contract',
    existing_entity:   -> { game_setting },
    primary_key_value: -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) { { 'id' => game_setting.slug } }

      include_contract 'should destroy the entity',
        existing_entity: -> { game_setting },
        params:          -> { params }
    end
  end
end
