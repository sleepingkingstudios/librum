# frozen_string_literal: true

require 'rails_helper'

RSpec.describe View::Layouts::Page::Breadcrumbs, type: :component do
  subject(:page_breadcrumbs) { described_class.new(breadcrumbs: breadcrumbs) }

  let(:breadcrumbs) do
    [
      {
        label: 'Home',
        url:   '/'
      },
      {
        label: 'Launch Sites',
        url:   '/launch_sites'
      },
      {
        active: true,
        label:  'Zeppelins',
        url:    '/launch_sites/zeppelins'
      }
    ]
  end

  describe '::BreadcrumbDefinition' do
    subject(:breadcrumb) { described_class.new(**options) }

    let(:described_class) { super()::BreadcrumbDefinition }
    let(:label)           { 'Zeppelins' }
    let(:url)             { '/launch_sites/zeppelins' }
    let(:options)         { { label: label, url: url } }

    describe '.new' do
      it 'should define the constructor' do
        expect(described_class)
          .to be_constructible
          .with(0).arguments
          .and_keywords(:active, :label, :url)
      end
    end

    describe '#active' do
      include_examples 'should define reader', :active, false

      context 'when initialized with active: false' do
        let(:options) { super().merge(active: false) }

        it { expect(breadcrumb.active).to be false }
      end

      context 'when initialized with active: true' do
        let(:options) { super().merge(active: true) }

        it { expect(breadcrumb.active).to be true }
      end
    end

    describe '#label' do
      include_examples 'should define reader', :label, -> { label }
    end

    describe '#url' do
      include_examples 'should define reader', :url, -> { url }
    end
  end

  describe '.new' do
    it 'should define the constructor' do
      expect(described_class)
        .to be_constructible
        .with(0).arguments
        .and_keywords(:breadcrumbs)
    end
  end

  describe '#call' do
    let(:rendered) { render_inline(page_breadcrumbs) }
    let(:snapshot) do
      <<~HTML
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
          <ul>
            <li>
          <a href="/">Home</a>
        </li>
            <li>
          <a href="/launch_sites">Launch Sites</a>
        </li>
            <li class="is-active">
          <a href="/launch_sites/zeppelins" aria-current="page">Zeppelins</a>
        </li>
          </ul>
        </nav>
      HTML
    end

    def prettify(html)
      html.to_s.gsub(/\n\s+$/, "\n").gsub(/\n{2,}/, "\n")
    end

    it 'should match the snapshot' do
      expect(prettify(rendered)).to match_snapshot(snapshot)
    end

    context 'when initialized with breadcrumbs: BreadcrumbDefinitions' do
      let(:breadcrumbs) do
        super().map do |breadcrumb|
          described_class::BreadcrumbDefinition.new(**breadcrumb)
        end
      end

      it 'should match the snapshot' do
        expect(prettify(rendered)).to match_snapshot(snapshot)
      end
    end
  end
end
