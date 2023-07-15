# frozen_string_literal: true

Librum::Tabletop::Engine.instance_exec do
  Librum::Tabletop::Engine.config.user_model = 'Librum::Iam::User'
end
