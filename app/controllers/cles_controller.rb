class ClesController < ApplicationController
  before_action :verify_authentication

  def fetch_all
    entreprise_sites = Site.all.where(entreprise_id: @current_user.entreprise_id)
    siteIds = entreprise_sites.map do |site|
      site.id
    end

    cles = Cle.all.where(site_id: siteIds)
    cles = cles.map(&:to_format)

    render json: cles
  end

  def create
    params["data"].permit!

    attributes = params["data"].to_h
    newKey = Cle.create(attributes)

    render json: newKey.to_format
  end

  def update
    params["data"].permit!

    attributes = params["data"].to_h

    Cle.find(attributes["id"]).update(attributes)
    updatedKey = Cle.find(attributes["id"])

    render json: updatedKey.to_format
  end

  def delete
    Cle.find(params["id"]).delete

    render json: { "id" => params["id"] }
  end
end
