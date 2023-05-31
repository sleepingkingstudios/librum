# frozen_string_literal: true

require 'rspec/sleeping_king_studios/contract'

require 'support/contracts'

module Spec::Support::Contracts
  module ResponderContracts
    # Contract asserting the action redirects to the previous path.
    module ShouldRedirectBack
      extend RSpec::SleepingKingStudios::Contract

      contract do |fallback_location: '/', flash: {}, status: 302|
        let(:response) { responder.call(result) }
        let(:expected_flash) do
          # :nocov:
          next flash unless flash.is_a?(Proc)

          instance_exec(&flash)
          # :nocov:
        end

        it 'should redirect to the previous path' do
          expect(response)
            .to be_a Cuprum::Rails::Responses::Html::RedirectBackResponse
        end

        it { expect(response.fallback_location).to be == fallback_location }

        it { expect(response.flash).to be == expected_flash }

        it { expect(response.status).to be status }
      end
    end

    # Contract asserting the action redirects to the specified path.
    module ShouldRedirectTo
      extend RSpec::SleepingKingStudios::Contract

      contract do |path, flash: {}, status: 302|
        let(:response) { responder.call(result) }
        let(:expected_flash) do
          # :nocov:
          next flash unless flash.is_a?(Proc)

          instance_exec(&flash)
          # :nocov:
        end

        it 'should redirect to the specified path' do
          expect(response)
            .to be_a Cuprum::Rails::Responses::Html::RedirectResponse
        end

        it { expect(response.flash).to be == expected_flash }

        it { expect(response.path).to be == path }

        it { expect(response.status).to be status }
      end
    end

    # Contract asserting the action renders the specified view component.
    module ShouldRenderComponent
      extend RSpec::SleepingKingStudios::Contract

      contract do |component_class, flash: {}, layout: nil, status: 200, &block|
        let(:response) { responder.call(result) }
        let(:expected_flash) do
          # :nocov:
          next flash unless flash.is_a?(Proc)

          instance_exec(&flash)
          # :nocov:
        end

        it { expect(response).to be_a Responses::Html::RenderComponentResponse }

        it { expect(response.component).to be_a component_class }

        it { expect(response.flash).to be == expected_flash }

        it { expect(response.layout).to be == layout }

        it { expect(response.status).to be == status }

        instance_exec(&block) if block.is_a?(Proc)
      end
    end
  end
end
