# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Data::Middleware::GenerateSlug do
  subject(:middleware) { described_class.new(**constructor_options) }

  let(:attribute_name)      { 'title' }
  let(:constructor_options) { { attribute_name: attribute_name } }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:attribute_name)
        .and_any_keywords
    end
  end

  describe '#call' do
    let(:next_command) do
      Cuprum::Command.new { |attributes:| attributes.merge('ok' => true) }
    end

    describe 'with attributes: an empty Hash' do
      let(:attributes)     { {} }
      let(:expected_value) { { 'slug' => '', 'ok' => true } }

      it 'should return a passing result' do
        expect(middleware.call(next_command, attributes: attributes))
          .to be_a_passing_result
          .with_value(expected_value)
      end
    end

    describe 'with attributes: a Hash with slug: value' do
      let(:attributes) { { 'slug' => 'example-slug' } }
      let(:expected_value) do
        attributes.merge('slug' => 'example-slug', 'ok' => true)
      end

      it 'should return a passing result' do
        expect(middleware.call(next_command, attributes: attributes))
          .to be_a_passing_result
          .with_value(expected_value)
      end
    end

    describe 'with attributes: a Hash with the configured attribute' do
      let(:attributes) { { 'title' => 'Example Title' } }
      let(:expected_value) do
        attributes.merge('slug' => 'example-title', 'ok' => true)
      end

      it 'should return a passing result' do
        expect(middleware.call(next_command, attributes: attributes))
          .to be_a_passing_result
          .with_value(expected_value)
      end

      describe 'with slug: value' do
        let(:attributes) { super().merge('slug' => 'example-slug') }
        let(:expected_value) do
          attributes.merge('slug' => 'example-slug', 'ok' => true)
        end

        it 'should return a passing result' do
          expect(middleware.call(next_command, attributes: attributes))
            .to be_a_passing_result
            .with_value(expected_value)
        end
      end
    end
  end
end
