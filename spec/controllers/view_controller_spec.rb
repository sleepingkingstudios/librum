# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/rspec/contracts/controller_contracts'

RSpec.describe ViewController, type: :controller do
  include Librum::Core::RSpec::Contracts::ControllerContracts

  describe '.default_format' do
    it { expect(described_class.default_format).to be :html }
  end

  describe '.repository' do
    subject(:repository) { described_class.repository }

    it { expect(repository).to be_a Cuprum::Rails::Repository }
  end

  describe '.responders' do
    include_contract 'should respond to format',
      :html,
      using: Responders::HtmlResponder

    include_contract 'should not respond to format', :json
  end
end
