# frozen_string_literal: true

# An abstract game object.
class Reference < ApplicationRecord
  self.abstract_class = true

  ### Associations
  belongs_to :source

  ### Validations
  validates :name, presence: true
  validates :slug,
    format:     {
      message: 'must be in kebab-case',
      with:    /\A[a-z0-9]+(-[a-z0-9]+)*\z/
    },
    presence:   true,
    uniqueness: {
      scope: :source_id
    }
  validates :stub,
    inclusion: {
      in:      [true, false],
      message: "can't be blank"
    }
end
