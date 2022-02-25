# frozen_string_literal: true

class Authentication::PasswordCredential < Authentication::Credential
  ### Attributes
  data_property :encrypted_password

  ### Validations
  validates :encrypted_password, presence: true
  validates :user_id,
    uniqueness: {
      if:    -> { active? },
      scope: :active
    }
end
