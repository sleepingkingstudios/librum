# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Components::FormInput, type: :component do
  subject(:input) { described_class.new(name, **options) }

  let(:name)     { 'username' }
  let(:options)  { {} }
  let(:rendered) { render_inline(input) }
  let(:snapshot) do
    <<~HTML
      <input name="username" class="input" type="text">
    HTML
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(1).argument
        .and_keywords(:errors, :id, :type)
    end
  end

  it 'should match the snapshot' do
    expect(rendered).to match_snapshot(snapshot)
  end

  describe 'with errors: an empty Array' do
    let(:errors)  { [] }
    let(:options) { super().merge(errors: errors) }

    it 'should match the snapshot' do
      expect(rendered).to match_snapshot(snapshot)
    end
  end

  describe 'with errors: a non-empty Array' do
    let(:errors)  { ["can't be blank"] }
    let(:options) { super().merge(errors: errors) }
    let(:snapshot) do
      <<~HTML
        <input name="username" class="input is-danger" type="text">
      HTML
    end

    it 'should match the snapshot' do
      expect(rendered).to match_snapshot(snapshot)
    end
  end

  describe 'with id: value' do
    let(:name)    { 'user[username]' }
    let(:id)      { 'user_username' }
    let(:options) { super().merge(id: id) }
    let(:snapshot) do
      <<~HTML
        <input id="user_username" name="user[username]" class="input" type="text">
      HTML
    end

    it 'should match the snapshot' do
      expect(rendered).to match_snapshot(snapshot)
    end
  end

  describe 'with type: value' do
    let(:options) { super().merge(type: 'email') }
    let(:snapshot) do
      <<~HTML
        <input name="username" class="input" type="email">
      HTML
    end

    it 'should match the snapshot' do
      expect(rendered).to match_snapshot(snapshot)
    end
  end
end
