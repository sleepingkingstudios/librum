# frozen_string_literal: true

require 'cuprum/collections/loader/middleware/find_association'

module Loader::Middleware
  # Finds the source for a game reference by game system and slug.
  class FindSource < Cuprum::Collections::Loader::Middleware::FindAssociation
    # @param attribute_name [String, Symbol] The name of the attribute.
    # @param game_system [String] The slug of the game system for the reference.
    # @param repository [Cuprum::Collections::Repository] The repository used
    #   to query data.
    def initialize(
      attribute_name,
      game_system:,
      repository:
    )
      super(
        attribute_name,
        find_by:        'slug',
        optional:       false,
        qualified_name: 'librum/tabletop/sources',
        repository:     repository
      )

      @game_system_slug = game_system
    end

    # @return [String] the slug of the game system for the reference.
    attr_reader :game_system_slug

    private

    def find_association(attr_value) # rubocop:disable Metrics/MethodLength
      game_system = step { find_game_system }
      collection  = step { find_collection }
      result      =
        Cuprum::Collections::Commands::FindOneMatching
        .new(collection: collection)
        .call(
          attributes: {
            find_by          => attr_value,
            'game_system_id' => game_system.id
          }
        )

      return result unless result.failure? && optional?

      # :nocov:
      success(nil)
      # :nocov:
    end

    def find_game_system
      Cuprum::Collections::Commands::FindOneMatching
        .new(collection: step { game_systems_collection })
        .call(attributes: { 'slug' => game_system_slug })
    end

    def game_systems_collection
      return @game_systems_collection if @game_systems_collection

      if repository.key?('librum/tabletop/game_systems')
        collection = repository['librum/tabletop/game_systems']

        return @game_systems_collection = collection
      end

      failure(game_systems_collection_error)
    end

    def game_systems_collection_error
      Cuprum::Collections::Loader::Errors::CollectionError.new(
        qualified_name: 'librum/tabletop/game_systems',
        repository:     repository
      )
    end
  end
end
