# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/resources/view_resource'

RSpec.describe View::Pages::Resources::ShowPage, type: :component do
  subject(:page) { described_class.new(result, resource: resource) }

  shared_context 'with data' do
    let(:data)   { { 'name' => 'Imp IV' } }
    let(:value)  { { resource.singular_resource_name => data } }
    let(:result) { Cuprum::Result.new(value: value) }
  end

  shared_context 'with mock component' do |component_name|
    class_name = "Spec::#{component_name.camelize}Component"

    let(:"#{component_name}_component") { class_name.constantize }

    example_class class_name, View::Components::MockComponent do |klass|
      name = component_name

      klass.define_method(:initialize) { |**options| super(name, **options) }
    end
  end

  let(:result)   { Cuprum::Result.new }
  let(:resource) { Cuprum::Rails::Resource.new(resource_name: 'rockets') }
  let(:rendered) { render_inline(page) }
  let(:snapshot) do
    <<~HTML
      <h1 class="title">Rockets</h1>
      <div class="box">
        <p class="has-text-centered">
          <span class="icon is-large has-text-danger">
            <i class="fas fa-2x fa-bug"></i>
          </span>
        </p>
        <h2 class="title has-text-centered has-text-danger">Missing Component Block</h2>
        <p class="has-text-centered">Rendered in View::Pages::Resources::ShowPage</p>
      </div>
      <p>
        <a href="/rockets" target="_self">
        <span class="icon-text">
          <span class="icon">
            <i class="fas fa-left-long"></i>
          </span>
          <span>Back to Rockets</span>
        </span>
      </a>
      </p>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(1).argument
        .and_keywords(:resource)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with a resource with block_component: value' do
    include_context 'with mock component', 'block'

    let(:resource_options) { {} }
    let(:resource) do
      Librum::Core::Resources::ViewResource.new(
        block_component: Spec::BlockComponent,
        resource_name:   'rockets',
        **resource_options
      )
    end
    let(:snapshot) do
      <<~HTML
        <h1 class="title">Rockets</h1>
        <mock name="block" data="{}" resource="#&lt;ViewResource&gt;"></mock>
        <p>
          <a href="/rockets" target="_self">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-left-long"></i>
            </span>
            <span>Back to Rockets</span>
          </span>
        </a>
        </p>
      HTML
    end

    before(:example) do
      allow(resource).to receive(:inspect).and_return('#<ViewResource>')
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    wrap_context 'with data' do
      let(:snapshot) do
        <<~HTML
          <h1 class="title">Imp IV</h1>
          <mock name="block" data='{"name"=&gt;"Imp IV"}' resource="#&lt;ViewResource&gt;"></mock>
          <p>
            <a href="/rockets" target="_self">
            <span class="icon-text">
              <span class="icon">
                <i class="fas fa-left-long"></i>
              </span>
              <span>Back to Rockets</span>
            </span>
          </a>
          </p>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end

    describe 'with a resource with singular_resource_name: value' do
      include_context 'with data'

      let(:resource_options) { { singular_resource_name: 'rocket_ship' } }
      let(:snapshot) do
        <<~HTML
          <h1 class="title">Imp IV</h1>
          <mock name="block" data='{"name"=&gt;"Imp IV"}' resource="#&lt;ViewResource&gt;"></mock>
          <p>
            <a href="/rockets" target="_self">
            <span class="icon-text">
              <span class="icon">
                <i class="fas fa-left-long"></i>
              </span>
              <span>Back to Rockets</span>
            </span>
          </a>
          </p>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end

  describe 'with a singular resource' do
    let(:resource) do
      Cuprum::Rails::Resource.new(
        resource_name: 'space_program',
        singular:      true
      )
    end
    let(:snapshot) do
      <<~HTML
        <h1 class="title">Space Program</h1>
        <div class="box">
          <p class="has-text-centered">
            <span class="icon is-large has-text-danger">
              <i class="fas fa-2x fa-bug"></i>
            </span>
          </p>
          <h2 class="title has-text-centered has-text-danger">Missing Component Block</h2>
          <p class="has-text-centered">Rendered in View::Pages::Resources::ShowPage</p>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    describe 'with a resource with block_component: value' do
      include_context 'with mock component', 'block'

      let(:resource) do
        Librum::Core::Resources::ViewResource.new(
          block_component: Spec::BlockComponent,
          resource_name:   'space_program',
          singular:        true
        )
      end
      let(:snapshot) do
        <<~HTML
          <h1 class="title">Space Program</h1>
          <mock name="block" data="{}" resource="#&lt;Resource&gt;"></mock>
        HTML
      end

      before(:example) do
        allow(resource).to receive(:inspect).and_return('#<Resource>')
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
