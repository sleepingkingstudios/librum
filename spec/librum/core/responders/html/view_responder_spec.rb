# frozen_string_literal: true

require 'rails_helper'

require 'cuprum/rails/rspec/contracts/responder_contracts'

RSpec.describe Librum::Core::Responders::Html::ViewResponder do
  include Cuprum::Rails::RSpec::Contracts::ResponderContracts
  include Librum::Core::RSpec::Contracts::Responders::HtmlContracts

  subject(:responder) { described_class.new(**constructor_options) }

  let(:action_name) { 'implement' }
  let(:controller)  { CustomController.new }
  let(:request)     { Cuprum::Rails::Request.new }
  let(:resource)    { Cuprum::Rails::Resource.new(resource_name: 'rockets') }
  let(:constructor_options) do
    {
      action_name: action_name,
      controller:  controller,
      request:     request
    }
  end

  include_contract 'should implement the responder methods',
    controller_name: 'CustomController'

  describe '#call' do
    let(:response) { responder.call(result) }

    describe 'with a failing result with an AuthenticationError' do
      let(:error) do
        Librum::Core::Errors::AuthenticationError
          .new(message: 'Unable to log in')
      end
      let(:result) { Cuprum::Result.new(error: error) }

      include_contract 'should render page',
        Librum::Iam::View::Pages::LoginPage,
        assigns:     {},
        http_status: :unauthorized,
        layout:      'login',
        resource:    nil
    end
  end
end
