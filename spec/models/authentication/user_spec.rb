# frozen_string_literal: true

require 'rails_helper'

require 'support/contracts/model_contracts'

RSpec.describe Authentication::User, type: :model do
  include Spec::Support::Contracts::ModelContracts

  subject(:user) { described_class.new(attributes) }

  let(:attributes) do
    {
      email:    'alan.bradley@example.com',
      username: 'Alan Bradley'
    }
  end

  include_contract 'should be a model', slug: false

  ### Attributes
  include_contract 'should define attribute',
    :email,
    default: ''
  include_contract 'should define attribute',
    :username,
    default: ''

  describe '#valid?' do
    it { expect(user.valid?).to be true }

    include_contract 'should validate the format of',
      :email,
      message:     'must be an email address',
      matching:    {
        'user@example.com'             => 'an email address',
        'scoped.user@demo.example.com' => 'a scoped email address'
      },
      nonmatching: {
        'user'         => 'a plain string',
        '@'            => 'an @ sign',
        '@example.com' => 'a domain',
        'user@'        => 'a username'
      }
    include_contract 'should validate the presence of',
      :email,
      type: String
    include_contract 'should validate the uniqueness of',
      :email,
      factory_name: :authentication_user

    include_contract 'should validate the presence of',
      :username,
      type: String
    include_contract 'should validate the uniqueness of',
      :username,
      factory_name: :authentication_user
  end
end
