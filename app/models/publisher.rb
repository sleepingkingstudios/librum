# frozen_string_literal: true

# A publisher of game systems or materials.
class Publisher < ApplicationRecord
  ### Validations
  validates :name,
    presence:   true,
    uniqueness: true
  validates :slug,
    format:     {
      message: 'must be in kebab-case',
      with:    /\A[a-z0-9]+(-[a-z0-9]+)*\z/
    },
    presence:   true,
    uniqueness: true
end

# == Schema Information
#
# Table name: publishers
#
#  id         :uuid             not null, primary key
#  name       :string           default(""), not null
#  slug       :string           default(""), not null
#  website    :string           default(""), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_publishers_on_name  (name) UNIQUE
#  index_publishers_on_slug  (slug) UNIQUE
#
