# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "#{Authentication::Users::PasswordsController} routes",
  type: :routing \
do
  let(:controller) { 'authentication/users/passwords' }

  describe 'GET /authentication/user/password' do
    it 'should route to Authentication::Users::PasswordsController#edit' do
      expect(get: '/authentication/user/password').to route_to(
        controller: controller,
        action:     'edit'
      )
    end
  end

  describe 'PATCH /authentication/user/password' do
    it 'should route to Authentication::Users::PasswordsController#update' do
      expect(patch: '/authentication/user/password').to route_to(
        controller: controller,
        action:     'update'
      )
    end
  end
end
