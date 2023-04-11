# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/destroy_contracts'

RSpec.describe Actions::Api::Destroy do
  include Cuprum::Rails::RSpec::Actions::DestroyContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:     repository.find_or_create(record_class: Publisher),
      resource_class: Publisher
    )
  end
  let(:publisher) { FactoryBot.create(:publisher) }

  before(:example) { publisher.save }

  include_contract 'destroy action contract',
    existing_entity:   -> { publisher },
    primary_key_value: -> { SecureRandom.uuid } \
  do
    describe 'with id: a slug' do
      let(:params) { { 'id' => publisher.slug } }

      include_contract 'should destroy the entity',
        existing_entity: -> { publisher },
        params:          -> { params }
    end
  end
end
