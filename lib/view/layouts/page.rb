# frozen_string_literal: true

module View::Layouts
  # Default layout for server-side rendered pages.
  class Page < ViewComponent::Base
    # Renders the page alerts.
    class Alerts < ViewComponent::Base
      # Value class representing an alert to display.
      Alert = Struct.new(:message, :color, :icon, keyword_init: true)

      # @param alerts [Hash{String=>String}] the alerts to display.
      def initialize(alerts:)
        super()

        @alerts = parse_alerts(alerts)
      end

      # @return [Array<Alert>] the configured alert objects.
      attr_reader :alerts

      private

      def parse_alert(alert)
        return alert if alert.is_a?(Hash)

        { 'message' => alert }
      end

      def parse_alerts(alerts)
        alerts.map do |(key, value)|
          alert = parse_alert(value)

          Alert.new(color: key, **alert)
        end
      end
    end

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

    # @param alerts [Hash{String=>String}] the alerts to display.
    # @param current_user [Authentication::User, nil] the current authenticated
    #   user.
    # @param navigation [Array, false] the configured navigation, or false if
    #   the navigation bar is hidden.
    def initialize(
      alerts:       nil,
      current_user: nil,
      navigation:   [],
      **
    )
      super()

      @alerts       = alerts
      @current_user = current_user
      @navigation   = navigation
    end

    # @return [Hash{String=>String}] the alerts to display.
    attr_reader :alerts

    # @return [Authentication::User, nil] the current authenticated user.
    attr_reader :current_user

    # @return [Array, false] the configured navigation, or false if the
    #   navigation bar is hidden.
    attr_reader :navigation
  end
end
