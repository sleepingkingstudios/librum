# frozen_string_literal: true

Librum::Iam::Engine.instance_exec do
  config.after_initialize do
    Librum::Iam::User.instance_exec do
      ## Associations
      has_one :homebrew_source,
        class_name: 'Sources::Homebrew',
        dependent:  :destroy
    end
  end
end
