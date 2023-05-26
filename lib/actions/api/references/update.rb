# frozen_string_literal: true

require 'librum/core/actions/update'

module Actions::Api::References
  # Update action for generic Reference objects.
  class Update < Librum::Core::Actions::Update
    include Actions::Api::References::AssignSourceMetadata
  end
end
