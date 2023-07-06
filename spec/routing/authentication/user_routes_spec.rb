# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "#{Authentication::UsersController} routes", type: :routing do
  let(:controller) { 'authentication/users' }

  describe 'GET /authentication/user' do
    it 'should route to Authentication::UsersController#show' do
      expect(get: '/authentication/user').to route_to(
        controller: controller,
        action:     'show'
      )
    end
  end
end
