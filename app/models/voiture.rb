class Voiture < ApplicationRecord
  # Associations
  belongs_to :entreprise
  belongs_to :site
  has_many :cles
  has_many :emprunts

  # Validations
  validates :marque, presence: true
  validates :modele, presence: true
  validates :année_fabrication, presence: true, numericality: { only_integer: true }
  validates :immatriculation, presence: true, uniqueness: true
  validates :carburant, presence: true
  validates :couleur, presence: true
  validates :puissance, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :nombre_portes, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :nombre_places, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :type_boite, presence: true
  validates :statut_voiture, presence: true

  def to_format
    {
      id:,
      site_id:,
      immatriculation:,
      modele:,
      marque:,
      statut_voiture:,
      année_fabrication:,
      carburant:,
      couleur:,
      puissance:,
      nombre_portes:,
      nombre_places:,
      type_boite:,
      lien_image_voiture:,
      updated_at:
    }
  end
end
