# frozen_string_literal: true

module View::Layouts
  # Component for rendering the page alerts.
  class Page::Alerts < ViewComponent::Base
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
end
