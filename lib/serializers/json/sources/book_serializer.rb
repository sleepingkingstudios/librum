# frozen_string_literal: true

module Serializers::Json::Sources
  # Serializes Source::Books as JSON.
  class BookSerializer < Serializers::Json::SourceSerializer
    attribute :publication_date
  end
end
