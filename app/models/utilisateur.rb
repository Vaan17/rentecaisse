class Utilisateur < ApplicationRecord
  # Associations
  belongs_to :entreprise, optional: true
  belongs_to :site, optional: true
  has_many :cles
  has_many :emprunts, foreign_key: 'utilisateur_demande_id'
  has_many :liste_passagers

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/ }
  validates :password, presence: true
  validates :admin_entreprise, inclusion: { in: [true, false] }
  validates :admin_rentecaisse, inclusion: { in: [true, false] }
  validates :email_confirme, inclusion: { in: [true, false] }
  validates :premiere_connexion, inclusion: { in: [true, false] }
  validates :date_creation_utilisateur, presence: true
  validates :date_modification_utilisateur, presence: true

  # Validations conditionnelles pour les champs optionnels
  validates :nom, length: { minimum: 3 }, allow_nil: true
  validates :prenom, length: { minimum: 3 }, allow_nil: true
  validates :adresse, length: { minimum: 10 }, allow_nil: true
  validates :code_postal, length: { is: 5 }, allow_nil: true
  validates :ville, length: { minimum: 3 }, allow_nil: true
  validates :pays, length: { minimum: 5 }, allow_nil: true
end 