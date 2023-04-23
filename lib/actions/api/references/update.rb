# frozen_string_literal: true

module Actions::Api::References
  # Update action for generic Reference objects.
  class Update < Actions::Api::Update
    include Actions::Api::References::AssignSourceMetadata
  end
end
