# frozen_string_literal: true

require 'actions/render_view'

RSpec.describe Actions::RenderView do
  subject(:action) { described_class.new(resource: resource) }

  let(:resource) { Cuprum::Rails::Resource.new(resource_name: 'resource') }

  describe '#call' do
    let(:request) { Object.new.freeze }

    it 'should define the method' do
      expect(action).to be_callable.with(0).arguments.and_keywords(:request)
    end

    it 'should return a passing result' do
      expect(action.call(request: request))
        .to be_a_passing_result
        .with_value(nil)
        .and_error(nil)
    end
  end
end
