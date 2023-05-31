# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::FormField, type: :component do
  subject(:field) { described_class.new(name, **options) }

  let(:name)    { 'color' }
  let(:options) { {} }
  let(:rendered) { render_inline(field) }
  let(:snapshot) do
    <<~HTML
      <div class="field">
        <label for="color" class="label">Color</label>
        <div class="control">
          <input id="color" name="color" class="input" type="text">
        </div>
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
        .and_keywords(:errors, :icon, :type)
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with errors: value' do
    let(:errors)  { ['is not red', 'is not blue'] }
    let(:options) { super().merge(errors: errors) }
    let(:snapshot) do
      <<~HTML
        <div class="field">
          <label for="color" class="label">Color</label>
          <div class="control has-icons-right">
            <input id="color" name="color" class="input is-danger" type="text">
            <span class="icon is-right is-small">
              <i class="fas fa-triangle-exclamation"></i>
            </span>
          </div>
          <p class="help is-danger">is not red, is not blue</p>
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
        <div class="field">
          <label for="color" class="label">Color</label>
          <div class="control has-icons-left">
            <input id="color" name="color" class="input" type="text">
            <span class="icon is-left is-small">
              <i class="fas fa-radiation"></i>
            </span>
          </div>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with name: bracket-separated string' do
    let(:name) { 'image[color]' }
    let(:snapshot) do
      <<~HTML
        <div class="field">
          <label for="image_color" class="label">Image Color</label>
          <div class="control">
            <input id="image_color" name="image[color]" class="input" type="text">
          </div>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with name: period-separated string' do
    let(:name) { 'image.color' }
    let(:snapshot) do
      <<~HTML
        <div class="field">
          <label for="image_color" class="label">Image Color</label>
          <div class="control">
            <input id="image_color" name="image.color" class="input" type="text">
          </div>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with type: value' do
    let(:type)    { 'email' }
    let(:options) { super().merge(type: type) }
    let(:snapshot) do
      <<~HTML
        <div class="field">
          <label for="color" class="label">Color</label>
          <div class="control">
            <input id="color" name="color" class="input" type="email">
          </div>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
