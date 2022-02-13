# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/destroy_contracts'

RSpec.describe Actions::Api::References::Destroy do
  include Cuprum::Rails::RSpec::Actions::DestroyContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:     repository.find_or_create(
        collection_name: 'generic_references',
        record_class:    GenericReference
      ),
      resource_class: GenericReference
    )
  end
  let(:reference) { FactoryBot.create(:generic_reference, :with_source) }

  before(:example) { reference.save }

  include_contract 'destroy action contract',
    existing_entity:   -> { reference },
    primary_key_value: -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) { { 'id' => reference.slug } }

      include_contract 'should destroy the entity',
        existing_entity: -> { reference },
        params:          -> { params }
    end
  end
end
