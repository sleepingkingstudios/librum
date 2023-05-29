# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts'

module Spec::Support::Contracts
  module ResponderContracts
    # Contract asserting the action redirects to the previous path.
    module ShouldRedirectBack
      extend RSpec::SleepingKingStudios::Contract

      contract do |fallback_location: '/', status: 302|
        let(:response) { responder.call(result) }

        it 'should redirect to the previous path' do
          expect(response)
            .to be_a Cuprum::Rails::Responses::Html::RedirectBackResponse
        end

        it { expect(response.fallback_location).to be == fallback_location }

        it { expect(response.status).to be status }
      end
    end

    # Contract asserting the action redirects to the specified path.
    module ShouldRedirectTo
      extend RSpec::SleepingKingStudios::Contract

      contract do |path, status: 302|
        let(:response) { responder.call(result) }

        it 'should redirect to the specified path' do
          expect(response)
            .to be_a Cuprum::Rails::Responses::Html::RedirectResponse
        end

        it { expect(response.path).to be == path }

        it { expect(response.status).to be status }
      end
    end

    # Contract asserting the action renders the specified view component.
    module ShouldRenderComponent
      extend RSpec::SleepingKingStudios::Contract

      contract do |component_class, layout: nil, status: 200, &block|
        let(:response) { responder.call(result) }

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

        it { expect(response.layout).to be == layout }

        it { expect(response.status).to be == status }

        instance_exec(&block) if block.is_a?(Proc)
      end
    end
  end
end
