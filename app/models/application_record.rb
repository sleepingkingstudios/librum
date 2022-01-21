# frozen_string_literal: true

# Abstract base class for application models.
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end
