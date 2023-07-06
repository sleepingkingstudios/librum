# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Core::Publishers::Block, type: :component do
  subject(:block) { described_class.new(data: data) }

  let(:data) { FactoryBot.build(:publisher, name: 'Custom Publisher') }

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:data)
        .and_any_keywords
    end
  end

  describe '#call' do
    let(:rendered) { render_inline(block) }
    let(:snapshot) do
      <<~HTML
        <div class="block content">
          <div class="columns mb-0">
            <div class="column is-2 has-text-weight-semibold mb-1">
              Name
            </div>

            <div class="column">
              Custom Publisher
            </div>
          </div>

          <div class="columns mb-0">
            <div class="column is-2 has-text-weight-semibold mb-1">
              Slug
            </div>

            <div class="column">
              custom-publisher
            </div>
          </div>

          <div class="columns mb-0">
            <div class="column is-2 has-text-weight-semibold mb-1">
              Website
            </div>

            <div class="column">
              —
            </div>
          </div>
        </div>
      HTML
    end

    it { expect(rendered).to match_snapshot(snapshot) }

    describe 'when the publisher has website: value' do
      let(:data) do
        FactoryBot.build(
          :publisher,
          name:    'Custom Publisher',
          website: 'www.example.com'
        )
      end
      let(:snapshot) do
        <<~HTML
          <div class="block content">
            <div class="columns mb-0">
              <div class="column is-2 has-text-weight-semibold mb-1">
                Name
              </div>

              <div class="column">
                Custom Publisher
              </div>
            </div>

            <div class="columns mb-0">
              <div class="column is-2 has-text-weight-semibold mb-1">
                Slug
              </div>

              <div class="column">
                custom-publisher
              </div>
            </div>

            <div class="columns mb-0">
              <div class="column is-2 has-text-weight-semibold mb-1">
                Website
              </div>

              <div class="column">
                <a class="has-text-link" href="https://www.example.com" target="_blank">
                  <span class="icon-text">
                    <span class="icon">
                      <i class="fas fa-link"></i>
                    </span>

                    <span>www.example.com</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        HTML
      end

      it { expect(rendered).to match_snapshot(snapshot) }
    end
  end

  describe '#data' do
    include_examples 'should define reader', :data, -> { data }
  end
end
