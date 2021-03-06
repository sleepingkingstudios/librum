# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/destroy_contracts'

RSpec.describe Actions::Api::Sources::Destroy do
  include Cuprum::Rails::RSpec::Actions::DestroyContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:     repository.find_or_create(
        collection_name: 'books',
        record_class:    Sources::Book
      ),
      resource_class: Sources::Book
    )
  end
  let(:source) do
    FactoryBot.create(:book, :with_game_system, :with_publisher)
  end

  before(:example) { source.save }

  include_contract 'destroy action contract',
    existing_entity:   -> { source },
    primary_key_value: -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) { { 'id' => source.slug } }

      include_contract 'should destroy the entity',
        existing_entity: -> { source },
        params:          -> { params }
    end
  end
end
