# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Core::Publishers::Block, type: :component do
  subject(:block) { described_class.new(data: data) }

  let(:data)     { FactoryBot.build(:publisher, name: 'Custom Publisher') }
  let(:rendered) { render_inline(block) }
  let(:snapshot) do
    <<~HTML
      <div class="content">
        <div class="block">
          <p class="has-text-weight-semibold mb-1">Name</p>
          <p>
        Custom Publisher
      </p>
        </div>
        <div class="block">
          <p class="has-text-weight-semibold mb-1">Slug</p>
          <p>
        custom-publisher
      </p>
        </div>
        <div class="block">
          <p class="has-text-weight-semibold mb-1">Website</p>
          <p>
        —
      </p>
        </div>
      </div>
    HTML
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:data)
        .and_any_keywords
    end
  end

  def prettify(html)
    html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

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
        <div class="content">
          <div class="block">
            <p class="has-text-weight-semibold mb-1">Name</p>
            <p>
          Custom Publisher
        </p>
          </div>
          <div class="block">
            <p class="has-text-weight-semibold mb-1">Slug</p>
            <p>
          custom-publisher
        </p>
          </div>
          <div class="block">
            <p class="has-text-weight-semibold mb-1">Website</p>
            <p>
          <a class="has-text-link" href="https://www.example.com" target="_blank">
          <span class="icon-text">
          <span class="icon">
            <i class="fas fa-link"></i>
          </span>
          <span>www.example.com</span>
        </span>
        </a>
        </p>
          </div>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
