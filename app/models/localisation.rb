class Localisation < ApplicationRecord
  # Associations
  has_many :emprunts

  # Validations
  validates :nom_localisation, presence: true
  validates :adresse, presence: true
  validates :code_postal, length: { is: 5 }, allow_blank: true
  validates :ville, presence: true, length: { minimum: 3 }
  validates :pays, length: { minimum: 5 }, allow_blank: true
  validates :email, format: { with: /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/ }, allow_blank: true
  validates :site_web, format: { with: /\A(https?:\/\/)?(www\.)?[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,6}(\/[^\s]*)?\z/ }, allow_blank: true
end 