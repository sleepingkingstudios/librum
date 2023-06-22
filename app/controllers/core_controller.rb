# frozen_string_literal: true

require 'librum/core/actions/view/middleware/page_navigation'

# Abstract base class for HTML controllers for core resources.
class CoreController < Librum::Core::ViewController
  def self.navigation
    @navigation ||= {
      icon:  'dice-d20',
      label: 'Home',
      items: [
        {
          label: 'Publishers',
          url:   '/core/publishers'
        }
      ]
    }
  end

  middleware Librum::Core::Actions::View::Middleware::PageNavigation.new(
    navigation: navigation
  )
end
