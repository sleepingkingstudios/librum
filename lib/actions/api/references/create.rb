# frozen_string_literal: true

module Actions::Api::References
  # Create action for generic Reference objects.
  class Create < Actions::Api::Create
    include Actions::Api::References::AssignSourceMetadata
  end
end
