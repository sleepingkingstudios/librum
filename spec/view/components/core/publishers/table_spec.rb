# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Core::Publishers::Table, type: :component do
  subject(:table) { described_class.new(**constructor_options) }

  shared_context 'with data' do
    let(:publisher_names) do
      [
        'Free Stars Gazette',
        'Summerlands Press',
        'Underhill Publishing'
      ]
    end
    let(:data) do
      ary = publisher_names.map do |name|
        FactoryBot.build(:publisher, name: name)
      end

      ary.first.website = 'www.example.com'

      ary
    end
  end

  let(:data)     { [] }
  let(:resource) { Cuprum::Rails::Resource.new(resource_name: 'publishers') }
  let(:constructor_options) do
    {
      data:     data,
      resource: resource
    }
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:data, :resource)
    end
  end

  describe '#call' do
    let(:rendered) { render_inline(table) }
    let(:snapshot) do
      <<~HTML
        <table class="table is-striped">
          <thead>
            <tr>
              <th>Name</th>

              <th>Website</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colspan="2">There are no publishers matching the criteria.</td>
            </tr>
          </tbody>
        </table>
      HTML
    end

    it { expect(rendered).to match_snapshot(snapshot) }

    wrap_context 'with data' do
      let(:snapshot) do
        <<~HTML
          <table class="table is-striped">
            <thead>
              <tr>
                <th>Name</th>

                <th>Website</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <a class="has-text-link" href="/core/publishers/free-stars-gazette" target="_self">
                    Free Stars Gazette
                  </a>
                </td>

                <td>
                  <a class="has-text-link" href="https://www.example.com" target="_blank">
                    <span class="icon-text">
                      <span class="icon">
                        <i class="fas fa-link"></i>
                      </span>

                      <span>www.example.com</span>
                    </span>
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  <a class="has-text-link" href="/core/publishers/summerlands-press" target="_self">
                    Summerlands Press
                  </a>
                </td>

                <td>
                  —
                </td>
              </tr>

              <tr>
                <td>
                  <a class="has-text-link" href="/core/publishers/underhill-publishing" target="_self">
                    Underhill Publishing
                  </a>
                </td>

                <td>
                  —
                </td>
              </tr>
            </tbody>
          </table>
        HTML
      end

      it { expect(rendered).to match_snapshot(snapshot) }
    end
  end

  describe '#data' do
    include_examples 'should define reader', :data, -> { data }
  end
end
