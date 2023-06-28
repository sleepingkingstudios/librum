# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "#{Librum::Iam::View::SessionsController} routes",
  type: :routing \
do
  let(:controller) { 'librum/iam/view/sessions' }

  describe 'DELETE /authentication/session' do
    it 'should route to Authentication::SessionsController#create' do
      expect(delete: '/authentication/session').to route_to(
        controller: controller,
        action:     'destroy'
      )
    end
  end

  describe 'POST /authentication/session' do
    it 'should route to Authentication::SessionsController#create' do
      expect(post: '/authentication/session').to route_to(
        controller: controller,
        action:     'create'
      )
    end
  end
end
