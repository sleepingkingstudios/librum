# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClientController, type: :request do
  describe '#index' do
    it 'should respond with 200 OK' do
      get '/'

      expect(response).to have_http_status(:ok)
    end
  end
end
