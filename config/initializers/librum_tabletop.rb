# frozen_string_literal: true

Librum::Tabletop::Engine.instance_exec do
  Librum::Tabletop::Engine.config.base_url = '/core'

  Librum::Tabletop::Engine.config.page_breadcrumbs = [
    {
      label: 'Home',
      url:   '/'
    }.freeze
  ].freeze

  Librum::Tabletop::Engine.config.page_navigation = {
    icon:  'dice-d20',
    label: 'Home',
    items: [
      {
        label: 'Publishers',
        url:   '/core/publishers'
      }.freeze
    ].freeze
  }.freeze

  Librum::Tabletop::Engine.config.user_model = 'Librum::Iam::User'
end
