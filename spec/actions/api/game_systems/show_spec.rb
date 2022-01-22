# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/show_contracts'

RSpec.describe Actions::Api::GameSystems::Show do
  include Cuprum::Rails::RSpec::Actions::ShowContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:     repository.find_or_create(record_class: GameSystem),
      resource_class: GameSystem
    )
  end
  let(:game_system) { FactoryBot.create(:game_system, :with_publisher) }

  include_contract 'show action contract',
    existing_entity:   -> { game_system },
    primary_key_value: -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) { { 'id' => game_system.slug } }

      include_contract 'should find the entity',
        existing_entity: -> { game_system },
        params:          -> { params }
    end
  end
end
