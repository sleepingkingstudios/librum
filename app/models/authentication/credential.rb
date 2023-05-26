# frozen_string_literal: true

require 'librum/core/models/data_properties'

# An identifier used to authenticate a user.
class Authentication::Credential < ApplicationRecord
  extend Librum::Core::Models::DataProperties

  self.table_name = 'authentication_credentials'

  ### Associations
  belongs_to :user,
    class_name: 'Authentication::User'

  ### Validations
  validates :active,
    inclusion: {
      in:      [true, false],
      message: I18n.t('errors.messages.blank')
    }
  validates :expires_at,
    presence: true
  validates :type, presence: true

  # @return [true, false] true if the expires_at date is in the past, otherwise
  #   false.
  def expired?
    expires_at < Time.current
  end
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
