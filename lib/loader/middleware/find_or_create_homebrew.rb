# frozen_string_literal: true

require 'cuprum/collections/loader/middleware/entity_middleware'

module Loader::Middleware
  # Finds or creates the Homebrew source for the user.
  class FindOrCreateHomebrew <
        Cuprum::Collections::Loader::Middleware::EntityMiddleware
    private

    def process(next_command, attributes:)
      action, user = super

      source = user.homebrew_source || user.build_homebrew_source
      source.assign_attributes(
        name: "User: #{user.username}",
        slug: "user-#{user.slug}"
      )
      source.save!

      [action, user]
    end
  end
end
