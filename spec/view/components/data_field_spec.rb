# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::DataField, type: :component do
  subject(:data_field) { described_class.new(**constructor_options) }

  let(:data)                { Struct.new(:name).new('Alan Bradley') }
  let(:field)               { { key: 'name' } }
  let(:constructor_options) { { data: data, field: field } }
  let(:rendered)            { render_inline(data_field) }
  let(:snapshot) do
    <<~HTML
      Alan Bradley
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
  end

  describe '::FieldDefinition' do
    subject(:field) { described_class.new(key: key, **options) }

    let(:described_class) { super()::FieldDefinition }
    let(:key)             { 'name' }
    let(:options)         { {} }

    describe '.new' do
      let(:expected_keywords) do
        %i[
          default
          icon
          key
          label
          type
          value
        ]
      end

      it 'should define the constructor' do
        expect(described_class)
          .to be_constructible
          .with(0).arguments
          .and_keywords(*expected_keywords)
      end
    end

    describe '#default' do
      include_examples 'should define reader', :default, nil

      context 'when initialized with default: a Proc' do
        let(:default) { ->(item) { "#{item.first_name} #{item.last_name}" } }
        let(:options) { super().merge(default: default) }

        it { expect(field.default).to be default }
      end

      context 'when initialized with default: a String' do
        let(:default) { 'N/A' }
        let(:options) { super().merge(default: default) }

        it { expect(field.default).to be default }
      end
    end

    describe '#icon' do
      include_examples 'should define reader', :icon, nil

      context 'when initialized with icon: value' do
        let(:icon)    { 'radiation' }
        let(:options) { super().merge(icon: icon) }

        it { expect(field.icon).to be == icon }
      end
    end

    describe '#key' do
      include_examples 'should define reader', :key, -> { key }
    end

    describe '#label' do
      include_examples 'should define reader', :label, 'Name'

      context 'when initialized with key: multi-word String' do
        let(:key) { 'full_name' }

        it { expect(field.label).to be == 'Full Name' }
      end

      context 'when initialized with label: value' do
        let(:label)   { 'Custom Label' }
        let(:options) { super().merge(label: label) }

        it { expect(field.label).to be == label }
      end
    end

    describe '#type' do
      include_examples 'should define reader', :type, :text

      context 'when initialized with type: value' do
        let(:type)    { :link }
        let(:options) { super().merge(type: type) }

        it { expect(field.type).to be :link }
      end
    end

    describe '#value' do
      include_examples 'should define reader', :value, nil

      context 'when initialized with value: a Proc' do
        let(:value)   { ->(item) { "#{item.first_name} #{item.last_name}" } }
        let(:options) { super().merge(value: value) }

        it { expect(field.value).to be value }
      end

      context 'when initialized with value: a ViewComponent' do
        let(:value)   { Spec::CustomComponent.new }
        let(:options) { super().merge(value: value) }

        example_class 'Spec::CustomComponent', ViewComponent::Base

        it { expect(field.value).to be value }
      end
    end
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:data, :field)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with field: { default: a value }' do
    let(:field) { { key: 'name', default: '(none)' } }

    context 'when the value is nil' do
      let(:data) { Struct.new(:name).new(nil) }
      let(:snapshot) do
        <<~HTML
          (none)
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    context 'when the value is an empty string' do
      let(:data) { Struct.new(:name).new('') }
      let(:snapshot) do
        <<~HTML
          (none)
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

  describe 'with field: { default: a Proc }' do
    let(:field) do
      {
        key:     'slug',
        default: ->(item) { item.name.underscore.tr('_ ', '--') }
      }
    end

    context 'when the value is nil' do
      let(:data) { Struct.new(:name, :slug).new('Alan Bradley', nil) }
      let(:snapshot) do
        <<~HTML
          alan-bradley
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    context 'when the value is an empty string' do
      let(:data) { Struct.new(:name, :slug).new('Alan Bradley', '') }
      let(:snapshot) do
        <<~HTML
          alan-bradley
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    context 'when the value is present' do
      let(:data) { Struct.new(:name, :slug).new('Alan Bradley', 'alan-b') }
      let(:snapshot) do
        <<~HTML
          alan-b
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end

  describe 'with field: { icon }' do
    let(:field) { { key: 'name', icon: 'user' } }
    let(:snapshot) do
      <<~HTML
        <span class="icon-text">
          <span class="icon">
            <i class="fas fa-user"></i>
          </span>
          <span>Alan Bradley</span>
        </span>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with field: { type: :link }' do
    let(:field)  { { key: 'url', type: :link } }
    let(:data)   { Struct.new(:url).new('example.com/users/alan-bradley') }
    let(:snapshot) do
      <<~HTML
        <a href="https://example.com/users/alan-bradley" target="_blank">
          example.com/users/alan-bradley
        </a>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    describe 'with :field: { icon }' do
      let(:field) { { key: 'url', type: :link, icon: 'globe' } }
      let(:snapshot) do
        <<~HTML
          <a href="https://example.com/users/alan-bradley" target="_blank">
            <span class="icon-text">
              <span class="icon">
                <i class="fas fa-globe"></i>
              </span>
              <span>example.com/users/alan-bradley</span>
            </span>
          </a>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end

  describe 'with field: { value: a Proc }' do
    let(:value)   { ->(item) { "#{item.first_name} #{item.last_name}" } }
    let(:field)   { { key: 'name', value: value } }
    let(:data)    { Struct.new(:first_name, :last_name).new('Alan', 'Bradley') }
    let(:snapshot) do
      <<~HTML
        Alan Bradley
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with field: { value: a ViewComponent }' do
    let(:value)   { Spec::CustomField.new }
    let(:field)   { { key: 'name', value: value } }
    let(:snapshot) do
      <<~HTML
        Custom Field
      HTML
    end

    example_class 'Spec::CustomField', ViewComponent::Base do |klass|
      klass.define_method(:call) { 'Custom Field' }
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
