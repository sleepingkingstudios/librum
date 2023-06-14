# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Table, type: :component do
  subject(:table) { described_class.new(**constructor_options) }

  shared_context 'with data' do
    let(:data) do
      [
        {
          'first_name' => 'Alan',
          'last_name'  => 'Bradley',
          'role'       => 'user'
        },
        {
          'first_name' => 'Kevin',
          'last_name'  => 'Flynn',
          'role'       => 'user'
        },
        {
          'first_name' => 'Ed',
          'last_name'  => 'Dillinger',
          'role'       => 'admin'
        }
      ]
    end
  end

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

  let(:columns) do
    [
      { key: 'first_name' },
      {
        key:   'last_name',
        label: 'Surname'
      },
      { key: 'role' }
    ]
  end
  let(:data) { [] }
  let(:constructor_options) do
    {
      columns: columns,
      data:    data
    }
  end
  let(:rendered) { render_inline(table) }
  let(:snapshot) do
    <<~HTML
      <table class="table">
        <thead>
        <tr>
          <th>First Name</th>
          <th>Surname</th>
          <th>Role</th>
        </tr>
      </thead>
        <tbody>
        <tr>
        <td colspan="3">There are no matching items.</td>
      </tr>
      </tbody>
      </table>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
  end

  describe '.new' do
    let(:expected_keywords) do
      %i[
        body_component
        cell_component
        class_names
        columns
        data
        empty_message
        footer_component
        header_component
        row_component
      ]
    end

    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(*expected_keywords)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  wrap_context 'with data' do
    let(:snapshot) do
      <<~HTML
        <table class="table">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Role</th>
          </tr>
        </thead>
          <tbody>
          <tr>
          <td>
          Alan
        </td>
          <td>
          Bradley
        </td>
          <td>
          user
        </td>
        </tr>
          <tr>
          <td>
          Kevin
        </td>
          <td>
          Flynn
        </td>
          <td>
          user
        </td>
        </tr>
          <tr>
          <td>
          Ed
        </td>
          <td>
          Dillinger
        </td>
          <td>
          admin
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

  describe 'with body_component: value' do
    include_context 'with data'
    include_context 'with mock component', 'body'

    let(:snapshot) do
      <<~HTML
        <table class="table">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Role</th>
          </tr>
        </thead>
          <mock name="body" cell_component="nil" columns='[{:key=&gt;"first_name"}, {:key=&gt;"last_name", :label=&gt;"Surname"}, {:key=&gt;"role"}]' data='[{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}, {"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}, {"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}]' empty_message="nil" row_component="nil"></mock>
        </table>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with cell_component: value' do
    include_context 'with data'
    include_context 'with mock component', 'cell'

    let(:snapshot) do
      <<~HTML
        <table class="table">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Role</th>
          </tr>
        </thead>
          <tbody>
          <tr>
          <mock name="cell" column='{:key=&gt;"first_name"}' data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}'></mock>
          <mock name="cell" column='{:key=&gt;"last_name", :label=&gt;"Surname"}' data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}'></mock>
          <mock name="cell" column='{:key=&gt;"role"}' data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}'></mock>
        </tr>
          <tr>
          <mock name="cell" column='{:key=&gt;"first_name"}' data='{"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}'></mock>
          <mock name="cell" column='{:key=&gt;"last_name", :label=&gt;"Surname"}' data='{"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}'></mock>
          <mock name="cell" column='{:key=&gt;"role"}' data='{"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}'></mock>
        </tr>
          <tr>
          <mock name="cell" column='{:key=&gt;"first_name"}' data='{"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}'></mock>
          <mock name="cell" column='{:key=&gt;"last_name", :label=&gt;"Surname"}' data='{"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}'></mock>
          <mock name="cell" column='{:key=&gt;"role"}' data='{"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}'></mock>
        </tr>
        </tbody>
        </table>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with class_names: value' do
    let(:class_names)         { 'is-striped custom-class' }
    let(:constructor_options) { super().merge(class_names: class_names) }
    let(:snapshot) do
      <<~HTML
        <table class="table is-striped custom-class">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Role</th>
          </tr>
        </thead>
          <tbody>
          <tr>
          <td colspan="3">There are no matching items.</td>
        </tr>
        </tbody>
        </table>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with empty_message: value' do
    let(:empty_message)       { 'Something went wrong.' }
    let(:constructor_options) { super().merge(empty_message: empty_message) }
    let(:snapshot) do
      <<~HTML
        <table class="table">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Role</th>
          </tr>
        </thead>
          <tbody>
          <tr>
          <td colspan="3">Something went wrong.</td>
        </tr>
        </tbody>
        </table>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with footer_component: value' do
    include_context 'with mock component', 'footer'

    let(:snapshot) do
      <<~HTML
        <table class="table">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Role</th>
          </tr>
        </thead>
          <tbody>
          <tr>
          <td colspan="3">There are no matching items.</td>
        </tr>
        </tbody>
          <mock name="footer"></mock>
        </table>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with header_component: value' do
    include_context 'with mock component', 'header'

    let(:snapshot) do
      <<~HTML
        <table class="table">
          <mock name="header" columns='[{:key=&gt;"first_name"}, {:key=&gt;"last_name", :label=&gt;"Surname"}, {:key=&gt;"role"}]'></mock>
          <tbody>
          <tr>
          <td colspan="3">There are no matching items.</td>
        </tr>
        </tbody>
        </table>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with row_component: value' do
    include_context 'with data'
    include_context 'with mock component', 'row'

    let(:snapshot) do
      <<~HTML
        <table class="table">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Surname</th>
            <th>Role</th>
          </tr>
        </thead>
          <tbody>
          <mock name="row" cell_component="View::Components::Table::Cell" columns='[{:key=&gt;"first_name"}, {:key=&gt;"last_name", :label=&gt;"Surname"}, {:key=&gt;"role"}]' data='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}'></mock>
          <mock name="row" cell_component="View::Components::Table::Cell" columns='[{:key=&gt;"first_name"}, {:key=&gt;"last_name", :label=&gt;"Surname"}, {:key=&gt;"role"}]' data='{"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}'></mock>
          <mock name="row" cell_component="View::Components::Table::Cell" columns='[{:key=&gt;"first_name"}, {:key=&gt;"last_name", :label=&gt;"Surname"}, {:key=&gt;"role"}]' data='{"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}'></mock>
        </tbody>
        </table>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
