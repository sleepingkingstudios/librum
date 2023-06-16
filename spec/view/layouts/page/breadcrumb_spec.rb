# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Breadcrumb, type: :component do
  subject(:page_breadcrumb) { described_class.new(breadcrumb: breadcrumb) }

  let(:label)   { 'Zeppelins' }
  let(:url)     { '/launch_sites/zeppelins' }
  let(:options) { {} }
  let(:breadcrumb) do
    View::Layouts::Page::Breadcrumbs::BreadcrumbDefinition.new(
      label: label,
      url:   url,
      **options
    )
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:breadcrumb)
    end
  end

  describe '#call' do
    let(:rendered) { render_inline(page_breadcrumb) }
    let(:snapshot) do
      <<~HTML
        <li>
          <a href="/launch_sites/zeppelins">Zeppelins</a>
        </li>
      HTML
    end

    def prettify(html)
      html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    context 'with a breadcrumb with active: true' do
      let(:options) { super().merge(active: true) }
      let(:snapshot) do
        <<~HTML
          <li class="is-active">
            <a href="/launch_sites/zeppelins" aria-current="page">Zeppelins</a>
          </li>
        HTML
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
