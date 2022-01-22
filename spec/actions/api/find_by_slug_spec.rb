# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Actions::Api::FindBySlug do
  subject(:action) { described_class.new(collection) }

  let(:collection)      { instance_double(Cuprum::Rails::Collection) }
  let(:described_class) { Spec::Action }

  example_class 'Spec::Action', Cuprum::Command do |klass|
    klass.prepend(Actions::Api::FindBySlug) # rubocop:disable RSpec/DescribedClass

    klass.define_method(:initialize) do |collection|
      @collection = collection
    end

    klass.attr_reader :collection

    klass.define_method(:find_entity) do |primary_key:| # rubocop:disable Lint/UnusedBlockArgument
      failure(Cuprum::Error.new(message: 'Not a UUID'))
    end

    klass.define_method(:process) do |primary_key:|
      find_entity(primary_key: primary_key)
    end
  end

  describe '#call' do
    let(:query_class) { Models::Queries::FindBySlug }
    let(:query) do
      instance_double(Models::Queries::FindBySlug, call: nil)
    end

    before(:example) do
      allow(query_class).to receive(:new).and_return(query)
    end

    describe 'with a uuid' do
      let(:primary_key) { SecureRandom.uuid }
      let(:expected_error) do
        Cuprum::Error.new(message: 'Not a UUID')
      end

      it 'should return a failing result' do
        expect(action.call(primary_key: primary_key))
          .to be_a_failing_result
          .with_error(expected_error)
      end

      it 'should not query for the entity by slug' do
        action.call(primary_key: primary_key)

        expect(query).not_to have_received(:call)
      end
    end

    describe 'with an invalid slug' do
      let(:primary_key) { 'example-slug' }
      let(:error)       { Cuprum::Error.new(message: 'Slug not found.') }
      let(:result)      { Cuprum::Result.new(error: error) }

      before(:example) do
        allow(query).to receive(:call).and_return(result)
      end

      it 'should return a failing result' do
        expect(action.call(primary_key: primary_key))
          .to be_a_failing_result
          .with_error(error)
      end

      it 'should query for the entity by slug', :aggregate_failures do
        action.call(primary_key: primary_key)

        expect(query_class).to have_received(:new).with(collection: collection)
        expect(query).to have_received(:call).with(slug: primary_key)
      end
    end

    describe 'with a valid slug' do
      let(:publisher)   { FactoryBot.create(:publisher) }
      let(:primary_key) { publisher.slug }
      let(:result)      { Cuprum::Result.new(value: publisher) }

      before(:example) do
        allow(query).to receive(:call).and_return(result)
      end

      it 'should return a passing result' do
        expect(action.call(primary_key: primary_key))
          .to be_a_passing_result
          .with_value(publisher)
      end

      it 'should query for the entity by slug', :aggregate_failures do
        action.call(primary_key: primary_key)

        expect(query_class).to have_received(:new).with(collection: collection)
        expect(query).to have_received(:call).with(slug: primary_key)
      end
    end
  end
end
