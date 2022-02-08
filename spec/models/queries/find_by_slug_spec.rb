# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Models::Queries::FindBySlug do
  subject(:query) { described_class.new(collection: collection) }

  let(:repository) { Cuprum::Rails::Repository.new }
  let(:collection) { repository.find_or_create(record_class: Publisher) }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:collection)
    end
  end

  describe '#call' do
    it 'should define the method' do
      expect(query)
        .to be_callable
        .with(0).arguments
        .and_keywords(:slug)
    end

    context 'when the entity does not exist' do
      let(:slug) { 'non-existing-slug' }
      let(:expected_error) do
        Cuprum::Collections::Errors::NotFound.new(
          attribute_name:  'slug',
          attribute_value: slug,
          collection_name: collection.collection_name
        )
      end

      it 'should return a failing result' do
        expect(query.call(slug: slug))
          .to be_a_failing_result
          .with_error(expected_error)
      end
    end

    context 'when one matching entity exists' do
      let(:publisher) { FactoryBot.create(:publisher) }

      it 'should return the entity' do
        expect(query.call(slug: publisher.slug))
          .to be_a_passing_result
          .with_value(publisher)
      end
    end

    context 'when multiple matching entities exist' do
      let(:publishers) do
        Array.new(2) { FactoryBot.build(:publisher, slug: 'example-publisher') }
      end
      let(:mock_command) { instance_double(Cuprum::Command, call: publishers) }
      let(:expected_error) do
        Cuprum::Collections::Errors::NotUnique.new(
          attribute_name:  'slug',
          attribute_value: 'example-publisher',
          collection_name: collection.collection_name
        )
      end

      before(:example) do
        allow(collection).to receive(:find_matching).and_return(mock_command)
      end

      it 'should return a failing result' do
        expect(query.call(slug: 'example-publisher'))
          .to be_a_failing_result
          .with_error(expected_error)
      end
    end
  end

  describe '#collection' do
    include_examples 'should define reader', :collection, -> { collection }
  end
end
