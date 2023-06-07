# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Pages::MissingPage, type: :component do
  subject(:page) do
    described_class.new(
      result,
      action_name:     action_name,
      controller_name: controller_name,
      expected_page:   expected_page
    )
  end

  let(:result)          { Cuprum::Result.new }
  let(:action_name)     { :execute }
  let(:controller_name) { 'Namespace::CustomController' }
  let(:expected_page)   { 'View::Pages::Scoped::Custom::Execute' }
  let(:rendered)        { render_inline(page) }
  let(:snapshot) do
    <<~HTML
      <div class="content">
        <h1>Missing View::Pages::Scoped::Custom::Execute</h1>
        <p>
          The expected page component at
          <code>View::Pages::Scoped::Custom::Execute</code>
          was not found.
        </p>
        <p>
          The page was rendered from
          <code>Namespace::CustomController#execute</code>.
        </p>
        <h2>Result</h2>
        <p><strong>Status</strong></p>
        <pre>:success</pre>
        <p><strong>Value</strong></p>
        <pre>(none)</pre>
        <p><strong>Error</strong></p>
        <pre>(none)</pre>
        <p><strong>Metadata</strong></p>
        <pre>(none)</pre>
      </div>
    HTML
  end

  def prettify(html)
    html.to_s.gsub(/\n{2,}/, "\n")
  end

  it 'should match the snapshot' do
    expect(prettify(rendered)).to match_snapshot(snapshot)
  end

  describe 'with a failing result' do
    let(:error)  { Cuprum::Error.new(message: 'Something went wrong') }
    let(:result) { Cuprum::Result.new(error: error) }
    let(:snapshot) do
      <<~HTML
        <div class="content">
          <h1>Missing View::Pages::Scoped::Custom::Execute</h1>
          <p>
            The expected page component at
            <code>View::Pages::Scoped::Custom::Execute</code>
            was not found.
          </p>
          <p>
            The page was rendered from
            <code>Namespace::CustomController#execute</code>.
          </p>
          <h2>Result</h2>
          <p><strong>Status</strong></p>
          <pre>:failure</pre>
          <p><strong>Value</strong></p>
          <pre>(none)</pre>
          <p><strong>Error</strong></p>
          <pre>{"data"=&gt;{}, "message"=&gt;"Something went wrong", "type"=&gt;"cuprum.error"}</pre>
          <p><strong>Metadata</strong></p>
          <pre>(none)</pre>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with a passing result' do
    let(:value)  { { ok: true } }
    let(:result) { Cuprum::Result.new(value: value) }
    let(:snapshot) do
      <<~HTML
        <div class="content">
          <h1>Missing View::Pages::Scoped::Custom::Execute</h1>
          <p>
            The expected page component at
            <code>View::Pages::Scoped::Custom::Execute</code>
            was not found.
          </p>
          <p>
            The page was rendered from
            <code>Namespace::CustomController#execute</code>.
          </p>
          <h2>Result</h2>
          <p><strong>Status</strong></p>
          <pre>:success</pre>
          <p><strong>Value</strong></p>
          <pre>{"ok"=&gt;true}</pre>
          <p><strong>Error</strong></p>
          <pre>(none)</pre>
          <p><strong>Metadata</strong></p>
          <pre>(none)</pre>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end

  describe 'with a result with metadata' do
    let(:metadata) { { session: { token: '12345' } } }
    let(:result)   { Cuprum::Rails::Result.new(metadata: metadata) }
    let(:snapshot) do
      <<~HTML
        <div class="content">
          <h1>Missing View::Pages::Scoped::Custom::Execute</h1>
          <p>
            The expected page component at
            <code>View::Pages::Scoped::Custom::Execute</code>
            was not found.
          </p>
          <p>
            The page was rendered from
            <code>Namespace::CustomController#execute</code>.
          </p>
          <h2>Result</h2>
          <p><strong>Status</strong></p>
          <pre>:success</pre>
          <p><strong>Value</strong></p>
          <pre>(none)</pre>
          <p><strong>Error</strong></p>
          <pre>(none)</pre>
          <p><strong>Metadata</strong></p>
          <pre>{:session=&gt;{:token=&gt;"12345"}}</pre>
        </div>
      HTML
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end
  end
end
