# frozen_string_literal: true

# Example implementation of the abstract Authentication::Credential class.
class Authentication::GenericCredential < Authentication::Credential
  data_property :details, predicate: true
end
