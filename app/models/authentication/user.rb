# frozen_string_literal: true

# A user or identity authorized to access the system.
class Authentication::User < ApplicationRecord
  self.table_name = 'authentication_users'

  ## Associations
  has_many :credentials,
    class_name: 'Authentication::Credential',
    dependent:  :destroy

  ### Validations
  validates :email,
    presence:   true,
    format:     {
      with:    /.@./,
      message: 'must be an email address',
      unless:  -> { email.blank? }
    },
    uniqueness: true
  validates :slug,
    format:     {
      message: 'must be in kebab-case',
      with:    /\A[a-z0-9]+(-[a-z0-9]+)*\z/
    },
    presence:   true,
    uniqueness: true
  validates :username,
    presence:   true,
    uniqueness: true
end

# == Schema Information
#
# Table name: authentication_users
#
#  id         :uuid             not null, primary key
#  email      :string           default(""), not null
#  slug       :string           default(""), not null
#  username   :string           default(""), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_authentication_users_on_email     (email) UNIQUE
#  index_authentication_users_on_slug      (slug) UNIQUE
#  index_authentication_users_on_username  (username) UNIQUE
#
