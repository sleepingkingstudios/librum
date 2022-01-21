# frozen_string_literal: true

module Spec::Support
  module Matchers
    def be_callable
      respond_to(:process, true)
    end
  end
end
