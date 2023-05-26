# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'librum/core/rspec/contracts/model_contracts'

require 'support/contracts/models'

module Spec::Support::Contracts::Models
  module ReferenceContracts
    include Librum::Core::RSpec::Contracts::ModelContracts

    module ShouldBeAReferenceContract
      extend RSpec::SleepingKingStudios::Contract

      contract do |**options|
        include Spec::Support::Contracts::Models::ReferenceContracts

        options[:source_ids] ||= Array.new(2) { SecureRandom.uuid }

        include_contract 'should be a model'

        ### Attributes
        include_contract 'should define attribute',
          :name,
          default: ''
        include_contract 'should define attribute',
          :slug,
          default: ''
        include_contract 'should define attribute',
          :stub,
          default: false
        include_contract 'should define attribute',
          :source_metadata,
          default: {},
          value:   { 'page_number' => 123 }

        ### Associations
        include_contract 'should belong to',
          :source,
          association: lambda {
            FactoryBot.create(:book, :with_game_system, :with_publisher)
          }

        ### Validations
        describe '#valid?' do
          let(:factory_name) do
            described_class.name.split('::').map(&:underscore).join('/').intern
          end
          let(:book_source) do
            FactoryBot.create(
              :book,
              :with_game_system,
              :with_publisher,
              id: options[:source_ids].first
            )
          end
          let(:website_source) do
            FactoryBot.create(
              :website,
              :with_game_system,
              :with_publisher,
              id: options[:source_ids].last
            )
          end

          before(:example) do
            book_source.save!
            website_source.save!
          end

          include_contract 'should validate the presence of',
            :source,
            message: 'must exist'

          include_contract 'should validate the presence of',
            :name,
            type: String

          include_contract 'should validate the format of',
            :slug,
            message:     'must be in kebab-case',
            matching:    {
              'example'               => 'a lowercase string',
              'example-slug'          => 'a kebab-case string',
              'example-compound-slug' => # rubocop:disable Layout/HashAlignment
                'a kebab-case string with multiple words',
              '1st-example'           => 'a kebab-case string with digits'
            },
            nonmatching: {
              'InvalidSlug'   => 'a string with capital letters',
              'invalid slug'  => 'a string with whitespace',
              'invalid_slug'  => 'a string with underscores',
              '-invalid-slug' => 'a string with leading dash',
              'invalid-slug-' => 'a string with trailing dash'
            }
          include_contract 'should validate the presence of',
            :slug,
            type: String

          include_contract 'should validate the presence of', :stub

          include_contract 'should validate the scoped uniqueness of',
            :slug,
            scope:      { source_id: options[:source_ids] },
            attributes: -> { FactoryBot.attributes_for(factory_name) }
        end
      end
    end
  end
end
