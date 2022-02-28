# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "#{ClientController} routes", type: :routing do
  describe 'GET /' do
    let(:controller) { 'client' }

    it 'should route to ClientController#index' do
      expect(get: '/').to route_to(
        controller: controller,
        action:     'index',
        path:       ''
      )
    end
  end

  describe 'GET /path/to/resource' do
    let(:controller) { 'client' }

    it 'should route to ClientController#index' do
      expect(get: '/path/to/resource').to route_to(
        controller: controller,
        action:     'index',
        path:       'path/to/resource'
      )
    end
  end

  describe 'GET /api/path/to/resource' do
    it { expect(get: '/api/path/to/resource').not_to be_routable }
  end
end
