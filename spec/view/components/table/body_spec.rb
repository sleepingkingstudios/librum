# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Table::Body, type: :component do
  subject(:body) { described_class.new(**constructor_options) }

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

  let(:columns) do
    [
      { key: 'first_name' },
      { key: 'last_name' },
      { key: 'role' }
    ]
  end
  let(:data) { [] }
  let(:constructor_options) do
    mapped = columns.map do |col|
      View::Components::Table::ColumnDefinition.new(**col)
    end

    {
      columns: mapped,
      data:    data
    }
  end
  let(:rendered) { render_inline(body) }
  let(:snapshot) do
    <<~HTML
      <tbody>
        <tr>
        <td colspan="3">There are no matching items.</td>
      </tr>
      </tbody>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n{2,}/, "\n")
  end

  describe '.new' do
    let(:expected_keywords) do
      %i[
        cell_component
        columns
        data
        empty_message
        row_component
      ]
    end

    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(*expected_keywords)
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  wrap_context 'with data' do
    let(:snapshot) do
      <<~HTML
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
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with cell_component: value' do
    include_context 'with data'

    let(:constructor_options) do
      super().merge(cell_component: Spec::CellComponent)
    end
    let(:snapshot) do
      <<~HTML
        <tbody>
          <tr>
          <mock name="cell" column='#&lt;Column key="first_name"&gt;' item='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}'></mock>
          <mock name="cell" column='#&lt;Column key="last_name"&gt;' item='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}'></mock>
          <mock name="cell" column='#&lt;Column key="role"&gt;' item='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}'></mock>
        </tr>
          <tr>
          <mock name="cell" column='#&lt;Column key="first_name"&gt;' item='{"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}'></mock>
          <mock name="cell" column='#&lt;Column key="last_name"&gt;' item='{"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}'></mock>
          <mock name="cell" column='#&lt;Column key="role"&gt;' item='{"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}'></mock>
        </tr>
          <tr>
          <mock name="cell" column='#&lt;Column key="first_name"&gt;' item='{"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}'></mock>
          <mock name="cell" column='#&lt;Column key="last_name"&gt;' item='{"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}'></mock>
          <mock name="cell" column='#&lt;Column key="role"&gt;' item='{"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}'></mock>
        </tr>
        </tbody>
      HTML
    end

    example_class 'Spec::CellComponent', View::Components::MockComponent \
    do |klass|
      klass.define_method(:initialize) { |**options| super('cell', **options) }
    end

    before(:example) do
      body.columns.each do |column|
        allow(column)
          .to receive(:inspect)
          .and_return(%(#<Column key="#{column.key}">))
      end
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with empty_message: a String' do
    let(:empty_message)       { 'Something went wrong.' }
    let(:constructor_options) { super().merge(empty_message: empty_message) }
    let(:snapshot) do
      <<~HTML
        <tbody>
          <tr>
          <td colspan="3">Something went wrong.</td>
        </tr>
        </tbody>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with empty_message: a ViewComponent' do
    let(:empty_message)       { Spec::EmptyMessage.new }
    let(:constructor_options) { super().merge(empty_message: empty_message) }
    let(:snapshot) do
      <<~HTML
        <tbody>
          <mock name="empty_message"></mock>
        </tbody>
      HTML
    end

    example_class 'Spec::EmptyMessage', View::Components::MockComponent \
    do |klass|
      klass.define_method(:initialize) { super('empty_message') }
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with row_component: value' do
    include_context 'with data'

    let(:constructor_options) do
      super().merge(row_component: Spec::RowComponent)
    end
    let(:snapshot) do
      <<~HTML
        <tbody>
          <mock name="row" cell_component="View::Components::Table::Cell" columns='[#&lt;Column key="first_name"&gt;, #&lt;Column key="last_name"&gt;, #&lt;Column key="role"&gt;]' item='{"first_name"=&gt;"Alan", "last_name"=&gt;"Bradley", "role"=&gt;"user"}'></mock>
          <mock name="row" cell_component="View::Components::Table::Cell" columns='[#&lt;Column key="first_name"&gt;, #&lt;Column key="last_name"&gt;, #&lt;Column key="role"&gt;]' item='{"first_name"=&gt;"Kevin", "last_name"=&gt;"Flynn", "role"=&gt;"user"}'></mock>
          <mock name="row" cell_component="View::Components::Table::Cell" columns='[#&lt;Column key="first_name"&gt;, #&lt;Column key="last_name"&gt;, #&lt;Column key="role"&gt;]' item='{"first_name"=&gt;"Ed", "last_name"=&gt;"Dillinger", "role"=&gt;"admin"}'></mock>
        </tbody>
      HTML
    end

    example_class 'Spec::RowComponent', View::Components::MockComponent \
    do |klass|
      klass.define_method(:initialize) { |**options| super('row', **options) }
    end

    before(:example) do
      body.columns.each do |column|
        allow(column)
          .to receive(:inspect)
          .and_return(%(#<Column key="#{column.key}">))
      end
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
