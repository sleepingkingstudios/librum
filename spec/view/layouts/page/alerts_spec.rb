# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Alerts, type: :component do
  subject(:alerts) { described_class.new(alerts: data) }

  let(:data) do
    {
      danger: {
        icon:    'radiation',
        message: 'Reactor temperature critical'
      },
      info:   'Initializing activation sequence'
    }
  end
  let(:rendered) { render_inline(alerts) }
  let(:snapshot) do
    <<~HTML
      <div class="notification is-danger">
        <span class="icon-text">
          <span class="icon">
            <i class="fas fa-radiation"></i>
          </span>
          <span>Reactor temperature critical</span>
        </span>
      </div>
      <div class="notification is-info">
        Initializing activation sequence
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
        .and_keywords(:alerts)
    end
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end
end
