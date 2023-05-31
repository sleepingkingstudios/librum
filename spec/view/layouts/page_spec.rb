# frozen_string_literal: true

require 'rails_helper'

require 'support/components/mock_component'

RSpec.describe View::Layouts::Page, type: :component do
  subject(:component) { described_class.new(**options).with_content(content) }

  let(:content)  { 'Greetings, Starfighter!' }
  let(:options)  { {} }
  let(:rendered) { render_inline(component) }
  let(:snapshot) do
    <<~HTML
      <div class="page is-flex is-flex-direction-column">
        <mock name="Banner" navigation="[]"></mock>
        <section class="section primary-content is-flex-grow-1">
          <div class="container">
            Greetings, Starfighter!
          </div>
        </section>
        <mock name="Footer"></mock>
      </div>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n{2,}/, "\n")
  end

  before(:example) do
    allow(View::Layouts::Page::Banner).to receive(:new) do |options|
      Spec::Support::Components::MockComponent.new('Banner', **options)
    end

    allow(View::Layouts::Page::Footer)
      .to receive(:new)
      .and_return(Spec::Support::Components::MockComponent.new('Footer'))
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:alerts, :current_user, :navigation)
    end
  end

  it 'should render the content' do
    expect(rendered).to have_text(content)
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with alerts: value' do
    let(:alerts) do
      {
        danger: {
          icon:    'radiation',
          message: 'Reactor temperature critical'
        },
        info:   'Initializing activation sequence'
      }
    end
    let(:options) { super().merge(alerts: alerts) }
    let(:snapshot) do
      <<~HTML
        <div class="page is-flex is-flex-direction-column">
          <mock name="Banner" navigation="[]"></mock>
          <section class="section primary-content is-flex-grow-1">
            <div class="container">
              <mock name="Alerts"></mock>
              Greetings, Starfighter!
            </div>
          </section>
          <mock name="Footer"></mock>
        </div>
      HTML
    end

    before(:example) do
      allow(View::Layouts::Page::Alerts)
        .to receive(:new)
        .and_return(Spec::Support::Components::MockComponent.new('Alerts'))
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with current_user: value' do
    let(:current_user) do
      FactoryBot.build(:authentication_user, username: 'Alan Bradley')
    end
    let(:options) { super().merge(current_user: current_user) }
    let(:snapshot) do
      <<~HTML
        <div class="page is-flex is-flex-direction-column">
          <mock name="Banner" navigation="[]"></mock>
          <section class="section primary-content is-flex-grow-1">
            <div class="container">
              <mock name="Session" current_user='"Alan' bradley></mock>
              Greetings, Starfighter!
            </div>
          </section>
          <mock name="Footer"></mock>
        </div>
      HTML
    end

    before(:example) do
      allow(View::Layouts::Page::Session).to receive(:new) do |options|
        Spec::Support::Components::MockComponent
          .new('Session', current_user: options[:current_user].username)
      end
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with navigation: false' do
    let(:options) { super().merge(navigation: false) }
    let(:snapshot) do
      <<~HTML
        <div class="page is-flex is-flex-direction-column">
          <mock name="Banner" navigation="false"></mock>
          <section class="section primary-content is-flex-grow-1">
            <div class="container">
              Greetings, Starfighter!
            </div>
          </section>
          <mock name="Footer"></mock>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
