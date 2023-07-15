# frozen_string_literal: true

Librum::Iam::Engine.instance_exec do
  config.authentication_session_path       = '/authentication/session'
  config.authentication_user_path          = '/authentication/user'
  config.authentication_user_password_path = '/authentication/user/password'

  config.to_prepare do
    # Add #homebrew_source association to User model.
    Librum::Iam::User.include(Librum::Tabletop::HomebrewUser)
  end
end
