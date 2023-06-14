# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::DataList::Item, type: :component do
  subject(:list_item) do
    described_class.new(
      data:  data,
      field: field
    )
  end

  let(:data)     { Struct.new(:name).new('Alan Bradley') }
  let(:field)    { { key: 'name' } }
  let(:rendered) { render_inline(list_item) }
  let(:snapshot) do
    <<~HTML
      <p>
        Alan Bradley
      </p>
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
        .and_keywords(:data, :field)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with value: a ViewComponent' do
    let(:value) { Spec::CustomComponent.new }
    let(:field) { super().merge(value: value) }
    let(:snapshot) do
      <<~HTML
        <mock name="custom_component"></mock>
      HTML
    end

    example_class 'Spec::CustomComponent', View::Components::MockComponent \
    do |klass|
      klass.define_method(:initialize) do |**options|
        super('custom_component', **options)
      end
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
