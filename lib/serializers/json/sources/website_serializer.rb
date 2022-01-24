# frozen_string_literal: true

module Serializers::Json::Sources
  # Serializes Sources::Websites as JSON.
  class WebsiteSerializer < Serializers::Json::SourceSerializer
    attribute :base_url
  end
end
