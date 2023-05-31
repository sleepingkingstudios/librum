# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Button, type: :component do
  subject(:button) { described_class.new(**options) }

  let(:options)  { {} }
  let(:rendered) { render_inline(button) }
  let(:snapshot) do
    <<~HTML
      <button type="button" class="button"></button>
    HTML
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:color, :label, :type)
    end
  end

  it 'should match the snapshot' do
    expect(rendered).to match_snapshot(snapshot)
  end

  describe 'with color: value' do
    let(:color)   { 'primary' }
    let(:options) { super().merge(color: color) }
    let(:snapshot) do
      <<~HTML
        <button type="button" class="button is-primary"></button>
      HTML
    end

    it 'should match the snapshot' do
      expect(rendered).to match_snapshot(snapshot)
    end
  end

  describe 'with label: value' do
    let(:label)   { 'Go Directly To Jail' }
    let(:options) { super().merge(label: label) }
    let(:snapshot) do
      <<~HTML
        <button type="button" class="button">Go Directly To Jail</button>
      HTML
    end

    it 'should match the snapshot' do
      expect(rendered).to match_snapshot(snapshot)
    end
  end

  describe 'with type: value' do
    let(:type)    { 'submit' }
    let(:options) { super().merge(type: type) }
    let(:snapshot) do
      <<~HTML
        <button type="submit" class="button"></button>
      HTML
    end

    it 'should match the snapshot' do
      expect(rendered).to match_snapshot(snapshot)
    end
  end
end
