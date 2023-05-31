# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Alert, type: :component do
  subject(:alert) { described_class.new(message, **options) }

  let(:message)  { 'Reactor temperature critical' }
  let(:options)  { {} }
  let(:rendered) { render_inline(alert) }
  let(:snapshot) do
    <<~HTML
      <div class="notification">
        Reactor temperature critical
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
        .with(1).argument
        .and_keywords(:color, :icon)
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with color: value' do
    let(:color)   { 'danger' }
    let(:options) { super().merge(color: color) }
    let(:snapshot) do
      <<~HTML
        <div class="notification is-danger">
          Reactor temperature critical
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with icon: value' do
    let(:icon)    { 'radiation' }
    let(:options) { super().merge(icon: icon) }
    let(:snapshot) do
      <<~HTML
        <div class="notification">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-radiation"></i>
            </span>
            <span>Reactor temperature critical</span>
          </span>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
