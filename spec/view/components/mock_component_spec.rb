# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::MockComponent, type: :component do
  subject(:mock) { described_class.new(name, **options) }

  let(:name)    { 'custom' }
  let(:options) { {} }
  let(:rendered) { render_inline(mock) }
  let(:snapshot) do
    <<~HTML
      <mock name="custom"></mock>
    HTML
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(1).argument
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(rendered).to match_snapshot(snapshot)
  end

  context 'with options' do
    let(:options) { { key: 'value', option: true } }
    let(:snapshot) do
      <<~HTML
        <mock name="custom" key="value" option="true"></mock>
      HTML
    end

    it 'should match the snapshot' do
      expect(rendered).to match_snapshot(snapshot)
    end
  end
end
