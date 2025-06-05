class Localisation < ApplicationRecord
  # Associations
  has_many :emprunts

  # Validations
  validates :nom_localisation, presence: true
  validates :adresse, presence: true
  validates :code_postal, presence: true, length: { is: 5 }
  validates :ville, presence: true, length: { minimum: 3 }
  validates :pays, presence: true, length: { minimum: 5 }
  validates :email, format: { with: /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/ }, allow_nil: true
  validates :site_web, format: { with: /\A(https?:\/\/)?(www\.[a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?\z/ }, allow_nil: true
end 