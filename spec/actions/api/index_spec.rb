# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/repository'
require 'cuprum/rails/rspec/actions/index_contracts'

RSpec.describe Actions::Api::Index do
  include Cuprum::Rails::RSpec::Actions::IndexContracts

  subject(:action) do
    described_class.new(repository: repository, resource: resource)
  end

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:resource) do
    Cuprum::Rails::Resource.new(
      collection:     repository.find_or_create(record_class: Publisher),
      default_order:  :name,
      resource_class: Publisher
    )
  end
  let(:publishers) { Array.new(3) { FactoryBot.build(:publisher) } }

  before(:example) { publishers.map(&:save!) }

  include_contract 'index action contract', existing_entities: -> { publishers }
end
