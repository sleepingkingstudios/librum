# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::Table::Row, type: :component do
  subject(:row) { described_class.new(**constructor_options) }

  let(:columns) do
    [
      { key: 'first_name' },
      { key: 'last_name' },
      { key: 'role' }
    ]
  end
  let(:item) do
    Spec::User.new(
      first_name: 'Alan',
      last_name:  'Bradley',
      role:       'user'
    )
  end
  let(:constructor_options) do
    mapped = columns.map do |col|
      View::Components::Table::ColumnDefinition.new(**col)
    end

    {
      columns: mapped,
      item:    item
    }
  end
  let(:rendered) { render_inline(row) }
  let(:snapshot) do
    <<~HTML
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
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n{2,}/, "\n")
  end

  example_class 'Spec::User', Struct.new(:first_name, :last_name, :role) \
  do |klass|
    klass.define_method(:inspect) do
      %(#<User name="#{first_name} #{last_name}">)
    end
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:cell_component, :columns, :item)
        .and_any_keywords
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with cell_component: value' do
    let(:constructor_options) do
      super().merge(cell_component: Spec::CellComponent)
    end
    let(:snapshot) do
      <<~HTML
        <tr>
          <mock name="cell" column='#&lt;Column key="first_name"&gt;' item='#&lt;User name="Alan Bradley"&gt;'></mock>
          <mock name="cell" column='#&lt;Column key="last_name"&gt;' item='#&lt;User name="Alan Bradley"&gt;'></mock>
          <mock name="cell" column='#&lt;Column key="role"&gt;' item='#&lt;User name="Alan Bradley"&gt;'></mock>
        </tr>
      HTML
    end

    example_class 'Spec::CellComponent', View::Components::MockComponent \
    do |klass|
      klass.define_method(:initialize) { |**options| super('cell', **options) }
    end

    before(:example) do
      row.columns.each do |column|
        allow(column)
          .to receive(:inspect)
          .and_return(%(#<Column key="#{column.key}">))
      end
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    describe 'with custom options' do
      let(:constructor_options) do
        super().merge(option: 'value')
      end
      let(:snapshot) do
        <<~HTML
          <tr>
            <mock name="cell" column='#&lt;Column key="first_name"&gt;' item='#&lt;User name="Alan Bradley"&gt;' option="value"></mock>
            <mock name="cell" column='#&lt;Column key="last_name"&gt;' item='#&lt;User name="Alan Bradley"&gt;' option="value"></mock>
            <mock name="cell" column='#&lt;Column key="role"&gt;' item='#&lt;User name="Alan Bradley"&gt;' option="value"></mock>
          </tr>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
