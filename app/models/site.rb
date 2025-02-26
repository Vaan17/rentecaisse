class Site < ApplicationRecord
  # Associations
  belongs_to :entreprise
  has_many :utilisateurs
  has_many :voitures
  has_many :cles

  # Validations
  validates :nom_site, presence: true
  validates :adresse, presence: true
  validates :code_postal, presence: true, length: { is: 5 }
  validates :ville, presence: true, length: { minimum: 3 }
  validates :pays, presence: true, length: { minimum: 5 }
  validates :telephone, presence: true
  validates :email, presence: true, format: { with: /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/ }
  validates :site_web, presence: true, format: { with: /\A(https?:\/\/)?(www\.[a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?\z/ }
  validates :date_creation_site, presence: true
  validates :date_modification_site, presence: true
end 