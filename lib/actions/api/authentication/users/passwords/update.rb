# frozen_string_literal: true

require 'cuprum/rails/action'
require 'cuprum/rails/actions/parameter_validation'
require 'cuprum/rails/constraints/parameters_contract'
require 'stannum/contracts/indifferent_hash_contract'
require 'stannum/constraints/presence'
require 'stannum/constraints/properties/match_property'

require 'librum/core/errors/authentication_failed'

module Actions::Api::Authentication::Users::Passwords
  # Action to update the password for the current authenticated user.
  class Update < Cuprum::Rails::Action
    include Cuprum::Rails::Actions::ParameterValidation

    PARAMETERS_CONTRACT = Cuprum::Rails::Constraints::ParametersContract.new do
      presence_constraint =
        Stannum::Constraints::Presence.new(message: "can't be blank")

      key 'confirm_password', presence_constraint
      key 'old_password',     presence_constraint
      key 'new_password',     presence_constraint

      constraint Stannum::Constraints::Properties::DoNotMatchProperty.new(
        'old_password',
        'new_password',
        allow_empty: true,
        allow_nil:   true,
        message:     "can't match old password"
      )

      constraint Stannum::Constraints::Properties::MatchProperty.new(
        'new_password',
        'confirm_password',
        allow_empty: true,
        allow_nil:   true,
        message:     'does not match'
      )
    end.freeze

    private

    def process(request:)
      super

      step { require_session }

      step { validate_parameters(PARAMETERS_CONTRACT) }

      step { update_password }

      success({})
    end

    def require_session
      return request.session if request.respond_to?(:session) && request.session

      error = Librum::Core::Errors::AuthenticationFailed.new

      failure(error)
    end

    def update_password
      Authentication::Passwords::Update
        .new(repository: repository, user: request.current_user)
        .call(
          new_password: params['new_password'],
          old_password: params['old_password']
        )
    end
  end
end
