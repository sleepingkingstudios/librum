# frozen_string_literal: true

# Example implementation of the abstract Authentication::Credential class.
class Authentication::GenericCredential < Authentication::Credential
  data_property :details, predicate: true
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
