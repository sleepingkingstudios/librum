# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "#{Api::StatusController} routes", type: :routing do
  let(:controller) { 'api/status' }

  describe 'GET /api/status' do
    it 'should route to Api::StatusController#show' do
      expect(get: '/api/status').to route_to(
        controller: controller,
        action:     'show'
      )
    end
  end
end
