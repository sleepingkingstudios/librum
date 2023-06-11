# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Table::Cell, type: :component do
  subject(:cell) do
    described_class.new(
      column: View::Components::Table::ColumnDefinition.new(**column),
      item:   item
    )
  end

  let(:column)   { { key: 'name' } }
  let(:item)     { Struct.new(:name).new('Alan Bradley') }
  let(:rendered) { render_inline(cell) }
  let(:snapshot) do
    <<~HTML
      <td>
        Alan Bradley
      </td>
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
        .and_keywords(:column, :item)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with column: { default: a value }' do
    let(:column) { { key: 'name', default: '(none)' } }

    context 'when the value is nil' do
      let(:item) { Struct.new(:name).new(nil) }
      let(:snapshot) do
        <<~HTML
          <td>
            (none)
          </td>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    context 'when the value is an empty string' do
      let(:item) { Struct.new(:name).new('') }
      let(:snapshot) do
        <<~HTML
          <td>
            (none)
          </td>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    context 'when the value is present' do
      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end

  describe 'with column: { default: a Proc }' do
    let(:column) do
      {
        key:     'slug',
        default: ->(item) { item.name.underscore.tr('_ ', '--') }
      }
    end

    context 'when the value is nil' do
      let(:item) { Struct.new(:name, :slug).new('Alan Bradley', nil) }
      let(:snapshot) do
        <<~HTML
          <td>
            alan-bradley
          </td>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    context 'when the value is an empty string' do
      let(:item) { Struct.new(:name, :slug).new('Alan Bradley', '') }
      let(:snapshot) do
        <<~HTML
          <td>
            alan-bradley
          </td>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    context 'when the value is present' do
      let(:item) { Struct.new(:name, :slug).new('Alan Bradley', 'alan-b') }
      let(:snapshot) do
        <<~HTML
          <td>
            alan-b
          </td>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end

  describe 'with column: { icon }' do
    let(:column) { { key: 'name', icon: 'user' } }
    let(:snapshot) do
      <<~HTML
        <td>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-user"></i>
            </span>
            <span>Alan Bradley</span>
          </span>
        </td>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with column: { type: :link }' do
    let(:column) { { key: 'url', type: :link } }
    let(:item)   { Struct.new(:url).new('example.com/users/alan-bradley') }
    let(:snapshot) do
      <<~HTML
        <td>
          <a href="https://example.com/users/alan-bradley" target="_blank">
          example.com/users/alan-bradley
        </a>
        </td>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    describe 'with column: { icon }' do
      let(:column) { { key: 'url', type: :link, icon: 'globe' } }
      let(:snapshot) do
        <<~HTML
          <td>
            <a href="https://example.com/users/alan-bradley" target="_blank">
            <span class="icon-text">
              <span class="icon">
                <i class="fas fa-globe"></i>
              </span>
              <span>example.com/users/alan-bradley</span>
            </span>
          </a>
          </td>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end

  describe 'with column: { value: a Proc }' do
    let(:value)   { ->(item) { "#{item.first_name} #{item.last_name}" } }
    let(:column)  { { key: 'name', value: value } }
    let(:item)    { Struct.new(:first_name, :last_name).new('Alan', 'Bradley') }
    let(:snapshot) do
      <<~HTML
        <td>
          Alan Bradley
        </td>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with column: { value: a ViewComponent }' do
    let(:value)   { Spec::CustomCell.new }
    let(:column)  { { key: 'name', value: value } }
    let(:snapshot) do
      <<~HTML
        <td>
          Custom Cell
        </td>
      HTML
    end

    example_class 'Spec::CustomCell', ViewComponent::Base do |klass|
      klass.define_method(:call) { 'Custom Cell' }
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
