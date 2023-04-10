# frozen_string_literal: true

# An identifier used to authenticate a user using a password.
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

# == Schema Information
#
# Table name: authentication_credentials
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  data       :jsonb            not null
#  expires_at :datetime         not null
#  type       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid
#
# Indexes
#
#  index_authentication_credentials_on_user_id_and_type  (user_id,type)
#
