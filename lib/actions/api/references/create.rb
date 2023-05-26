# frozen_string_literal: true

require 'librum/core/actions/create'

module Actions::Api::References
  # Create action for generic Reference objects.
  class Create < Librum::Core::Actions::Create
    include Actions::Api::References::AssignSourceMetadata
  end
end
