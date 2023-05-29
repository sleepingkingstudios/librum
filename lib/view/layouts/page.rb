# frozen_string_literal: true

module View::Layouts
  # Default layout for server-side rendered pages.
  class Page < ViewComponent::Base
    # Renders the page banner and navigation.
    class Banner < ViewComponent::Base
      # @param navigation [Array, false] the configured navigation, or false if
      #   the navigation bar is hidden.
      def initialize(navigation: [], **)
        super()

        @navigation = navigation
      end

      # @return [Array, false] the configured navigation, or false if the
      #   navigation bar is hidden.
      attr_reader :navigation
    end

    class Footer < ViewComponent::Base; end

    class Navigation < ViewComponent::Base; end

    # Renders the current session.
    class Session < ViewComponent::Base
      # @param current_user [Authentication::User, nil] the current authenticated
      #   user.
      def initialize(current_user:)
        super()

        @current_user = current_user
      end

      # @return [Authentication::User] the current authenticated user.
      attr_reader :current_user
    end

    # @param current_user [Authentication::User, nil] the current authenticated
    #   user.
    # @param navigation [Array, false] the configured navigation, or false if
    #   the navigation bar is hidden.
    def initialize(
      current_user: nil,
      navigation: [],
      **
    )
      super()

      @current_user = current_user
      @navigation   = navigation
    end

    # @return [Authentication::User, nil] the current authenticated user.
    attr_reader :current_user

    # @return [Array, false] the configured navigation, or false if the
    #   navigation bar is hidden.
    attr_reader :navigation
  end
end
