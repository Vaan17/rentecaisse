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
  validates :site_web, presence: true, format: { with: /\A(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(?::\d{1,5})?(\/[^\s]*)?\z/, message: "value doesn't match with regex" }

  def to_format
    {
      id:,
      entreprise_id:,
      nom_site:,
      adresse:,
      code_postal:,
      ville:,
      pays:,
      telephone:,
      email:,
      site_web:,
      lien_image_site:,
      updated_at:
    }
  end
end
