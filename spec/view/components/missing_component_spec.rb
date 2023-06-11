# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::MissingComponent, type: :component do
  subject(:component) { described_class.new(**constructor_options) }

  let(:name)                { 'Launch Pad' }
  let(:constructor_options) { { name: name } }
  let(:rendered)            { render_inline(component) }
  let(:snapshot) do
    <<~HTML
      <div class="box">
        <p class="has-text-centered">
          <span class="icon is-large has-text-danger">
            <i class="fas fa-2x fa-bug"></i>
          </span>
        </p>
        <h2 class="title has-text-centered has-text-danger">Missing Component Launch Pad</h2>
      </div>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n{2,}/, "\n")
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:icon, :label, :message, :name)
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with icon: value' do
    let(:constructor_options) { super().merge(icon: 'rocket') }
    let(:snapshot) do
      <<~HTML
        <div class="box">
          <p class="has-text-centered">
            <span class="icon is-large has-text-danger">
              <i class="fas fa-2x fa-rocket"></i>
            </span>
          </p>
          <h2 class="title has-text-centered has-text-danger">Missing Component Launch Pad</h2>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with label: value' do
    let(:label)               { 'T-Minus 10, 9, 8...' }
    let(:constructor_options) { super().merge(label: label) }
    let(:snapshot) do
      <<~HTML
        <div class="box">
          <p class="has-text-centered">
            <span class="icon is-large has-text-danger">
              <i class="fas fa-2x fa-bug"></i>
            </span>
          </p>
          <h2 class="title has-text-centered has-text-danger">T-Minus 10, 9, 8...</h2>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with message: value' do
    let(:message)             { 'Expected Launch Site: KSC' }
    let(:constructor_options) { super().merge(message: message) }
    let(:snapshot) do
      <<~HTML
        <div class="box">
          <p class="has-text-centered">
            <span class="icon is-large has-text-danger">
              <i class="fas fa-2x fa-bug"></i>
            </span>
          </p>
          <h2 class="title has-text-centered has-text-danger">Missing Component Launch Pad</h2>
          <p class="has-text-centered">Expected Launch Site: KSC</p>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
