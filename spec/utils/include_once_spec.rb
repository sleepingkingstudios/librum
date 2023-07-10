# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Utils::IncludeOnce do
  # Test cases:
  # - module A is included in class B twice
  # - modules A, B are included in class C
  # - module A is included in classes B, C

  let(:described_class) { Spec::ExampleMixin }

  example_constant 'Spec::ExampleMixin' do
    Module.new { extend Utils::IncludeOnce }
  end

  describe '.included' do
    before(:example) do
      allow(Spec::ExampleMixin).to receive(:included_once)
    end

    context 'when the module is included in a class' do
      example_class 'Spec::ExampleClass'

      it 'should call .included_once with the class' do
        Spec::ExampleClass.include(described_class)

        expect(described_class)
          .to have_received(:included_once)
          .exactly(1).times
          .with(Spec::ExampleClass)
      end
    end

    context 'when the module is included in a class multiple times' do
      example_class 'Spec::ExampleClass'

      it 'should call .included_once with the class' do
        3.times { Spec::ExampleClass.include(described_class) }

        expect(described_class)
          .to have_received(:included_once)
          .exactly(1).times
          .with(Spec::ExampleClass)
      end
    end

    context 'when the module is included in multiple classes' do
      example_class 'Spec::ExampleClass'

      example_class 'Spec::OtherClass'

      it 'should call .included_once with each class', :aggregate_failures do # rubocop:disable RSpec/ExampleLength
        Spec::ExampleClass.include(described_class)
        Spec::OtherClass.include(described_class)

        expect(described_class)
          .to have_received(:included_once)
          .with(Spec::ExampleClass)
          .exactly(1).times

        expect(described_class)
          .to have_received(:included_once)
          .with(Spec::OtherClass)
          .exactly(1).times
      end
    end
  end
end
