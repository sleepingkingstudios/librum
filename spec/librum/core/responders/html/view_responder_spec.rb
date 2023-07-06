# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/responders/html/view_responder'
require 'librum/core/rspec/contracts/responders/html_contracts'

RSpec.describe Librum::Core::Responders::Html::ViewResponder do
  include Librum::Core::RSpec::Contracts::Responders::HtmlContracts

  subject(:responder) { described_class.new(**constructor_options) }

  let(:action_name)     { :implement }
  let(:controller_name) { 'CustomController' }
  let(:member_action)   { false }
  let(:resource) do
    Cuprum::Rails::Resource.new(resource_name: 'rockets')
  end
  let(:constructor_options) do
    {
      action_name:     action_name,
      controller_name: controller_name,
      member_action:   member_action,
      resource:        resource
    }
  end

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
