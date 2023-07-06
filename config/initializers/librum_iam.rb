# frozen_string_literal: true

Librum::Iam::Engine.instance_exec do
  config.authentication_session_path       = '/authentication/session'
  config.authentication_user_path          = '/authentication/user'
  config.authentication_user_password_path = '/authentication/user/password'

  config.after_initialize do
    Librum::Iam::User.instance_exec do
      ## Associations
      has_one :homebrew_source,
        class_name: 'Sources::Homebrew',
        dependent:  :destroy
    end
  end
end
