# frozen_string_literal: true

require 'cuprum/collections/errors/failed_validation'
require 'cuprum/collections/errors/not_found'
require 'cuprum/collections/errors/not_unique'

require 'cuprum/rails/responders/json_responder'

# Base class for generating JSON responses.
class ApplicationResponder < Cuprum::Rails::Responders::JsonResponder
  match :failure, error: Cuprum::Collections::Errors::FailedValidation \
  do |result|
    render_failure(result.error, status: 422)
  end

  match :failure, error: Cuprum::Collections::Errors::NotFound do |result|
    render_failure(result.error, status: 404)
  end

  match :failure, error: Cuprum::Collections::Errors::NotUnique do |result|
    render_failure(result.error, status: 404)
  end
end
