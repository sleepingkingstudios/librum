# frozen_string_literal: true

# Abstract base class for HTML controllers for core resources.
class CoreController < ViewController
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

  middleware Actions::View::Middleware::PageNavigation.new(
    navigation: navigation
  )
end
