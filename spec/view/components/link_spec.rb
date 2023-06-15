# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Link, type: :component do
  subject(:link) { described_class.new(url, **options) }

  let(:url)      { 'path/to/resource' }
  let(:options)  { {} }
  let(:rendered) { render_inline(link) }
  let(:snapshot) do
    <<~HTML
      <a class="has-text-link" href="path/to/resource" target="_self">
        path/to/resource
      </a>
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
        .and_keywords(:label)
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with an absolute url' do
    let(:url) { '/path/to/resource' }
    let(:snapshot) do
      <<~HTML
        <a class="has-text-link" href="/path/to/resource" target="_self">
          /path/to/resource
        </a>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with an external url' do
    let(:url) { 'www.example.com' }
    let(:snapshot) do
      <<~HTML
        <a class="has-text-link" href="https://www.example.com" target="_blank">
          www.example.com
        </a>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with an external url with protocol' do
    let(:url) { 'http://www.example.com' }
    let(:snapshot) do
      <<~HTML
        <a class="has-text-link" href="http://www.example.com" target="_blank">
          http://www.example.com
        </a>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with class_names: value' do
    let(:options) { super().merge(class_names: %w[custom-class]) }
    let(:snapshot) do
      <<~HTML
        <a class="custom-class has-text-link" href="path/to/resource" target="_self">
          path/to/resource
        </a>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with color: value' do
    let(:options) { super().merge(color: 'danger') }
    let(:snapshot) do
      <<~HTML
        <a class="has-text-danger" href="path/to/resource" target="_self">
          path/to/resource
        </a>
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
        <a class="has-text-link" href="path/to/resource" target="_self">
          <span class="icon-text">
          <span class="icon">
            <i class="fas fa-radiation"></i>
          </span>
          <span>path/to/resource</span>
        </span>
        </a>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with label: value' do
    let(:label)   { 'Resource Name' }
    let(:options) { super().merge(label: label) }
    let(:snapshot) do
      <<~HTML
        <a class="has-text-link" href="path/to/resource" target="_self">
          Resource Name
        </a>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
