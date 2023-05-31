# frozen_string_literal: true

module View::Components
  # Renders a basic form input.
  class FormInput < ViewComponent::Base
    include View::ErrorMatching

    # @param errors [Stannum::Errors, Array<String>] the form errors to apply.
    # @param id [String] a unique identifier for the input.
    # @param name [String] the scoped name of the form input.
    # @param type [String] the input type.
    def initialize(name, errors: nil, id: nil, type: 'text')
      super()

      @errors = errors
      @id     = id
      @name   = name
      @type   = type
    end

    # @return [Stannum::Errors, Array<String>] the form errors to apply.
    attr_reader :errors

    # @return [String] a unique identifier for the input.
    attr_reader :id

    # @return [String] the scoped name of the form input.
    attr_reader :name

    # @return [String] the input type.
    attr_reader :type

    private

    def class_names
      names = %w[input]

      names << 'is-danger' if matching_errors.any?

      names.join(' ')
    end
  end
end
