# frozen_string_literal: true

require 'rails_helper'

require 'librum/core/resources/view_resource'

RSpec.describe View::Pages::Resources::IndexPage, type: :component do
  subject(:page) { described_class.new(result, resource: resource) }

  shared_context 'with data' do
    let(:value) do
      {
        'rockets' => [
          {
            'name'    => 'Imp IV',
            'payload' => '10 tonnes'
          },
          {
            'name'    => 'Imp VI',
            'payload' => '10 tonnes'
          },
          {
            'name'    => 'Hellhound II',
            'payload' => '100 tonnes'
          }
        ]
      }
    end
  end

  let(:value)    { {} }
  let(:result)   { Cuprum::Rails::Result.new(value: value) }
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
        <h2 class="title has-text-centered has-text-danger">Missing Component Table</h2>
        <p class="has-text-centered">Rendered in View::Pages::Resources::IndexPage</p>
      </div>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with a table component' do
    let(:columns) do
      [
        { key: 'name' },
        { key: 'payload' }
      ]
    end
    let(:resource) do
      Librum::Core::Resources::ViewResource.new(
        resource_name:   'rockets',
        table_component: Spec::TableComponent
      )
    end
    let(:snapshot) do
      <<~HTML
        <h1 class="title">Rockets</h1>
        <table class="table is-striped">
          <thead>
          <tr>
            <th>Name</th>
            <th>Payload</th>
          </tr>
        </thead>
          <tbody>
          <tr>
          <td colspan="2">There are no rockets matching the criteria.</td>
        </tr>
        </tbody>
        </table>
      HTML
    end

    example_class 'Spec::TableComponent', View::Components::Resources::Table \
    do |klass|
      mapped = columns.map do |col|
        View::Components::Table::ColumnDefinition.new(**col)
      end

      klass.define_method(:initialize) do |data:, resource:|
        super(columns: mapped, data: data, resource: resource)
      end
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    wrap_context 'with data' do
      let(:snapshot) do
        <<~HTML
          <h1 class="title">Rockets</h1>
          <table class="table is-striped">
            <thead>
            <tr>
              <th>Name</th>
              <th>Payload</th>
            </tr>
          </thead>
            <tbody>
            <tr>
            <td>
            Imp IV
          </td>
            <td>
            10 tonnes
          </td>
          </tr>
            <tr>
            <td>
            Imp VI
          </td>
            <td>
            10 tonnes
          </td>
          </tr>
            <tr>
            <td>
            Hellhound II
          </td>
            <td>
            100 tonnes
          </td>
          </tr>
          </tbody>
          </table>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end

  describe 'with resource name: multi-word String' do
    let(:resource) do
      Cuprum::Rails::Resource.new(resource_name: 'rocket_parts')
    end
    let(:snapshot) do
      <<~HTML
        <h1 class="title">Rocket Parts</h1>
        <div class="box">
          <p class="has-text-centered">
            <span class="icon is-large has-text-danger">
              <i class="fas fa-2x fa-bug"></i>
            </span>
          </p>
          <h2 class="title has-text-centered has-text-danger">Missing Component Table</h2>
          <p class="has-text-centered">Rendered in View::Pages::Resources::IndexPage</p>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
