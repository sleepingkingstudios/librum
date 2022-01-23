# frozen_string_literal: true

# An abstract source for game materials.
class Source < ApplicationRecord
  class << self
    # Defines reader and writer methods wrapping a data value.
    def data_property(property_name, predicate: false)
      property_name = property_name.to_s

      define_reader(property_name)
      define_writer(property_name)
      define_predicate(property_name) if predicate
    end

    private

    def define_reader(property_name)
      reader_name = property_name.intern

      define_method(reader_name) { data[property_name] }
    end

    def define_predicate(property_name)
      predicate_name = :"#{property_name}?"

      define_method(predicate_name) { data[property_name].present? }
    end

    def define_writer(property_name)
      writer_name = :"#{property_name}="

      define_method(writer_name) { |value| data[property_name] = value }
    end
  end

  ### Attributes
  data_property :official, predicate: true
  data_property :playtest, predicate: true

  ### Associations
  belongs_to :game_system
  belongs_to :publisher

  ### Validations
  validates :name, presence: true
  validates :slug,
    format:   {
      message: 'must be in kebab-case',
      with:    /\A[a-z0-9]+(-[a-z0-9]+)*\z/
    },
    presence: true
  validates :type, presence: true

  # @return [false] True if the source is homebrew, otherwise false.
  def homebrew?
    false
  end
end

# == Schema Information
#
# Table name: sources
#
#  id             :uuid             not null, primary key
#  data           :jsonb            not null
#  name           :string           default(""), not null
#  slug           :string           default(""), not null
#  type           :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  game_system_id :uuid
#  publisher_id   :uuid
#
# Indexes
#
#  index_sources_on_game_system_id  (game_system_id)
#  index_sources_on_name            (name) UNIQUE
#  index_sources_on_publisher_id    (publisher_id)
#  index_sources_on_slug            (slug) UNIQUE
#
