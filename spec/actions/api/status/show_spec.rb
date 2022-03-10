# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Actions::Api::Status::Show do
  subject(:action) { described_class.new(resource: resource) }

  let(:resource) do
    Cuprum::Rails::Resource.new(
      resource_name: 'status',
      singular:      true
    )
  end

  describe '#call' do
    let(:request) { instance_double(Cuprum::Rails::Request) }

    it 'should return a passing result' do
      expect(action.call(request: request))
        .to be_a_passing_result
        .with_value({})
    end
  end
end
