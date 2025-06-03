class Entreprise < ApplicationRecord
  # Associations
  has_many :sites, dependent: :destroy
  has_many :utilisateurs
  has_many :voitures

  # Validations
  validates :nom_entreprise, presence: true
  validates :forme_juridique, presence: true, inclusion: { in: ['SA', 'SARL', 'SAS', 'EURL', 'EI', 'SC', 'SCS', 'SNC'] }
  validates :numero_siret, presence: true, uniqueness: true, length: { in: 9..14 }
  validates :adresse, presence: true, length: { minimum: 10 }
  validates :code_postal, presence: true, length: { is: 5 }
  validates :ville, presence: true, length: { minimum: 3 }
  validates :pays, presence: true, length: { minimum: 5 }
  validates :telephone, presence: true
  validates :email, presence: true, format: { with: /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/ }
  validates :site_web, presence: true, format: { with: /\A(https?:\/\/)?(www\.[a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?\z/ }
  validates :secteur_activite, presence: true
  validates :effectif, presence: true, numericality: { greater_than: 0 }
  validates :capital_social, presence: true, numericality: { greater_than: 0 }
  validates :code_entreprise, presence: true
end 