# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::DataList, type: :component do
  subject(:data_list) { described_class.new(**constructor_options) }

  shared_context 'with mock component' do |component_name|
    class_name = "Spec::#{component_name.camelize}Component"

    let(:"#{component_name}_component") { class_name.constantize }
    let(:constructor_options) do
      super().merge(
        "#{component_name}_component": send("#{component_name}_component")
      )
    end

    example_class class_name, View::Components::MockComponent do |klass|
      name = component_name

      klass.define_method(:initialize) { |**options| super(name, **options) }
    end
  end

  let(:data) do
    {
      'first_name' => 'Alan',
      'last_name'  => 'Bradley',
      'role'       => 'user'
    }
  end
  let(:fields) do
    [
      { key: 'first_name' },
      {
        key:   'last_name',
        label: 'Surname'
      },
      { key: 'role' }
    ]
  end
  let(:constructor_options) do
    { data: data, fields: fields }
  end
  let(:rendered) { render_inline(data_list) }
  let(:snapshot) do
    <<~HTML
      <div class="content">
        <div class="block">
          <p class="has-text-weight-semibold mb-1">First Name</p>
          <p>
        Alan
      </p>
        </div>
        <div class="block">
          <p class="has-text-weight-semibold mb-1">Surname</p>
          <p>
        Bradley
      </p>
        </div>
        <div class="block">
          <p class="has-text-weight-semibold mb-1">Role</p>
          <p>
        user
      </p>
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
        .with(0).arguments
        .and_keywords(:data, :fields, :item_component)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with item_component: value' do
    include_context 'with mock component', 'item'

    let(:snapshot) do
      <<~HTML
        <div class="content">
          <div class="block">
            <p class="has-text-weight-semibold mb-1">First Name</p>
            <mock name="item" data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}' field='#&lt;Field key="first_name"&gt;'></mock>
          </div>
          <div class="block">
            <p class="has-text-weight-semibold mb-1">Surname</p>
            <mock name="item" data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}' field='#&lt;Field key="last_name"&gt;'></mock>
          </div>
          <div class="block">
            <p class="has-text-weight-semibold mb-1">Role</p>
            <mock name="item" data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}' field='#&lt;Field key="role"&gt;'></mock>
          </div>
        </div>
      HTML
    end

    before(:example) do
      data_list.fields.each do |field|
        allow(field).to receive(:inspect) do
          %(#<Field key="#{field.key}">)
        end
      end
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    describe 'with custom options' do
      let(:constructor_options) { super().merge(key: 'value') }
      let(:snapshot) do
        <<~HTML
          <div class="content">
            <div class="block">
              <p class="has-text-weight-semibold mb-1">First Name</p>
              <mock name="item" data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}' field='#&lt;Field key="first_name"&gt;' key="value"></mock>
            </div>
            <div class="block">
              <p class="has-text-weight-semibold mb-1">Surname</p>
              <mock name="item" data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}' field='#&lt;Field key="last_name"&gt;' key="value"></mock>
            </div>
            <div class="block">
              <p class="has-text-weight-semibold mb-1">Role</p>
              <mock name="item" data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}' field='#&lt;Field key="role"&gt;' key="value"></mock>
            </div>
          </div>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
